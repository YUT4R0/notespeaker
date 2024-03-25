import { ChangeEvent, useState } from "react";
import logo from "./assets/logo_nlw_expert.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";

interface NoteProps {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) return JSON.parse(notesOnStorage);
    return [];
  });
  const [search, setSearch] = useState("");

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    const notes_arr = [newNote, ...notes];
    localStorage.setItem("notes", JSON.stringify(notes_arr));
    setNotes(notes_arr);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((notes) =>
          notes.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="nlw expert" />
      <form className="w-full">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search your notes..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter placeholder:text-slate-500 outline-none"
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-3 auto-rows-[15.5rem] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => {
          return <NoteCard key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
