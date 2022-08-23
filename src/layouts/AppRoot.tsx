import styles from "./AppRoot.module.scss";
import { Paper } from "@mui/material";
import cx from "classnames";

type AppRootProps = {
  className?: string;
  children: React.ReactNode;
};

export const AppRoot: React.FC<AppRootProps> = ({ children, className }) => (
  <Paper elevation={0} className={cx(styles["app-root"], className)}>
    {children}
  </Paper>
);
