import styles from "./PaletteItem.module.scss";
import cx from "classnames";
import { forwardRef, RefObject } from "react";

export type PaletteItemProps = {
  id: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  style?: React.CSSProperties;
  onAction?: () => void;
};

export const PaletteItem = forwardRef<HTMLButtonElement, PaletteItemProps>(
  ({ id, name, description, icon, isSelected, onAction, style }, ref) => {
    const displayName = name ?? id;

    return (
      <button
        className={cx(styles["palette-item"], {
          [styles["selected"]]: isSelected,
        })}
        style={style}
        onClick={onAction}
        data-testid={`palette-item-${encodeURIComponent(id)}`}
        data-selected={isSelected}
        ref={ref}
      >
        {icon && <div className={styles["palette-item-left"]}>{icon}</div>}
        <div className={styles["palette-item-right"]}>
          <p className={styles["palette-item-name"]}>{displayName}</p>
          <p className={styles["palette-item-description"]}>{description}</p>
        </div>
      </button>
    );
  }
);
