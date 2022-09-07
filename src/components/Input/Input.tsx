import styles from "./Input.module.scss";
import cx from "classnames";
import { InputHTMLAttributes } from "react";

type CustomInputProps = {
  prefixLabel?: string;
};

export const Input = (
  props: CustomInputProps & InputHTMLAttributes<HTMLInputElement>
) => {
  const { prefixLabel, ...rest } = props;
  return (
    <div className={styles.inputWrapper}>
      {prefixLabel && (
        <label className={styles.prefixLabel}>{prefixLabel}</label>
      )}
      <input className={styles.input} {...rest} />
    </div>
  );
};
