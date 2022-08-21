import { ArgsContext } from "../App";
import { Palette } from "../components/Palette/Palette";
import { useContext } from "react";

export const PaletteContainer: React.FC = () => {
  const { stdinArgs } = useContext(ArgsContext);

  return (
    <Palette
      options={
        stdinArgs?.map((arg, index) => ({
          id: arg,
          name: arg,
          description: arg,
          icon: null,
        })) ?? []
      }
    />
  );
};
