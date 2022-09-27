// DuckDuckGo style bangs

export type BangResponseType = "infobox" | "value";

export type BangResponse = {
  type: BangResponseType;
};

export interface InfoboxBangResponse extends BangResponse {
  header: string;
  subheader?: string;
  body: string;
  thumbnail?: string;
  type: "infobox";
}

export interface IBang<T> {
  isPresent(input: string): boolean;
  onActivate<T extends BangResponse>(input: string): Promise<T | void>;
}
