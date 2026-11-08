"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { useStore } from "@/stores/store";
import { getDesktopBridge } from "@/lib/desktop";
import { useToast } from "@/components/ui/Toast";

export function DocumentTabs() {
  const documents = useStore((state) => state.documents);
  const currentDocument = useStore((state) => state.currentDocument);
  const selectDocument = useStore((state) => state.selectDocument);
  const closeDocument = useStore((state) => state.closeDocument);
  const createDocument = useStore((state) => state.createDocument);
  const setCurrentDocumentFilePath = useStore((state) => state.setCurrentDocumentFilePath);
  const markCurrentDocumentSaved = useStore((state) => state.markCurrentDocumentSaved);
  const { notify } = useToast();
  const [pendingCloseId, setPendingCloseId] = useState<string | null>(null);

  const requestClose = useCallback((id: string) => {
    const document = useStore.getState().documents.find((item) => item.id === id);
    if (document?.isDirty) {
      selectDocument(id);
      setPendingCloseId(id);
      return;
    }
    closeDocument(id);
  }, [closeDocument, selectDocument]);

  const closeWithoutSaving = useCallback(() => {
    if (!pendingCloseId) return;
    closeDocument(pendingCloseId);
    setPendingCloseId(null);
  }, [closeDocument, pendingCloseId]);

  const saveAndClose = useCallback(async () => {
    if (!pendingCloseId || pendingCloseId !== currentDocument?.id || !currentDocument) return;
    const bridge = getDesktopBridge();
    if (!bridge) return;

    try {
      const saved = await bridge.saveFile({
        filePath: currentDocument.filePath,
        fileName: currentDocument.title,
        content: currentDocument.body,
      });
      if (!saved) return;

      setCurrentDocumentFilePath(saved.filePath, saved.modifiedAt);
      markCurrentDocumentSaved(currentDocument.body, saved.modifiedAt);
      closeDocument(pendingCloseId);
      setPendingCloseId(null);
      notify(`Saved "${saved.fileName}"`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Failed to save file");
    }
  }, [closeDocument, currentDocument, markCurrentDocumentSaved, notify, pendingCloseId, setCurrentDocumentFilePath]);

  return (
    <>
      <div className="flex min-h-11 overflow-x-auto border-b border-border-light bg-bg-navbar px-2" role="tablist" aria-label="Open files">
        {documents.map((document) => {
          const isActive = currentDocument?.id === document.id;
          return (
            <div
              key={document.id}
              className="group relative flex shrink-0 items-center border-r border-border-light/40"
              role="presentation"
            >
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => selectDocument(document.id)}
                className={`max-w-52 truncate px-4 py-3 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-plum ${
                  isActive ? "bg-bg-primary text-text-primary" : "text-text-muted hover:bg-bg-highlight hover:text-text-invert"
                }`}
              >
                {document.isDirty && <span aria-label="Unsaved changes">• </span>}
                {document.title}
              </button>
              <button
                onClick={() => requestClose(document.id)}
                aria-label={`Close ${document.title}`}
                title={`Close ${document.title}`}
                className={`absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted opacity-60 transition-colors hover:bg-bg-highlight hover:text-text-invert group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-plum ${
                  isActive ? "bg-bg-primary" : "bg-bg-navbar"
                }`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        <button
          onClick={createDocument}
          aria-label="New document"
          title="New document"
          className="shrink-0 rounded px-3 text-text-muted hover:bg-bg-highlight hover:text-text-invert focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum"
        >
          <Plus size={18} />
        </button>
      </div>
      {pendingCloseId && currentDocument?.id === pendingCloseId && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="close-document-title">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPendingCloseId(null)} aria-hidden="true" />
          <div className="relative w-full max-w-md rounded-lg bg-bg-navbar p-6 shadow-xl">
            <button onClick={() => setPendingCloseId(null)} aria-label="Cancel close" className="absolute right-4 top-4 text-text-muted hover:text-text-invert">
              <X size={18} />
            </button>
            <h2 id="close-document-title" className="text-lg font-semibold text-text-invert">Save changes?</h2>
            <p className="mt-2 text-sm text-text-muted"><span className="text-text-invert">{currentDocument.title}</span> has unsaved changes.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setPendingCloseId(null)} className="rounded px-3 py-2 text-sm text-text-muted hover:text-text-invert">Cancel</button>
              <button onClick={closeWithoutSaving} className="rounded px-3 py-2 text-sm text-red-300 hover:bg-red-950/40">Close Without Saving</button>
              <button onClick={() => void saveAndClose()} className="rounded bg-plum px-3 py-2 text-sm font-medium text-bg-sidebar hover:opacity-90">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
