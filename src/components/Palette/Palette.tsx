import { ThemingClassNames } from "../../theming/theming-classnames";
import { BangsArea } from "../BangsArea/BangsArea";
import { Input } from "../Input/Input";
import { PaletteGrid } from "../PaletteGrid/PaletteGrid";
import { PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./Palette.module.scss";
import cx from "classnames";
import React, { RefObject } from "react";
import { VariableSizeList } from "react-window";

type PaletteProps = {
  options: PaletteItemProps[];

  prefixLabel?: string;
  filterInputValue: string;
  onFilterInputValueChange: (value: string) => void;

  selectedItemIndex: number;
  onSetSelectedItemIndex: (index: number) => void;

  listRef: RefObject<VariableSizeList>;

  itemSize?: number;
  itemSizeWithDescription?: number;

  children?: React.ReactNode;
};

export const Palette: React.FC<PaletteProps> = ({
  options,
  filterInputValue,
  onFilterInputValueChange,
  onSetSelectedItemIndex,
  selectedItemIndex,
  listRef,
  prefixLabel,
  itemSize,
  itemSizeWithDescription,
  children,
}) => {
  return (
    <div
      data-testid="palette"
      className={cx(styles.palette, ThemingClassNames["palette"])}
      tabIndex={-1}
    >
      <Input
        autoFocus
        autoComplete="off"
        data-testid="filter-input"
        className={ThemingClassNames["filter-input"]}
        placeholder="Type to filter..."
        value={filterInputValue}
        onChange={(event) => {
          onSetSelectedItemIndex(0);
          return onFilterInputValueChange(event.target.value);
        }}
        prefixLabel={prefixLabel}
      />
      {children}
      <PaletteGrid
        items={options}
        columns={1}
        selectedItemId={options[selectedItemIndex]?.id}
        listRef={listRef}
        itemSize={itemSize}
        itemSizeWithDescription={itemSizeWithDescription}
      />
    </div>
  );
};
