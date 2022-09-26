import { WikipediaBang } from "../bangs/wikipedia";

const allBangs = [new WikipediaBang()];

export const useBangs = ({ input }: { input: string }) => {
  const bang = allBangs.find((bang) => bang.isPresent(input));

  return {
    bang,
  };
};
