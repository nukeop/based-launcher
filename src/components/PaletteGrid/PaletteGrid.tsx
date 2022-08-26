import { PaletteItem, PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./PaletteGrid.module.scss";
import cx from "classnames";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type PaletteGridProps = {
  items: PaletteItemProps[];
  columns: number;
};

export const PaletteGrid: React.FC<PaletteGridProps> = ({
  items,
  columns = 3,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const selectFirstIfEmpty = useCallback(() => {
    if (!selectedItem && items.length > 0) {
      setSelectedItem(items[0].id);
    }
  }, [selectedItem, items]);

  useHotkeys("right", () => {
    selectFirstIfEmpty();
  });
  useHotkeys("left", () => {
    selectFirstIfEmpty();
  });
  useHotkeys("up", () => {
    selectFirstIfEmpty();
  });
  useHotkeys("down", () => {
    selectFirstIfEmpty();
  });

  return (
    <div
      className={cx(styles["palette-grid"], {
        [styles["columns-1"]]: columns === 1,
        [styles["columns-2"]]: columns === 2,
        [styles["columns-3"]]: columns === 3,
        [styles["columns-4"]]: columns === 4,
      })}
    >
      {items.map((item) => (
        <PaletteItem {...item} isSelected={selectedItem === item.id} />
      ))}
    </div>
  );
};
