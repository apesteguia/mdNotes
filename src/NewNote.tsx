import React, { useState, useEffect } from "react";
import "./newnote.css";
import { toast } from "react-toastify";
import { invoke } from "@tauri-apps/api";

//only development
const path = "/home/mikel/.notes/";

interface NewNoteProps {
  onNoteCreated: () => void;
}

const NewNote: React.FC<NewNoteProps> = ({ onNoteCreated }) => {
  const [show, setShow] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key == "n") {
        e.preventDefault();
        setShow(!show);
      }
    };

    const handleKeyEsc = async (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShow(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyEsc);

    return () => {
      window.removeEventListener("keydown", handleKeyEsc);
    };
  }, [show]);

  const handleShow = () => {
    setInput("");
    setShow(!show);
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCreate = async () => {
    if (input.length < 2) {
      handleShow();
      return;
    }
    handleShow();
    let format = path + input + ".md";
    console.log(format);
    await invoke("create", { path: format });
    toast.success("File created succesfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    console.log("toast");

    onNoteCreated();
  };

  return (
    <div>
      {!show ? (
        <button onClick={handleShow} className="newnote">
          New Note
        </button>
      ) : (
        <div className="cub" onClick={handleShow}>
          <div className="dialog" onClick={stopPropagation}>
            <h2 className="h2">Create a new note</h2>
            <div className="inp">
              <input
                className="inputnewnote"
                type="text"
                placeholder="Type the name"
                onChange={handleInputChange}
                value={input}
                maxLength={30}
              />
              <button onClick={handleCreate} className="newnote2">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewNote;
