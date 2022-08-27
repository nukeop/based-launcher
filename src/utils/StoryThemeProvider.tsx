import { theme } from "../theme";
import { ThemeProvider } from "@mui/material";
import React from "react";

type StoryThemeProviderProps = {
  children: React.ReactNode;
};

export const StoryThemeProvider: React.FC<StoryThemeProviderProps> = ({
  children,
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
