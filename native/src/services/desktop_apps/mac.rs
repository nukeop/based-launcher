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

        match v.as_object().unwrap().get("SPApplicationsDataType") {
            Some(apps) => {
                for app in apps.as_array().unwrap() {
                    let path = app
                        .as_object()
                        .unwrap()
                        .get("path")
                        .unwrap()
                        .as_str()
                        .unwrap()
                        .to_string();

                    let name = app
                        .as_object()
                        .unwrap()
                        .get("_name")
                        .unwrap()
                        .as_str()
                        .unwrap()
                        .to_string();

                    entries.push(DesktopApp::new(path, name, None, None));
                }
            }
            None => {}
        }

        entries
    }
}
