use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};

#[derive(Debug, Deserialize, Serialize)]
pub struct NoteData {
    pub path: PathBuf,
    pub meta: String, // Cambiado a String
}

impl NoteData {
    pub fn new(path: PathBuf, meta: String) -> Self {
        Self { path, meta }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NotesDir {
    pub path: PathBuf,
    pub notes: Vec<NoteData>,
}

impl NotesDir {
    pub fn new(path: PathBuf) -> Self {
        let notes: Vec<NoteData> = Vec::new();
        if !Path::new(&path).exists() {
            _create_note_dir(&path).expect("ERROR CREATING NOTE DIR");
        }

        Self { path, notes }
    }

    pub fn get_notes_data(&mut self) {
        self.notes = _get_notes_data(self.path.clone()).expect("ERROR GET NOTES DATA");
    }
}

fn _get_notes_data(path: PathBuf) -> std::io::Result<Vec<NoteData>> {
    let mut buf = vec![];
    let entries = fs::read_dir(path)?;

    for entry in entries {
        let entry = entry?;
        let meta = entry.metadata()?;

        if meta.is_file() {
            let meta_string = format!("{:?}", meta.created()?); // Convertir Metadata a String
            buf.push(NoteData::new(entry.path(), meta_string));
        }
    }

    Ok(buf)
}

pub fn read_note(path: PathBuf) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}

pub fn _create_note_dir(path: &PathBuf) -> Result<(), std::io::Error> {
    fs::create_dir(path)
}

pub fn save_file(content: String, path: PathBuf) -> std::io::Result<()> {
    //let mut file = fs::OpenOptions::new().append(true).open(path)?;
    let mut file = fs::File::create(path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

pub fn create_file(path: String) -> std::io::Result<()> {
    let _ = fs::File::create(path)?;
    Ok(())
}
