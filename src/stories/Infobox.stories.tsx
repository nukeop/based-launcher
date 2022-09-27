import { Infobox } from "../components/Infobox/Infobox";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Molecules/Infobox",
  component: Infobox,
  layout: "padded",
};

const Template: ComponentStory<typeof Infobox> = (args) => (
  <Infobox {...args} />
);

export const Example = Template.bind({});
Example.args = {
  header: "TempleOS",
  subheader: "Public domain operating system.",
  thumbnail:
    "https://upload.wikimedia.org/wikipedia/commons/8/81/TempleOS_logo.png",
  body: "TempleOS is a public domain operating system. It is a single-user operating system that runs on x86 computers. Created by Terry A. Davis in 2013, it is based on the 64-bit x86 architecture and is written in the HolyC programming language.",
};
