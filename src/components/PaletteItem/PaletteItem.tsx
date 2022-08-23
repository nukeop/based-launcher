import styles from "./PaletteItem.module.scss";
import { MenuItem, Typography } from "@mui/material";

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
  onAction,
}) => {
  const displayName = name ?? id;

  console.log({
    id,
    name,
    description,
    icon,
    onAction,
  });

  return (
    <MenuItem className={styles["palette-item"]} onClick={onAction}>
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
