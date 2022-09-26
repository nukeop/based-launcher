import { Loader } from "../components/Loader/Loader";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Loader",
  component: Loader,
  layout: "padded",
};

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Blue = Template.bind({});
Blue.args = {
  color: "blue",
};
