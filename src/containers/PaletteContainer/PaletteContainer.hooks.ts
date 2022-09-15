import { IpcEvent } from "../../../common/ipc";
import { ArgsContext } from "../../contexts/argsContext";
import { useDesktopEntries } from "../../hooks/useDesktopEntries";
import { useFlags } from "../../hooks/useFlags";
import { ipcRenderer } from "electron";
import Fuse from "fuse.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VariableSizeList } from "react-window";

export const usePaletteContainerProps = () => {
  const listRef = useRef<VariableSizeList>(null);
  const { stdinArgs, cliFlags, desktopEntries } = useContext(ArgsContext);

  const options =
    stdinArgs?.map((arg, index) => ({
      id: arg,
      name: arg,
      icon: null,
      onAction: () => onAction(arg),
    })) ?? [];

  // const options = desktopEntries?.map((entry) => ({
  //   id: entry["Desktop Entry"].Name,
  //   name: entry["Desktop Entry"].Name,
  //   description: entry["Desktop Entry"].Comment,
  //   icon: entry["Desktop Entry"].Icon,
  //   onAction: () => onAction(entry["Desktop Entry"].Exec),
  // }));

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
    listRef.current?.scrollToItem(selectedItemIndex);
  }, [selectedItemIndex]);

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

  return {
    listRef,
    flags: cliFlags,
    filteredOptions,
    filterInput,
    setFilterInput,
    selectedItemIndex,
    setSelectedItemIndex,
  };
};
