use crate::schema::icon_cache;
use diesel::prelude::*;

#[derive(Queryable, Insertable)]
#[diesel(table_name = icon_cache)]
pub struct Icon<'a> {
    pub path: &'a str,
    pub name: &'a str,
}
