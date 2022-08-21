import styles from "./Palette.module.scss";
import { MenuItem, TextField } from "@mui/material";
import React from "react";

type PaletteOption = {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
};

type PaletteProps = {
  options: PaletteOption[];
};

export const Palette: React.FC<PaletteProps> = ({ options }) => {
  return (
    <div className={styles.palette}>
      <TextField
        autoFocus
        fullWidth
        placeholder="Search..."
        inputProps={{ className: styles.search }}
      />

      <div className={styles["palette-items"]}>
        {options?.map((option, index) => (
          <MenuItem key={option.id} className={styles["palette-item"]}>
            {option.name}
          </MenuItem>
        ))}
      </div>
    </div>
  );
};
