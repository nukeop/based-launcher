pub mod services;

use neon::prelude::*;

use services::linux::LinuxDesktopApps;

fn get_desktop_entries(mut cx: FunctionContext) -> JsResult<JsArray> {
    let entries = LinuxDesktopApps::new().to_js_array(&mut cx)?;
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
