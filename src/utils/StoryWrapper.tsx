import { AppRoot } from "../layouts/AppRoot";
import styles from "./StoryWrapper.module.scss";
import "./StoryWrapper.scss";

export const StoryWrapper: React.FC = ({ children }) => (
  <AppRoot className={styles["story-wrapper"]}>{children}</AppRoot>
);
