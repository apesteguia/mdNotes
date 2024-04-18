import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./note.css";
import "react-toastify/dist/ReactToastify.css";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import Bar from "./Bar.tsx";

type NoteProps = {
  text: string;
  path: string;
};

export function Note({ text, path }: NoteProps) {
  const [visual, setVisual] = useState<boolean>(true);
  const [textareaText, setTextareaText] = useState<string>(text);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        setVisual(!visual);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    setTextareaText(text);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [text, visual]);

  const handleVisual = () => {
    setVisual(!visual);
  };

  const handleTextareaChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newText = e.target.value;
    setTextareaText(newText);
    //await invoke("save", { content: newText, path: path });
    console.log(newText);
  };

  return (
    <div className="note">
      <Bar name={path} txt={textareaText} />
      <button className="visual" onClick={handleVisual}>
        Visual: {visual ? "On" : "Off"}
      </button>
      {visual ? (
        <Markdown
          className="textarea"
          children={textareaText}
          remarkPlugins={[[remarkGfm]]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  styles={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        ></Markdown>
      ) : (
        <textarea
          className="textarea ml-5 mt-5 border-0 h-full w-full focus:outline-none"
          value={textareaText}
          onChange={handleTextareaChange}
        />
      )}
    </div>
  );
}

export default Note;
