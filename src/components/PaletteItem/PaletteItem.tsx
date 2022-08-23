import styles from "./PaletteItem.module.scss";

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
    <button className={styles["palette-item"]} onClick={onAction}>
      {icon}
      <div className={styles["palette-item-name"]}>{displayName}</div>
      <div className={styles["palette-item-description"]}>{description}</div>
    </button>
  );
};
