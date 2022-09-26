import styles from "./Loader.module.scss";
import cx from "classnames";

export type LoaderProps = {
  color?: "white" | "blue";
};

export const Loader: React.FC<LoaderProps> = ({ color }) => {
  return (
    <div className={styles["loader"]}>
      <div
        className={cx(styles["spinner"], {
          [styles["blue"]]: color === "blue",
        })}
      />
    </div>
  );
};
