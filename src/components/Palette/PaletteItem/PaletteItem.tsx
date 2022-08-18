import styles from "./PaletteItem.module.scss";
import { Button } from "@mui/material";

type PaletteItemProps = {
  icon?: React.ReactNode;
  name: string;
  description?: string;
  onAction?: () => void;
};

export const PaletteItem: React.FC<PaletteItemProps> = ({
  icon,
  name,
  description,
  onAction,
}) => {
  return (
    <div className={styles.paletteItem}>
      <div className={styles.paletteItemIcon}>{icon}</div>
      <div className={styles.paletteItemName}>{name}</div>
      <div className={styles.paletteItemDescription}>{description}</div>
      <div className={styles.paletteItemAction}>
        {onAction && <Button onClick={onAction}>Action</Button>}
      </div>
    </div>
  );
};
