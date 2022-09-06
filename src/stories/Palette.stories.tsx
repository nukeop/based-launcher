import { Palette } from "../components/Palette/Palette";
import { ComponentStory } from "@storybook/react";
import { useState } from "react";

export default {
  title: "Components/Palette/Palette",
  component: Palette,
  layout: "padded",
};

const Template: ComponentStory<typeof Palette> = (args) => (
  <Palette {...args} />
);

export const Empty = Template.bind({});
Empty.args = {
  options: [],
};

export const WithOptions = Template.bind({});
WithOptions.args = {
  options: [
    "Gordon Cole",
    "Albert Rosenfield",
    "Audrey Horne",
    "Ben Horne",
    "Bobby Briggs",
    "Catherine Martell",
    "Chet Desmond",
    "Dale Cooper",
    "Diane Evans",
  ].map((name) => ({
    id: name,
    name,
    icon: null,
  })),
  selectedItemIndex: 3,
};
