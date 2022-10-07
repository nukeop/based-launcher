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
        let v: serde_json::Value = serde_json::from_str(&json).unwrap();

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


                    let plist_path = format!("{}/Contents/Info.plist", path);
                    let plist = plist::Value::from_file(plist_path).unwrap();

                    let icon = plist
                        .as_dictionary()
                        .and_then(|dict| dict.get("CFBundleIconFile"))
                        .and_then(|icon| icon.as_string()).unwrap();

                    entries.push(DesktopApp::new(path, name, None, Some(icon.to_string())));
                }
            }
            None => {}
        }

        entries
    }
}
