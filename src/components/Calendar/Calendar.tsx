import styles from "./Calendar.module.scss";
import { default as RC } from "react-calendar";

export type CalendarProps = {
  value: Date;
  onChange?: (date: Date) => void;
};

export const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
  return (
    <RC className={styles["calendar"]} value={value} onChange={onChange} />
  );
};
