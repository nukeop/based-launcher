import styles from "./Palette.module.scss";
import { TextField } from "@mui/material";
import React from "react";

export const Palette: React.FC = () => {
  return (
    <div className={styles.palette}>
      <TextField fullWidth inputProps={{ style: { fontSize: "2rem" } }} />
    </div>
  );
};
