import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleStartEditor = () => setShowOnboarding(false);

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    event.target.value === "" && setShowOnboarding(true);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if (content === "") return;
    onNoteCreated(content);
    toast.success("Note successfully created");
    setContent("");
    setShowOnboarding(true);
  }

  function handleStartRecording() {
    const isSpeachRecognitionAPIAvaliable =
      "SpeechRecognition" in window || "webkitSpeechRecognition";

    if (!isSpeachRecognitionAPIAvaliable) {
      alert("Sadly your browser does not support speech recognition :/");
      return;
    }

    setIsRecording(true);
    setShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 5;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    speechRecognition && speechRecognition.stop();
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
        <Dialog.Content className="fixed md:left-1/2 md:top-1/2 bg-slate-700 md:rounded-md md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[40rem] w-full flex flex-col outline-none md:h-[60vh] overflow-hidden sm:inset-0 md:inset-auto">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
            <X className="size-5 hover:text-slate-100" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Add note
              </span>
              {showOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Start by{" "}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-md text-lime-400 hover:underline"
                  >
                    recording an audio note
                  </button>{" "}
                  or, if you prefer, just{" "}
                  <button
                    type="button"
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
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:text-slate-100 flex items-center justify-center gap-2"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                <span>Recording! (click to stop)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500"
              >
                Save note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
