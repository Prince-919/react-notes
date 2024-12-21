import { ChangeEventHandler, useState, useEffect } from "react";
import NoteItem from "./components/NoteItem";
import axios from "axios";

interface noteType {
  id: string;
  title: string;
  description?: string;
}

const App = () => {
  const [noteToView, setNoteToView] = useState<noteType>();
  const [notes, setNotes] = useState<noteType[]>([]);
  const [values, setValues] = useState({
    title: "",
    description: "",
  });
  const [selectedNoteId, setSelectedNoteId] = useState("");

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get(
        "https://todo-api-4kk2.onrender.com/note"
      );
      setNotes(data.notes);
      console.log(data.notes);
    };
    fetchNotes();
  }, []);

  return (
    <div className="max-w-3xl m-auto space-y-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (selectedNoteId) {
            const { data } = await axios.patch(
              "https://todo-api-4kk2.onrender.com/note/" + selectedNoteId,
              { title: values.title, description: values.description }
            );
            const updatedNotes = notes.map((note) => {
              if (note.id === selectedNoteId) {
                note.title = data.note.title;
                note.description = data.note.description;
              }
              return note;
            });
            setNotes([...updatedNotes]);
            setValues({ title: "", description: "" });
            return;
          }
          const { data } = await axios.post(
            "https://todo-api-4kk2.onrender.com/note/create",
            { title: values.title, description: values.description }
          );
          setNotes([data.note, ...notes]);
          setValues({ title: "", description: "" });
        }}
        className=" bg-white shadow-md rounded p-5 space-y-6"
      >
        <h1 className="font-semibold text-2xl text-center">Note Application</h1>
        <div>
          {values.title.trim() && values.title.length < 3 ? (
            <p className="text-red-500">Title is too short.</p>
          ) : null}
          <input
            className="outline-none w-full border-b-2 border-gray-700"
            type="text"
            placeholder="Title"
            value={values.title}
            onChange={handleChange}
            name="title"
          />
        </div>
        <div>
          <textarea
            className="outline-none w-full border-b-2 border-gray-700 resize-none h-36"
            placeholder="Description"
            value={values.description}
            onChange={handleChange}
            name="description"
          ></textarea>
        </div>
        <div className="text-right">
          <button
            onClick={() => {
              console.log(values);
            }}
            className="bg-blue-500 text-white px-5 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Note Items */}

      {notes.map((note) => {
        return (
          <NoteItem
            onViewClick={() => {
              if (noteToView) {
                setNoteToView(undefined);
              } else {
                setNoteToView(note);
              }
            }}
            description={
              noteToView?.id === note.id ? noteToView?.description : ""
            }
            onEditClick={() => {
              setSelectedNoteId(note.id);
              setValues({
                title: note.title,
                description: note.description || "",
              });
            }}
            onDeleteClick={async () => {
              const result = confirm(
                "Are you sure you want to delete this note?."
              );
              if (result) {
                await axios.delete(
                  "https://todo-api-4kk2.onrender.com/note/" + note.id
                );
                const filteredNotes = notes.filter(({ id }) => id !== note.id);
                setNotes([...filteredNotes]);
              }
            }}
            key={note.id}
            title={note.title}
          />
        );
      })}
    </div>
  );
};

export default App;
