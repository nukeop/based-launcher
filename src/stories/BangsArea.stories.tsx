import { BangsArea } from "../components/BangsArea/BangsArea";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Molecules/BangsArea",
  component: BangsArea,
  layout: "padded",
};

const Template: ComponentStory<typeof BangsArea> = (args) => (
  <BangsArea {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Empty = Template.bind({});
Empty.args = {
  isEmpty: true,
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
