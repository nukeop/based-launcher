pub mod services;

use neon::prelude::*;

use services::desktop_apps::linux::LinuxDesktopApps;
use services::desktop_apps::mac::MacDesktopApps;
use services::desktop_apps::DesktopAppsProvider;

fn get_desktop_apps<'a>(mut cx: CallContext<'a, JsObject>) -> JsResult<'a, JsArray> {
    let strategy: Handle<JsValue> = cx.argument(0)?;
    let strategy_str: Handle<JsString> = strategy.downcast(&mut cx).unwrap();
    match strategy_str.value(&mut cx).as_str() {
        "linux" => {
            let entries = LinuxDesktopApps::to_js_array(&mut cx);
            Ok(entries)
        }
        "darwin" => {
            let entries = MacDesktopApps::to_js_array(&mut cx);
            Ok(entries)
        }
        _ => cx.throw_error("Unsupported platform"),
    }
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getDesktopApps", get_desktop_apps)?;
    Ok(())
}
