import { IpcEvent } from "../../common/ipc";
import { Palette } from "../components/Palette/Palette";
import { ArgsContext } from "../contexts/argsContext";
import { ipcRenderer } from "electron";
import Fuse from "fuse.js";
import { useCallback, useContext, useEffect, useState } from "react";

export const PaletteContainer: React.FC = () => {
  const { stdinArgs } = useContext(ArgsContext);
  const options =
    stdinArgs?.map((arg, index) => ({
      id: arg,
      name: arg,
      icon: null,
      onAction: () => onAction(arg),
    })) ?? [];

  const onAction = useCallback((item: string) => {
    ipcRenderer.send(IpcEvent.ReturnSelectedItem, item);
  }, []);

  const [filterInput, setFilterInput] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const fuse = new Fuse(options, {
    keys: ["name", "description"],
    threshold: 0.3,
  });

  const filteredOptions = filterInput
    ? fuse.search(filterInput).map((result) => result.item)
    : options;

  const onUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setSelectedItemIndex(
          selectedItemIndex === 0
            ? filteredOptions.length - 1
            : selectedItemIndex - 1
        );
      }
    },
    [filteredOptions, selectedItemIndex]
  );

  const onDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedItemIndex(
          selectedItemIndex === filteredOptions.length - 1
            ? 0
            : selectedItemIndex + 1
        );
      }
    },
    [filteredOptions, selectedItemIndex]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        filteredOptions[selectedItemIndex].onAction?.();
      }
    },
    [filteredOptions, selectedItemIndex]
  );

  useEffect(() => {
    addEventListener("keydown", onUp);
    addEventListener("keydown", onDown);
    addEventListener("keydown", onEnter);
    return () => {
      removeEventListener("keydown", onUp);
      removeEventListener("keydown", onDown);
      removeEventListener("keydown", onEnter);
    };
  }, [selectedItemIndex, filteredOptions]);

  return (
    <Palette
      options={filteredOptions}
      filterInputValue={filterInput}
      onFilterInputValueChange={setFilterInput}
      selectedItemIndex={selectedItemIndex}
      onSetSelectedItemIndex={setSelectedItemIndex}
    />
  );
};
