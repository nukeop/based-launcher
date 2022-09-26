import { IBang } from "./bangs";

export class WikipediaBang implements IBang {
  isPresent(input: string) {
    return input.includes("!w ") || input.includes(" !w");
  }

  async onActivate(input: string) {
    const query = input.replace("!w", "").trim();
    const url = `https://en.wikipedia.org/wiki/${query}`;
    const result = await fetch(url);
  }
}
