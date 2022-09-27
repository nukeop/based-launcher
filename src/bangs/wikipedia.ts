import { EmptyBangResponse, IBang, InfoboxBangResponse } from "./bangs";
import upperFirst from "lodash/upperFirst";

type WikipediaResponse = {
  query: {
    pages: {
      [key: string]: {
        title: string;
        extract: string;
        thumbnail?: {
          source: string;
        };
        pageprops?: {
          displaytitle: string;
          "wikibase-shortdesc": string;
        };
      };
    };
  };
};

export class WikipediaBang
  implements IBang<InfoboxBangResponse | EmptyBangResponse>
{
  isPresent(input: string) {
    return input.includes("!w ") || input.includes(" !w");
  }

  // Gets a preview from wikipedia with a medium-size thumbnail
  async onActivate(
    input: string
  ): Promise<InfoboxBangResponse | EmptyBangResponse> {
    const query = input
      .replace("!w", "")
      .trim()
      .split(" ")
      .map(upperFirst)
      .join(" ");
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|pageprops&format=json&exintro=&explaintext=&titles=${query}&pithumbsize=300`;
    const result = (await (await fetch(url)).json()) as WikipediaResponse;

    const page = Object.values(result.query.pages)[0];

    if (!page.extract || input.length < 3) {
      return { type: "empty" };
    }

    return {
      header: page.title,
      body: page.extract,
      subheader: page.pageprops?.["wikibase-shortdesc"],
      thumbnail: page.thumbnail?.source,
      type: "infobox",
    };
  }
}
