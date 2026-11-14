import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
const source = ts.transpileModule(
  readFileSync(new URL("./data/api-client.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { createApiClient } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const reply = (status, data, msg) =>
  new Response(JSON.stringify({ success: status < 400, data, msg }), {
    status,
    headers: { "content-type": "application/json" },
  });

test("refresh is shared across concurrent requests and uses the rotated bearer token", async () => {
  const original = globalThis.fetch;
  let stored = "initial";
  let refreshes = 0;
  const headers = [];
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/refresh")) {
      refreshes++;
      await new Promise((r) => setTimeout(r, 10));
      return reply(200, {
        access_token: "rotated",
        refresh_token: "new-refresh",
      });
    }
    headers.push(options.headers.Authorization);
    return reply(200, { id: "account" });
  };
  try {
    const api = createApiClient("http://example.test", {
      read: async () => stored,
      write: async (v) => {
        stored = v;
      },
    });
    await Promise.all([api.request("profile"), api.request("wallet")]);
    assert.equal(refreshes, 1);
    assert.equal(stored, "new-refresh");
    assert.deepEqual(headers, ["Bearer rotated", "Bearer rotated"]);
  } finally {
    globalThis.fetch = original;
  }
});
test("incorrect M-PIN does not refresh or destroy a valid session", async () => {
  const original = globalThis.fetch;
  let stored = null;
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    return reply(401, null, "Incorrect M-PIN.");
  };
  try {
    const api = createApiClient("http://example.test", {
      read: async () => stored,
      write: async (v) => {
        stored = v;
      },
    });
    await api.accept({ access_token: "access", refresh_token: "refresh" });
    await assert.rejects(
      api.request("recharges", { mpin: "0000" }),
      /Incorrect M-PIN/,
    );
    assert.equal(requests, 1);
    assert.equal(stored, "refresh");
  } finally {
    globalThis.fetch = original;
  }
});
test("expired-token retry preserves POST body and idempotency key", async () => {
  const original = globalThis.fetch;
  let stored = null;
  const sent = [];
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/refresh"))
      return reply(200, { access_token: "fresh", refresh_token: "next" });
    sent.push(options);
    return sent.length === 1
      ? reply(401, null, "Invalid or expired token.")
      : reply(200, { id: "same-payment" });
  };
  try {
    const api = createApiClient("http://example.test", {
      read: async () => stored,
      write: async (v) => {
        stored = v;
      },
    });
    await api.accept({ access_token: "old", refresh_token: "r" });
    await api.request(
      "wallet/topups",
      { amount: "100.00" },
      { key: "stable-key" },
    );
    assert.equal(sent.length, 2);
    assert.equal(sent[0].body, sent[1].body);
    assert.equal(sent[1].headers["Idempotency-Key"], "stable-key");
    assert.equal(sent[1].headers.Authorization, "Bearer fresh");
  } finally {
    globalThis.fetch = original;
  }
});
test("network failure preserves refresh credentials; rejected refresh clears them", async () => {
  const original = globalThis.fetch;
  let stored = "refresh";
  let signedOut = 0;
  const api = createApiClient("http://example.test", {
    read: async () => stored,
    write: async (v) => {
      stored = v;
    },
  });
  api.onSignedOut(() => signedOut++);
  try {
    globalThis.fetch = async () => {
      throw Error("offline");
    };
    await assert.rejects(api.refresh(), /Cannot reach/);
    assert.equal(stored, "refresh");
    globalThis.fetch = async () =>
      reply(401, null, "Invalid or expired refresh token.");
    await assert.rejects(api.refresh());
    assert.equal(stored, null);
    assert.equal(signedOut, 1);
  } finally {
    globalThis.fetch = original;
  }
});
test("a late refresh cannot replace a newly signed-in account's credentials", async () => {
  const original = globalThis.fetch;
  let stored = null;
  let finish;
  let started;
  const waiting = new Promise((resolve) => {
    started = resolve;
  });
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/refresh")) {
      started();
      return new Promise((resolve) => {
        finish = () =>
          resolve(
            reply(200, {
              access_token: "old-refreshed",
              refresh_token: "old-refresh",
            }),
          );
      });
    }
    assert.equal(options.headers.Authorization, "Bearer new-account");
    return reply(200, {});
  };
  try {
    const api = createApiClient("http://example.test", {
      read: async () => stored,
      write: async (v) => {
        stored = v;
      },
    });
    await api.accept({ access_token: "old", refresh_token: "old-r" });
    const refresh = api.refresh().catch((error) => error);
    await waiting;
    await api.accept({ access_token: "new-account", refresh_token: "new-r" });
    finish();
    await refresh;
    assert.equal(stored, "new-r");
    await api.request("profile");
  } finally {
    globalThis.fetch = original;
  }
});
