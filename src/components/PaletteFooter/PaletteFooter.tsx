import { Key } from "../Key/Key";
import styles from "./PaletteFooter.module.scss";

export const PaletteFooter: React.FC = () => {
  return (
    <footer className={styles["footer"]}>
      Type to filter, use bangs to search (e.g. <Key>!w</Key> to search
      Wikipedia).
    </footer>
  );
};
