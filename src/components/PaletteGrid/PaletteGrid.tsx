import { ThemingClassNames } from "../../theming/theming-classnames";
import { PaletteItem, PaletteItemProps } from "../PaletteItem/PaletteItem";
import styles from "./PaletteGrid.module.scss";
import cx from "classnames";
import { RefObject } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";

type PaletteGridProps = {
  items: PaletteItemProps[];
  selectedItemId?: string;
  columns?: number;
  listRef?: RefObject<VariableSizeList>;
};

const ITEM_SIZE = 28;
const ITEM_SIZE_WITH_DESCRIPTION = 40;

export const PaletteGrid: React.FC<PaletteGridProps> = ({
  items,
  selectedItemId,
  columns = 1,
  listRef,
}) => {
  const getItemSize = (index: number) => {
    if (items[index].description) {
      return ITEM_SIZE_WITH_DESCRIPTION;
    } else {
      return ITEM_SIZE;
    }
  };
  return (
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
          <VariableSizeList
            ref={listRef}
            className={styles["palette-grid-list"]}
            height={height}
            width={width}
            itemSize={getItemSize}
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
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
