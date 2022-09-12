import { PaletteGrid } from "../components/PaletteGrid/PaletteGrid";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Components/Palette/Palette Grid",
  component: PaletteGrid,
  layout: "padded",
};

const Template: ComponentStory<typeof PaletteGrid> = (args) => (
  <PaletteGrid {...args} />
);

export const Empty = Template.bind({});
Empty.args = {
  items: [],
};

export const WithItems = Template.bind({});
WithItems.args = {
  items: [
    {
      id: "1",
    },
    {
      id: "2",
      name: "Item",
    },
    {
      id: "3",
      name: "Item",
      description: "Description",
    },
  ],
};

export const Columns = Template.bind({});
Columns.args = {
  items: [
    {
      id: "1",
    },
    {
      id: "2",
      name: "Item",
    },
    {
      id: "3",
    },
    {
      id: "4",
      name: "Item 4",
    },
  ],
  columns: 3,
};
