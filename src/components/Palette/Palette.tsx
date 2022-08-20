import { IpcEvent } from "../../../common/ipc";
import styles from "./Palette.module.scss";
import { MenuItem, TextField } from "@mui/material";
import { ipcRenderer } from "electron";
import React, { useEffect } from "react";

export const Palette: React.FC = () => {
  useEffect(() => {
    ipcRenderer.invoke(IpcEvent.GetPipedArgs).then((args: string[]) => {
      console.log(args);
    });
  }, []);

  return (
    <div className={styles.palette}>
      <TextField
        fullWidth
        placeholder="Search..."
        inputProps={{ className: styles.search }}
      />

      <div className={styles["palette-items"]}>
        <MenuItem className={styles["palette-item"]}>Test item</MenuItem>
        <MenuItem className={styles["palette-item"]}>Test item 2</MenuItem>
        <MenuItem className={styles["palette-item"]}>Test item 3</MenuItem>
        <MenuItem className={styles["palette-item"]}>Test item 4</MenuItem>
        <MenuItem className={styles["palette-item"]}>Test item 5</MenuItem>
      </div>
    </div>
  );
};
