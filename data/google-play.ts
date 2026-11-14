export type GooglePlaySuggestion = {
  amount: number;
  tag: string;
};

export const googlePlaySuggestions: GooglePlaySuggestion[] = [
  { amount: 100, tag: "Starter" },
  { amount: 250, tag: "Quick pick" },
  { amount: 500, tag: "Popular" },
  { amount: 750, tag: "Games" },
  { amount: 1000, tag: "Best value" },
  { amount: 1500, tag: "Binge" },
];

export const MIN_GIFT_AMOUNT = 100;
export const MAX_GIFT_AMOUNT = 10000;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateGiftCode(seed: string): string {
  let state = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  let code = "";
  for (let index = 0; index < 20; index += 1) {
    state = Math.imul(state ^ (state >>> 13), 1274126177);
    code += CODE_ALPHABET[(state >>> 0) % CODE_ALPHABET.length];
  }

  return code.match(/.{1,5}/g)?.join("-") ?? code;
}
