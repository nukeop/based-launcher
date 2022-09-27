import { BangResponse } from "../bangs/bangs";
import { WikipediaBang } from "../bangs/wikipedia";
import { useEffect, useState } from "react";

const allBangs = [new WikipediaBang()];

export const useBangs = ({ input }: { input: string }) => {
  const [bangResponse, setBangResponse] = useState<BangResponse | undefined>(
    undefined
  );
  const [isLoading, setLoading] = useState(false);
  const bang = allBangs.find((bang) => bang.isPresent(input));

  useEffect(() => {
    if (bang) {
      setLoading(true);
    }
    bang?.onActivate(input).then((response) => {
      setLoading(false);
      return setBangResponse(response);
    });
  }, [bang]);

  return {
    bang,
    bangResponse,
    isLoading,
  };
};
