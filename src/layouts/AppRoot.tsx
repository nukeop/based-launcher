import styles from "./AppRoot.module.scss";
import cx from "classnames";

type AppRootProps = {
  className?: string;
  children: React.ReactNode;
};

export const AppRoot: React.FC<AppRootProps> = ({ children, className }) => (
  <div className={cx(styles["app-root"], className)}>{children}</div>
);
