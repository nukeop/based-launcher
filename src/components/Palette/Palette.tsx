import { PaletteGrid } from "../PaletteGrid/PaletteGrid";
import { PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./Palette.module.scss";
import { TextField } from "@mui/material";
import Fuse from "fuse.js";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type PaletteProps = {
  options: PaletteItemProps[];
};

export const Palette: React.FC<PaletteProps> = ({ options }) => {
  const [filterInput, setFilterInput] = useState("");

  const fuse = new Fuse(options, {
    keys: ["name", "description"],
    threshold: 0.3,
  });

  const filteredOptions = filterInput
    ? fuse.search(filterInput).map((result) => result.item)
    : options;

  const columns = 3;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useHotkeys(
    "right",
    () => {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredOptions.length);
    },
    [filteredOptions, selectedItemIndex]
  );

  useHotkeys(
    "left",
    () => {
      setSelectedItemIndex(
        (selectedItemIndex + filteredOptions.length - 1) %
          filteredOptions.length
      );
    },
    [filteredOptions, selectedItemIndex]
  );

  useHotkeys(
    "down",
    () => {
      setSelectedItemIndex(
        (selectedItemIndex + columns) % filteredOptions.length
      );
    },
    [filteredOptions, selectedItemIndex]
  );

  useHotkeys(
    "up",
    () => {
      setSelectedItemIndex(
        (selectedItemIndex + filteredOptions.length - columns) %
          filteredOptions.length
      );
    },
    [filteredOptions, selectedItemIndex]
  );

  return (
    <div className={styles.palette} tabIndex={-1}>
      <TextField
        autoFocus
        fullWidth
        placeholder="Search..."
        inputProps={{
          className: styles.search,
          "data-testid": "filter-input",
        }}
        value={filterInput}
        onChange={(event) => setFilterInput(event.target.value)}
      />

      <div className={styles["palette-items"]}>
        <PaletteGrid
          items={filteredOptions}
          columns={columns}
          selectedItemId={filteredOptions[selectedItemIndex]?.id}
        />
      </div>
    </div>
  );
};
