import { Calendar } from "../components/Calendar/Calendar";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Calendar",
  component: Calendar,
  layout: "padded",
};

const Template: ComponentStory<typeof Calendar> = (args) => (
  <Calendar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: new Date(),
};
