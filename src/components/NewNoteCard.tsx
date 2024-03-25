import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShowOnboarding(false);
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    event.target.value === "" && setShowOnboarding(true);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    onNoteCreated(content);
    toast.success("Note successfully created");
    setContent("");
    setShowOnboarding(true);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md outline-none text-left bg-slate-700 p-5 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-300 flex flex-col">
        <span className="text-sm font-medium text-slate-200">Add note</span>
        <p className="text-sm leading-6 text-slate-400">
          Record an audio note that will be converted to text automatically.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 bg-slate-700 rounded-md -translate-x-1/2 -translate-y-1/2 max-w-[40rem] w-full flex flex-col outline-none h-[60vh] overflow-hidden">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
            <X className="size-5 hover:text-slate-100" />
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Add note
              </span>
              {showOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Start by{" "}
                  <button className="font-md text-lime-400 hover:underline">
                    recording an audio note
                  </button>{" "}
                  or, if you prefer, just{" "}
                  <button
                    onClick={handleStartEditor}
                    className="font-md text-lime-400 hover:underline"
                  >
                    use text
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 flex-1 outline-none text-slate-400 bg-transparent resize-none"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500"
            >
              Save note
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
