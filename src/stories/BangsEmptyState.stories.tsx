import { BangsEmptyState } from "../components/BangsEmptyState/BangsEmptyState";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Molecules/BangsEmptyState",
  component: BangsEmptyState,
  layout: "padded",
};

const Template: ComponentStory<typeof BangsEmptyState> = (args) => (
  <BangsEmptyState {...args} />
);

export const Default = Template.bind({});
Default.args = {};
