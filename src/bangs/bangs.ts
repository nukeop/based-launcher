// DuckDuckGo style bangs

export type BangResponseType = "infobox" | "widget" | "value" | "empty";

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

export interface WidgetBangResponse<T> extends BangResponse {
  widget: T;
  type: "widget";
}

export interface EmptyBangResponse extends BangResponse {
  type: "empty";
}

export const isInfoboxBangResponse = (
  response: BangResponse | void
): response is InfoboxBangResponse => {
  return response?.type === "infobox";
};

export const isWidgetBangResponse = (
  response: BangResponse | void
): response is WidgetBangResponse<any> => {
  return response?.type === "widget";
};

export const isEmptyBangResponse = (
  response: BangResponse | void
): response is EmptyBangResponse => {
  return response?.type === "empty";
};

export interface IBang<T extends BangResponse> {
  isPresent(input: string): boolean;
  onActivate(input: string): Promise<T | void>;
}
