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
  ].map((name, index) => ({
    id: index.toString(),
    name,
  })),
  selectedItemIndex: 3,
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  options: [
    {
      id: "1",
      name: "Linux",
      icon: "https://cdn.svgporn.com/logos/linux-tux.svg",
      description: "The best OS",
    },
    {
      id: "2",
      name: "GNU",
      icon: "https://cdn.svgporn.com/logos/gnu.svg",
      description: "The freeest OS",
    },
    {
      id: "3",
      name: "Windows",
      icon: "https://cdn.svgporn.com/logos/microsoft-windows.svg",
      description: "The worst OS",
    },
    {
      id: "4",
      name: "MacOS",
      icon: "https://cdn.svgporn.com/logos/apple.svg",
      description: "The most expensive OS",
    },
  ],
  selectedItemIndex: 0,
};
