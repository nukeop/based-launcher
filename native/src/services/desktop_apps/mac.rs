use super::{DesktopApp, DesktopAppsProvider};

pub struct MacDesktopApps {}

impl DesktopAppsProvider for MacDesktopApps {
    fn get_desktop_entries() -> Vec<DesktopApp> {
        // Mac desktop apps are not supported yet
        vec![]
    }
}
