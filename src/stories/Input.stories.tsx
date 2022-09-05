import { Input } from "../components/Input/Input";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Input",
  component: Input,
  layout: "padded",
};

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Empty = Template.bind({});
Empty.args = {};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "Search...",
};

export const WithValue = Template.bind({});
WithValue.args = {
  value: "It's 2022 and Gnome still doesn't have thumbnails in the file picker",
};
