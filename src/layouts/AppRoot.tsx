import styles from "./AppRoot.module.scss";
import { Paper } from "@mui/material";

type AppRootProps = {
  children: React.ReactNode;
};

export const AppRoot: React.FC<AppRootProps> = ({ children }) => (
  <Paper elevation={0} className={styles["app-root"]}>
    {children}
  </Paper>
);
