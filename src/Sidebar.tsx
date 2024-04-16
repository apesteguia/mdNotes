import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { ToastContainer } from "react-toastify";
import Note from "./note.tsx";
import NewNote from "./NewNote.tsx";
import "./sidebar.css";

interface Note {
  path: string;
}

const Sidebar: React.FC = () => {
  const [originalNotes, setOriginalNotes] = useState<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotePath, setSelectedNotePath] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>("");

  const fetchNotes = async () => {
    const fetchedNotes: Note[] = await invoke("get_notes");
    setOriginalNotes(fetchedNotes);
    setNotes(fetchedNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFetchNotes = async () => {
    await fetchNotes();
  };

  const handleNoteClick = async (path: string) => {
    setSelectedNotePath(path);
    const content: string = await invoke("get_note_string", { path });
    setSelectedNoteContent(content);
    console.log(selectedNoteContent);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    const filteredResults = originalNotes.filter((item: Note) =>
      item.path.toLowerCase().includes(value.toLowerCase()),
    );
    setNotes(filteredResults);
  };

  return (
    <div className="sidebar">
      <div className="wrapper">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <div className="header">
          <h1 className="h1"> Notes</h1>
          {/* Pasa la función de callback al componente NewNote */}

          <NewNote onNoteCreated={handleFetchNotes} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="input"
          onChange={handleInputChange}
        />
        <ul className="ul mt-5 flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.path} onClick={() => handleNoteClick(note.path)}>
              <button
                className={`li ${note.path === selectedNotePath ? "selected" : "note-button"}`}
              >
                {note.path.split("/").pop()}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedNotePath && (
        <Note text={selectedNoteContent} path={selectedNotePath} />
      )}
    </div>
  );
};

export default Sidebar;
