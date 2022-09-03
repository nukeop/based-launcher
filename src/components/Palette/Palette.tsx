import { PaletteGrid } from "../PaletteGrid/PaletteGrid";
import { PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./Palette.module.scss";
import { TextField } from "@mui/material";
import Fuse from "fuse.js";
import React, { useCallback, useEffect, useState } from "react";

type PaletteProps = {
  options: PaletteItemProps[];
};

type ItemPosition = {
  x: number;
  y: number;
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
  const [selectedPosition, setSelectedPosition] = useState<ItemPosition>({
    x: 0,
    y: 0,
  });

  const lastItemY = Math.floor(filteredOptions.length / columns);
  const lastItemX = (filteredOptions.length % columns) - 1;

  const onRight = useCallback(
    (event: KeyboardEvent) => {
      let { x, y } = selectedPosition;
      if (event.key === "ArrowRight") {
        if (x === lastItemX && y === lastItemY) {
          setSelectedPosition({ x: 0, y: 0 });
        } else if (x === columns - 1) {
          setSelectedPosition({ x: 0, y: y + 1 });
        } else {
          setSelectedPosition({ x: x + 1, y });
        }
      }
    },
    [filteredOptions, selectedPosition]
  );

  const onLeft = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        let { x, y } = selectedPosition;
        if (x === 0 && y === 0) {
          setSelectedPosition({ x: lastItemX, y: lastItemY });
        } else if (x === 0) {
          setSelectedPosition({ x: columns - 1, y: y - 1 });
        } else {
          setSelectedPosition({ x: x - 1, y });
        }
      }
    },
    [filteredOptions, selectedPosition, columns]
  );

  const onUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
      }
    },
    [filteredOptions, selectedPosition]
  );

  const onDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
      }
    },
    [filteredOptions, selectedPosition]
  );

  useEffect(() => {
    addEventListener("keydown", onRight);
    addEventListener("keydown", onLeft);
    addEventListener("keydown", onUp);
    addEventListener("keydown", onDown);
    return () => {
      removeEventListener("keydown", onRight);
      removeEventListener("keydown", onLeft);
      removeEventListener("keydown", onUp);
      removeEventListener("keydown", onDown);
    };
  }, [selectedPosition, filteredOptions]);

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
        onChange={(event) => {
          setSelectedPosition({ x: 0, y: 0 });
          return setFilterInput(event.target.value);
        }}
      />

      <div className={styles["palette-items"]}>
        <PaletteGrid
          items={filteredOptions}
          columns={columns}
          selectedItemId={
            filteredOptions[selectedPosition.y * columns + selectedPosition.x]
              ?.id
          }
        />
      </div>
    </div>
  );
};
