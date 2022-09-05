import styles from "./PaletteItem.module.scss";
import cx from "classnames";

export type PaletteItemProps = {
  id: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onAction?: () => void;
};

export const PaletteItem: React.FC<PaletteItemProps> = ({
  id,
  name,
  description,
  icon,
  isSelected,
  onAction,
}) => {
  const displayName = name ?? id;

  return (
    <button
      className={cx(styles["palette-item"], {
        [styles["selected"]]: isSelected,
      })}
      onClick={onAction}
      data-testid={`palette-item-${encodeURIComponent(id)}`}
      data-selected={isSelected}
    >
      {icon && <div className={styles["palette-item-left"]}>{icon}</div>}
      <div className={styles["palette-item-right"]}>
        <p className={styles["palette-item-name"]}>{displayName}</p>
        <p className={styles["palette-item-description"]}>{description}</p>
      </div>
    </button>
  );
};
