import { createContext } from "react";

type Args = {
  stdinArgs?: string[];
};

export const ArgsContext = createContext<Args>({ stdinArgs: [] });
