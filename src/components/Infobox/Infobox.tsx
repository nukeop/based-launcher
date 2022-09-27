import styles from "./Infobox.module.scss";
import { InfoboxBangResponse } from "src/bangs/bangs";

export type InfoboxProps = Omit<InfoboxBangResponse, "type">;

export const Infobox: React.FC<InfoboxProps> = ({
  header,
  subheader,
  body,
  thumbnail,
}) => {
  return (
    <div className={styles["infobox"]}>
      {thumbnail && (
        <div className={styles["thumbnail"]}>
          <img src={thumbnail} alt={header} />
        </div>
      )}
      <div className={styles["content"]}>
        <h1 className={styles["header"]}>{header}</h1>
        <h2 className={styles["subheader"]}>{subheader}</h2>
        <p className={styles["body"]}>{body}</p>
      </div>
    </div>
  );
};
