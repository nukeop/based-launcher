mod mac;

use std::fs;

use freedesktop_desktop_entry::{default_paths, DesktopEntry, Iter};
use freedesktop_icons::lookup;
use neon::prelude::*;

use mac::get_apps_json;

fn get_desktop_entries(mut cx: FunctionContext) -> JsResult<JsArray> {
    let entries = cx.empty_array();

    for path in Iter::new(default_paths()) {
        if let Ok(bytes) = fs::read_to_string(&path) {
            if let Ok(entry) = DesktopEntry::decode(&path, &bytes) {
                let locale = Some("en-US");
                let obj = cx.empty_object();

                let path_str = path.to_str().unwrap();
                let path_js_str = cx.string(path_str);
                obj.set(&mut cx, "path", path_js_str)?;

                let name = cx.string(entry.name(locale).unwrap_or_default().to_string());
                obj.set(&mut cx, "name", name)?;

                let description = cx.string(entry.comment(locale).unwrap_or_default().to_string());
                obj.set(&mut cx, "description", description)?;

                let icon_name = entry.icon().unwrap_or_default().to_string();
                let icon = lookup(&icon_name)
                    .with_size(48)
                    .find()
                    .unwrap_or_default()
                    .into_os_string()
                    .into_string()
                    .unwrap();

                if (icon.len() > 0) {
                    let icon_value = cx.string(icon);

                    obj.set(&mut cx, "icon", icon_value)?;
                }

                let len = entries.len(&mut cx);
                entries.set(&mut cx, len, obj)?;
            }
        }
    }
    Ok(entries)
}

fn get_apps_mac(mut cx: FunctionContext) -> JsResult<JsString> {
    let entries = cx.empty_array();
    let process = get_apps_json();
    let json = String::from_utf8_lossy(&process.stdout);

    Ok(cx.string(json))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getDesktopEntries", get_desktop_entries)?;
    cx.export_function("getAppsMac", get_apps_mac)?;
    Ok(())
}
