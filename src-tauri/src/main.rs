// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

use files::{create_file, read_note, save_file};

pub mod files;
pub mod notes;

#[tauri::command]
fn get_notes() -> Vec<files::NoteData> {
    let n = notes::Note::new();
    n.dir.notes
}

#[tauri::command]
fn get_note_string(path: PathBuf) -> String {
    let string = match read_note(path) {
        Ok(string) => string,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };
    string
}

#[tauri::command]
fn save(content: String, path: PathBuf) {
    match save_file(content.clone(), path) {
        Ok(_) => println!("FILE SAVED CORRECTAMENTE {}", content),
        Err(error) => {
            eprintln!("Error saving file: {:?}", error);
        }
    }
}

#[tauri::command]
fn create(path: String) {
    match create_file(path) {
        Ok(_) => println!("FILE CREATED SUCCESFULLY"),
        Err(error) => eprintln!("Error creating file {:?}", error),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_notes,
            get_note_string,
            save,
            create
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
