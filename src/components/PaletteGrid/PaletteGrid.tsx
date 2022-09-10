import { ThemingClassNames } from "../../theming/theming-classnames";
import { PaletteItem, PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./PaletteGrid.module.scss";
import cx from "classnames";
import { RefObject } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

type PaletteGridProps = {
  items: PaletteItemProps[];
  selectedItemId?: string;
  columns?: number;
  listRef?: RefObject<FixedSizeList>;
};

export const PaletteGrid: React.FC<PaletteGridProps> = ({
  items,
  selectedItemId,
  columns = 1,
  listRef,
}) => (
  <div
    className={cx(
      styles["palette-grid"],
      {
        [styles["columns-1"]]: columns === 1,
        [styles["columns-2"]]: columns === 2,
        [styles["columns-3"]]: columns === 3,
        [styles["columns-4"]]: columns === 4,
      },
      ThemingClassNames["palette-grid"]
    )}
  >
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          ref={listRef}
          height={height}
          width={width}
          itemSize={50}
          itemCount={items.length}
        >
          {({ index, style }) => {
            const item = items[index];
            return (
              <PaletteItem
                {...item}
                key={item.id}
                style={style}
                isSelected={item.id === selectedItemId}
              />
            );
          }}
        </FixedSizeList>
      )}
    </AutoSizer>
  </div>
);
