import { PaletteGrid } from "../PaletteGrid/PaletteGrid";
import { PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./Palette.module.scss";
import { MenuItem, TextField } from "@mui/material";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type PaletteProps = {
  options: PaletteItemProps[];
};

export const Palette: React.FC<PaletteProps> = ({ options }) => {
  const columns = 3;
  const rows = Math.ceil(options.length / columns);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  useHotkeys(
    "right",
    () => {
      setSelectedItemIndex((selectedItemIndex + 1) % options.length);
    },
    [options, selectedItemIndex]
  );

  useHotkeys(
    "left",
    () => {
      setSelectedItemIndex(
        (selectedItemIndex + options.length - 1) % options.length
      );
    },
    [options, selectedItemIndex]
  );

  useHotkeys(
    "down",
    () => {
      setSelectedItemIndex((selectedItemIndex + columns) % options.length);
    },
    [options, selectedItemIndex]
  );

  useHotkeys(
    "up",
    () => {
      setSelectedItemIndex(
        (selectedItemIndex + options.length - columns) % options.length
      );
    },
    [options, selectedItemIndex]
  );

  return (
    <div className={styles.palette} tabIndex={-1}>
      <TextField
        autoFocus
        fullWidth
        placeholder="Search..."
        inputProps={{ className: styles.search }}
      />

      <div className={styles["palette-items"]}>
        <PaletteGrid
          items={options}
          columns={columns}
          selectedItemId={options[selectedItemIndex]?.id}
        />
      </div>
    </div>
  );
};
