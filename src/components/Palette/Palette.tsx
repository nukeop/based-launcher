import { Input } from "../Input/Input";
import { PaletteGrid } from "../PaletteGrid/PaletteGrid";
import { PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./Palette.module.scss";
import React, { RefObject } from "react";

type PaletteProps = {
  options: PaletteItemProps[];

  filterInputValue: string;
  onFilterInputValueChange: (value: string) => void;

  selectedItemIndex: number;
  onSetSelectedItemIndex: (index: number) => void;

  selectedItemRef: RefObject<HTMLButtonElement>;
};

export const Palette: React.FC<PaletteProps> = ({
  options,
  filterInputValue,
  onFilterInputValueChange,
  onSetSelectedItemIndex,
  selectedItemIndex,
  selectedItemRef,
}) => (
  <div data-testid="palette" className={styles.palette} tabIndex={-1}>
    <Input
      autoFocus
      autoComplete="off"
      data-testid="filter-input"
      id="filter-input"
      placeholder="Search..."
      value={filterInputValue}
      onChange={(event) => {
        onSetSelectedItemIndex(0);
        return onFilterInputValueChange(event.target.value);
      }}
    />

    <PaletteGrid
      items={options}
      columns={1}
      selectedItemId={options[selectedItemIndex]?.id}
      selectedItemRef={selectedItemRef}
    />
  </div>
);
