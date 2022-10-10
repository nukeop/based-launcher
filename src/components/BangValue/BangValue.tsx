import styles from "./BangValue.module.scss";

export type BangValueProps = {
  value: string;
};

export const BangValue: React.FC<BangValueProps> = ({ value }) => {
  return <span className={styles["bang-value"]}>{value}</span>;
};
