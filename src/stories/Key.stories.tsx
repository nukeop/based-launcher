import { Key } from "../components/Key/Key";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Key",
  component: Key,
  layout: "padded",
};

const Template: ComponentStory<typeof Key> = (args) => <Key {...args} />;

export const At = Template.bind({});
At.args = {
  children: "@",
};

export const Shift_Active = Template.bind({});
Shift_Active.args = {
  children: "Shift",
  active: true,
};
