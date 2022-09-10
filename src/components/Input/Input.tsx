import styles from "./Input.module.scss";
import cx from "classnames";
import { InputHTMLAttributes } from "react";

type CustomInputProps = {
  prefixLabel?: string;
  className?: string;
};

export const Input = (
  props: CustomInputProps & InputHTMLAttributes<HTMLInputElement>
) => {
  const { prefixLabel, className, ...rest } = props;
  return (
    <div className={cx(styles.inputWrapper, className)}>
      {prefixLabel && (
        <label className={styles.prefixLabel}>{prefixLabel}</label>
      )}
      <input className={styles.input} {...rest} />
    </div>
  );
};
