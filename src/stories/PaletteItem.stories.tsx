import { PaletteItem } from "../components/PaletteItem/PaletteItem";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Components/Palette/Palette Item",
  component: PaletteItem,
  layout: "padded",
};

const Template: ComponentStory<typeof PaletteItem> = (args) => (
  <PaletteItem {...args} />
);

export const StdinItem = Template.bind({});
StdinItem.args = { id: "1234" };

export const ItemWithName = Template.bind({});
ItemWithName.args = {
  id: "1",
  name: "Home",
};

export const ItemWithNameAndDescription = Template.bind({});
ItemWithNameAndDescription.args = {
  id: "1",
  name: "Gnome",
  description: "Has no thumbnails",
};

export const ItemWithIcon = Template.bind({});
ItemWithIcon.args = {
  id: "1",
  name: "Gnome",
  description: "Has no thumbnails",
  icon: "https://cdn.svgporn.com/logos/gnome-icon.svg",
};

export const SelectedItem = Template.bind({});
SelectedItem.args = {
  id: "1",
  name: "Gnome",
  description: "Has no thumbnails",
  icon: "https://cdn.svgporn.com/logos/gnome-icon.svg",
  isSelected: true,
};

export const ItemWithAction = Template.bind({});
ItemWithAction.args = {
  id: "1",
  name: "iToddlers BTFO",
};
