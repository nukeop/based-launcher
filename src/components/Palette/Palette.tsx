import { ArgsContext } from "../../App";
import styles from "./Palette.module.scss";
import { MenuItem, TextField } from "@mui/material";
import React, { useContext } from "react";

export const Palette: React.FC = () => {
  const { stdinArgs } = useContext(ArgsContext);

  return (
    <div className={styles.palette}>
      <TextField
        fullWidth
        placeholder="Search..."
        inputProps={{ className: styles.search }}
      />

      <div className={styles["palette-items"]}>
        {stdinArgs &&
          stdinArgs?.map((arg, index) => (
            <MenuItem key={index} className={styles["palette-item"]}>
              {arg}
            </MenuItem>
          ))}
      </div>
    </div>
  );
};
