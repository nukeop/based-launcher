import styles from "./Calendar.module.scss";
import { default as RC } from "react-calendar";

export const Calendar: React.FC = () => {
  return <RC className={styles["calendar"]} value={new Date()} />;
};
