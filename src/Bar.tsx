import "./bar.css";
import { CiSaveDown2 } from "react-icons/ci";
import { SlOptionsVertical } from "react-icons/sl";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

function Bar({ name, txt }: { name: string; txt: string }) {
  const handleSave = async () => {
    await invoke("save", { content: txt, path: name });
    toast.success("File saved succesfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="bar">
      <h1 className="name">{name.split("/").pop()}</h1>
      <button onClick={handleSave} className="save icon">
        <CiSaveDown2 />
      </button>
      <button className="options icon">
        <SlOptionsVertical />
      </button>
    </div>
  );
}

export default Bar;
