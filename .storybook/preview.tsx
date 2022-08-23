import React from "react";
import { StoryWrapper } from "../src/utils/StoryWrapper";
import { StoryThemeProvider } from "../src/utils/StoryThemeProvider";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <StoryWrapper>
      <Story />
    </StoryWrapper>
  ),
  (Story) => (
    <StoryThemeProvider>
      <Story />
    </StoryThemeProvider>
  ),
];