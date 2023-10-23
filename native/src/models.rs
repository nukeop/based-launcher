use crate::schema::icon_cache;
use diesel::prelude::*;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = icon_cache)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Icon {
    pub path: String,
    pub name: String,
}
