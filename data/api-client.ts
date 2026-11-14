export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export type Envelope<T> = {
  success: boolean;
  msg?: string;
  data: T;
  demo?: boolean;
};
type Tokens = { access_token: string; refresh_token: string };
type Storage = {
  read: () => Promise<string | null>;
  write: (value: string | null) => Promise<void>;
};

export function createApiClient(baseURL: string, storage: Storage) {
  let accessToken: string | null = null;
  let generation = 0;
  let refreshing: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  let storageQueue: Promise<void> = Promise.resolve();
  const persist = (value: string | null, version: number) => {
    const write = storageQueue
      .catch(() => {})
      .then(async () => {
        if (version === generation) await storage.write(value);
      });
    storageQueue = write;
    return write;
  };
  const clear = async () => {
    const version = ++generation;
    accessToken = null;
    listeners.forEach((listener) => listener());
    await persist(null, version);
  };
  const raw = async <T>(
    path: string,
    body?: unknown,
    method = "GET",
    headers: Record<string, string> = {},
  ): Promise<Envelope<T>> => {
    if (!baseURL) throw new ApiError(0, "The API address is not configured.");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    let response: Response;
    try {
      response = await fetch(`${baseURL.replace(/\/$/, "")}/${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: controller.signal,
      });
    } catch {
      throw new ApiError(
        0,
        "Cannot reach the server. Check your connection and API address.",
      );
    } finally {
      clearTimeout(timer);
    }
    let json: Envelope<T>;
    try {
      json = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        "The server returned an invalid response.",
      );
    }
    if (!response.ok || !json.success)
      throw new ApiError(
        response.status,
        json.msg || "Request failed. Please try again.",
      );
    return json;
  };
  const accept = async (tokens: Tokens, expected?: number) => {
    const version = expected === undefined ? ++generation : expected;
    if (version !== generation)
      throw new ApiError(401, "Session changed. Please sign in again.");
    await persist(tokens.refresh_token, version);
    if (version !== generation)
      throw new ApiError(401, "Session changed. Please sign in again.");
    accessToken = tokens.access_token;
  };
  const refresh = () => {
    if (refreshing) return refreshing;
    const expected = generation;
    refreshing = (async () => {
      const token = await storage.read();
      if (!token) throw new ApiError(401, "Please sign in.");
      try {
        const result = await raw<Tokens>(
          "refresh",
          { refresh_token: token },
          "POST",
        );
        await accept(result.data, expected);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 401 &&
          expected === generation
        )
          await clear();
        throw error;
      }
    })().finally(() => {
      refreshing = null;
    });
    return refreshing;
  };
  const request = async <T>(
    path: string,
    body?: unknown,
    options: { method?: string; public?: boolean; key?: string } = {},
  ): Promise<Envelope<T>> => {
    if (!options.public && !accessToken) await refresh();
    const send = () =>
      raw<T>(
        path,
        body,
        options.method || (body === undefined ? "GET" : "POST"),
        {
          ...(!options.public && accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
          ...(options.key ? { "Idempotency-Key": options.key } : {}),
        },
      );
    try {
      return await send();
    } catch (error) {
      if (
        !options.public &&
        error instanceof ApiError &&
        error.status === 401 &&
        /^Invalid or expired token|^Invalid session|^Session expired|^Account or session|^Account credentials changed/i.test(
          error.message,
        )
      ) {
        await refresh();
        return send();
      }
      throw error;
    }
  };
  return {
    request,
    refresh,
    clear,
    accept,
    hasStoredSession: async () => Boolean(await storage.read()),
    onSignedOut: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
