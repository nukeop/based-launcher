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

export interface IBang<T extends BangResponse> {
  isPresent(input: string): boolean;
  onActivate(input: string): Promise<T | void>;
}
