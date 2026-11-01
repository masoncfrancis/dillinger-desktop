"use client";

import { useStore } from "@/stores/store";
import { FileText } from "lucide-react";
import { X } from "lucide-react";

export function DocumentList({ onClose = () => {} }: { onClose?: (id: string) => void }) {
  const documents = useStore((state) => state.documents);
  const currentDocument = useStore((state) => state.currentDocument);
  const selectDocument = useStore((state) => state.selectDocument);

  return (
    <ul className="space-y-1">
      {documents.map((doc) => (
        <li key={doc.id}>
          <div
            className="w-full rounded flex items-center gap-1 text-sm transition-colors"
          >
            <button
              onClick={() => selectDocument(doc.id)}
              className={`min-w-0 flex-1 text-left px-3 py-2 rounded flex items-center gap-2
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum ${
                           currentDocument?.id === doc.id
                             ? "bg-bg-highlight text-text-invert"
                             : "text-dropdown-link hover:bg-bg-highlight/50"
                         }`}
            >
              <FileText size={16} />
              <span className="truncate">{doc.title}</span>
            </button>
            <button
              onClick={() => onClose(doc.id)}
              aria-label="Close open file"
              title={`Close ${doc.title}`}
              className="mr-1 rounded p-1 text-text-muted hover:text-text-invert
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            >
              <X size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
