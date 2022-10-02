use std::fs;

use freedesktop_desktop_entry::{default_paths, DesktopEntry, Iter};
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

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getDesktopEntries", get_desktop_entries)?;
    Ok(())
}
