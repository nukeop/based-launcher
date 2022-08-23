import { theme } from "../theme";
import { ThemeProvider } from "@mui/material";
import React from "react";

export const StoryThemeProvider: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
