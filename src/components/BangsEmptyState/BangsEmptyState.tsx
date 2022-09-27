import styles from "./BangsEmptyState.module.scss";

export const BangsEmptyState: React.FC = () => {
  return (
    <div className={styles["bangs-empty-state"]}>
      <h1 className={styles["title"]}>Nothing found</h1>
      <p className={styles["description"]}>Try searching for something else</p>
    </div>
  );
};
