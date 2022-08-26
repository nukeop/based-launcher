import styles from "./PaletteItem.module.scss";
import { MenuItem, Typography } from "@mui/material";
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
    <MenuItem
      className={cx(styles["palette-item"], {
        [styles["selected"]]: isSelected,
      })}
      onClick={onAction}
    >
      {icon && <div className={styles["palette-item-left"]}>{icon}</div>}
      <div className={styles["palette-item-right"]}>
        <Typography
          component={"p"}
          variant={"body1"}
          className={styles["palette-item-name"]}
        >
          {displayName}
        </Typography>
        <Typography
          component={"p"}
          variant={"body2"}
          className={styles["palette-item-description"]}
        >
          {description}
        </Typography>
      </div>
    </MenuItem>
  );
};
