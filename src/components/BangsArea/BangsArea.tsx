import { Loader } from "../Loader/Loader";
import styles from "./BangsArea.module.scss";
import cx from "classnames";

export type BangsAreaProps = {
  isEmpty?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
};

export const BangsArea: React.FC<BangsAreaProps> = ({
  isEmpty,
  isLoading,
  children,
}) => {
  return (
    <div
      className={cx(styles["bangs-area"], {
        [styles["empty"]]: isEmpty,
        [styles["loading"]]: isLoading,
      })}
    >
      {isLoading && <Loader />}
      {!isLoading && children}
    </div>
  );
};
