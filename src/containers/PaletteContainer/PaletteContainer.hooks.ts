import { IpcEvent } from "../../../common/ipc";
import { ArgsContext } from "../../contexts/argsContext";
import { ipcRenderer } from "electron";
import Fuse from "fuse.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VariableSizeList } from "react-window";

export const usePaletteContainerProps = () => {
  const listRef = useRef<VariableSizeList>(null);
  const { flags, options, isLoading } = useContext(ArgsContext);

  const resolvedOptions = options.map((option) => ({
    ...option,
    onAction: () => {
      ipcRenderer.send(IpcEvent.ExecuteAction, option.onAction);
    },
  }));

  const [filterInput, setFilterInput] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const fuse = new Fuse(resolvedOptions, {
    keys: ["name", "description"],
    threshold: 0.3,
  });

  const filteredOptions = filterInput
    ? fuse.search(filterInput).map((result) => result.item)
    : resolvedOptions;

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
    flags,
    options: filteredOptions,
    isLoading,
    filterInput,
    setFilterInput,
    selectedItemIndex,
    setSelectedItemIndex,
  };
};
