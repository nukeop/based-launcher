use neon::prelude::*;
pub struct DesktopApp {
    path: String,
    name: String,
    description: Option<String>,
    icon: Option<String>,
}

impl DesktopApp {
    pub fn new(
        path: String,
        name: String,
        description: Option<String>,
        icon: Option<String>,
    ) -> Self {
        DesktopApp {
            path,
            name,
            description,
            icon,
        }
    }

    pub fn to_js_object<'a>(&'a self, cx: &'a mut FunctionContext) -> JsResult<JsObject> {
        let obj = cx.empty_object();

        let path = cx.string(&self.path);
        obj.set(cx, "path", path)?;

        let name = cx.string(&self.name);
        obj.set(cx, "name", name)?;

        if let Some(description) = &self.description {
            let description = cx.string(description);
            obj.set(cx, "description", description)?;
        }

        if let Some(icon) = &self.icon {
            let icon = cx.string(icon);
            obj.set(cx, "icon", icon)?;
        }

        Ok(obj)
    }
}

pub trait DesktopAppsProvider {
    fn get_desktop_entries(&self) -> Vec<DesktopApp>;
    fn to_js_array(&self, cx: &mut FunctionContext) -> JsResult<JsArray>;
}
