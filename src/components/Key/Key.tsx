import styles from "./Key.module.scss";
import cx from "classnames";

export type KeyProps = {
  children: React.ReactNode;
  active?: boolean;
};

export const Key: React.FC<KeyProps> = ({ children, active }) => (
  <kbd
    className={cx(styles["key"], {
      [styles["active"]]: active,
    })}
  >
    {children}
  </kbd>
);
