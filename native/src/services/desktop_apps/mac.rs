use serde_json::Value;
use std::process::Command;

use super::{DesktopApp, DesktopAppsProvider};

pub struct MacDesktopApps {}

impl DesktopAppsProvider for MacDesktopApps {
    fn get_desktop_entries() -> Vec<DesktopApp> {
        let mut entries = Vec::new();

        let output = Command::new("system_profiler")
            .arg("-json")
            .arg("SPApplicationsDataType")
            .output()
            .expect("failed to execute process");

        let json = String::from_utf8_lossy(&output.stdout);
        let v: Value = serde_json::from_str(&json).unwrap();

        for app in v.as_array().unwrap() {
            let path = app["path"].as_str().unwrap().to_string();
            let name = app["_name"].as_str().unwrap().to_string();

            entries.push(DesktopApp::new(path, name, None, None));
        }

        entries
    }
}
