// DuckDuckGo style bangs
export interface IBang {
  isPresent(input: string): boolean;
  onActivate(input: string): Promise<void>;
}
