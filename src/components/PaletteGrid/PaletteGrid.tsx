import { PaletteItem, PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./PaletteGrid.module.scss";
import cx from "classnames";

type PaletteGridProps = {
  items: PaletteItemProps[];
  selectedItemId?: string;
  columns?: number;
};

export const PaletteGrid: React.FC<PaletteGridProps> = ({
  items,
  selectedItemId,
  columns = 3,
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
      />
    ))}
  </div>
);
