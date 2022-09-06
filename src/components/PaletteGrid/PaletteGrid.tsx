import { PaletteItem, PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./PaletteGrid.module.scss";
import cx from "classnames";
import { RefObject } from "react";

type PaletteGridProps = {
  items: PaletteItemProps[];
  selectedItemId?: string;
  columns?: number;
  selectedItemRef?: RefObject<HTMLButtonElement>;
};

export const PaletteGrid: React.FC<PaletteGridProps> = ({
  items,
  selectedItemId,
  columns = 1,
  selectedItemRef,
}) => (
  <div
    className={cx(styles["palette-grid"], {
      [styles["columns-1"]]: columns === 1,
      [styles["columns-2"]]: columns === 2,
      [styles["columns-3"]]: columns === 3,
      [styles["columns-4"]]: columns === 4,
    })}
  >
    {items.map((item) => (
      <PaletteItem
        {...item}
        key={item.id}
        isSelected={item.id === selectedItemId}
        ref={item.id === selectedItemId ? selectedItemRef : undefined}
      />
    ))}
  </div>
);
