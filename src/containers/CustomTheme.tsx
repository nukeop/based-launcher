import { useFlags } from "../hooks/useFlags";

export const CustomTheme = () => {
  const { flags } = useFlags();

  return flags?.theme ? (
    <link rel="stylesheet" type="text/css" href={flags.theme} />
  ) : null;
};
