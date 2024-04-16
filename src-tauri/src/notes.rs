use crate::files::NotesDir;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Deserialize, Serialize)]
pub struct Note {
    pub dir: NotesDir,
    pub note: Option<String>,
}

//ONLY IN DEVELOPMENT

impl Note {
    pub fn new() -> Self {
        let path: PathBuf = PathBuf::from("/home/mikel/.notes/");
        let mut dir = NotesDir::new(path);
        dir.get_notes_data();

        Self {
            dir,
            note: Some("".to_string()),
        }
    }
}
