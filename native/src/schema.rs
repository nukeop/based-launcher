// @generated automatically by Diesel CLI.

diesel::table! {
    icon_cache (id) {
        id -> Nullable<Integer>,
        path -> Text,
        name -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    last_modified_dates (id) {
        id -> Nullable<Integer>,
        path -> Text,
        last_modified -> Timestamp,
    }
}

diesel::table! {
    launcher_metadata (id) {
        id -> Nullable<Integer>,
        property -> Text,
        value -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    icon_cache,
    last_modified_dates,
    launcher_metadata,
);
