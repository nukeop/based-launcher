use std::fs;

mod mac;

use freedesktop_desktop_entry::{default_paths, DesktopEntry, Iter};
use mac::get_apps_json;
use neon::prelude::*;

fn get_desktop_entries(mut cx: FunctionContext) -> JsResult<JsArray> {
    let entries = cx.empty_array();

    for path in Iter::new(default_paths()) {
        if let Ok(bytes) = fs::read_to_string(&path) {
            if let Ok(entry) = DesktopEntry::decode(&path, &bytes) {
                let locale = Some("en-US");
                let obj = cx.empty_object();

                let name = cx.string(entry.name(locale).unwrap_or_default().to_string());
                obj.set(&mut cx, "name", name)?;

                let description = cx.string(entry.comment(locale).unwrap_or_default().to_string());
                obj.set(&mut cx, "description", description)?;

                let icon = cx.string(entry.icon().unwrap_or_default().to_string());

                obj.set(&mut cx, "icon", icon)?;
            }
        }
    }
    Ok(entries)
}

fn get_apps_mac(mut cx: FunctionContext) -> JsResult<JsString> {
    let entries = cx.empty_array();
    let process = get_apps_json();
    let json = String::from_utf8_lossy(&process.stdout);

    // entries.p

    // Ok(entries)

    Ok(cx.string(json))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getDesktopEntries", get_desktop_entries)?;
    cx.export_function("getAppsMac", get_apps_mac)?;
    Ok(())
}
