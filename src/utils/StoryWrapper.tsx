import { AppRoot } from "../layouts/AppRoot";
import styles from "./StoryWrapper.module.scss";
import "./StoryWrapper.scss";

type StoryWrapperProps = {
  children: React.ReactNode;
};

export const StoryWrapper: React.FC<StoryWrapperProps> = ({ children }) => (
  <AppRoot className={styles["story-wrapper"]}>{children}</AppRoot>
);
