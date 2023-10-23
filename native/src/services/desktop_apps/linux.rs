use std::fs;

use diesel::prelude::*;
use freedesktop_desktop_entry::{default_paths, DesktopEntry, Iter};
use freedesktop_icons::lookup;

use crate::schema::icon_cache;
use crate::{models::Icon, services::database::connection::establish_connection};

use super::{DesktopApp, DesktopAppsProvider};

pub struct LinuxDesktopApps {}

impl DesktopAppsProvider for LinuxDesktopApps {
    fn get_desktop_entries() -> Vec<DesktopApp> {
        let mut entries = Vec::new();

        for path in Iter::new(default_paths()) {
            let mut connection = establish_connection();

            if let Ok(bytes) = fs::read_to_string(&path) {
                if let Ok(entry) = DesktopEntry::decode(&path, &bytes) {
                    let locale = Some("en-US");

                    let path_str = path.to_str().unwrap().to_string();
                    let name = entry.name(locale).unwrap_or_default().to_string();
                    let description = entry.comment(locale).unwrap_or_default().to_string();
                    let icon_name = entry.icon().unwrap_or_default().to_string();
                    let icon = lookup(&icon_name)
                        .with_size(48)
                        .find()
                        .unwrap_or_default()
                        .into_os_string()
                        .into_string()
                        .unwrap();

                    let new_icon = Icon {
                        path: path_str.as_str().to_string(),
                        name: name.as_str().to_string(),
                    };

                    diesel::insert_into(icon_cache::table)
                        .values(new_icon)
                        .returning(Icon::as_returning())
                        .get_result(&mut connection)
                        .expect("Error saving new icon");

                    entries.push(DesktopApp::new(
                        path_str,
                        name,
                        Some(description),
                        Some(icon),
                    ));
                }
            }
        }

        entries
    }
}
