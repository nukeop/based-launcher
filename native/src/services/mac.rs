use std::process::{Command, Output};

pub fn get_apps_json() -> Output {
    Command::new("system_profiler")
        .arg("-json")
        .arg("SPApplicationsDataType")
        .output()
        .expect("failed to execute process")
}
