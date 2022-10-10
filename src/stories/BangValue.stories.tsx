import { BangValue } from "../components/BangValue/BangValue";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Molecules/BangValue",
  component: BangValue,
  layout: "padded",
};

const Template: ComponentStory<typeof BangValue> = (args) => (
  <BangValue {...args} />
);

export const Example = Template.bind({});
Example.args = {
  value: "150",
};
