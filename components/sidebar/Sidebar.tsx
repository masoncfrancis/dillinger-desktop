"use client";

import { useCallback, useState } from "react";
import { useStore } from "@/stores/store";
import { useToast } from "@/components/ui/Toast";
import { getDesktopBridge } from "@/lib/desktop";
import { DocumentList } from "./DocumentList";
import { Plus, FileText, ChevronRight, X } from "lucide-react";

export function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const createDocument = useStore((state) => state.createDocument);
  const currentDocument = useStore((state) => state.currentDocument);
  const isDirty = useStore((state) => state.isDirty);
  const setCurrentDocumentFilePath = useStore((state) => state.setCurrentDocumentFilePath);
  const markCurrentDocumentSaved = useStore((state) => state.markCurrentDocumentSaved);
  const closeDocument = useStore((state) => state.closeDocument);
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const { notify } = useToast();
  const [pendingCloseId, setPendingCloseId] = useState<string | null>(null);

  const requestClose = useCallback((id: string) => {
    if (id === currentDocument?.id && isDirty) {
      setPendingCloseId(id);
      return;
    }
    closeDocument(id);
  }, [closeDocument, currentDocument?.id, isDirty]);

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
      <div
        className={`fixed inset-0 bg-black/50 z-sidebar sm:hidden transition-opacity duration-250
                    ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <aside
        className={`fixed sm:relative w-sidebar shrink-0 bg-bg-sidebar h-dvh flex flex-col z-sidebar
                    transition-all duration-250
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0 sm:-ml-[270px]"}`}
      >
        <div className="pt-4" />
        <nav className="flex-1 overflow-auto px-4">
          <CollapsibleSection
            label="Open files"
            panelId="documents-panel"
            icon={<FileText size={14} />}
            isOpen
          >
            <DocumentList onClose={requestClose} />
          </CollapsibleSection>
        </nav>

        <div className="p-4 border-t border-border-settings">
          <button
            onClick={createDocument}
            className="w-full bg-plum text-bg-sidebar py-2 px-4 rounded font-medium
                       hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-sidebar"
          >
            <Plus size={18} />
            New Document
          </button>
        </div>
      </aside>
      {pendingCloseId && currentDocument?.id === pendingCloseId && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="close-document-title">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPendingCloseId(null)} aria-hidden="true" />
          <div className="relative w-full max-w-md rounded-lg bg-bg-navbar p-6 shadow-xl">
            <button
              onClick={() => setPendingCloseId(null)}
              aria-label="Cancel close"
              className="absolute right-4 top-4 text-text-muted hover:text-text-invert rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            >
              <X size={18} />
            </button>
            <h2 id="close-document-title" className="text-lg font-semibold text-text-invert">Save changes?</h2>
            <p className="mt-2 text-sm text-text-muted">
              <span className="text-text-invert">{currentDocument.title}</span> has unsaved changes.
            </p>
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

function CollapsibleSection({
  label,
  panelId,
  icon,
  isOpen,
  children,
}: {
  label: string;
  panelId: string;
  icon: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="w-full flex items-center justify-between py-2 text-text-muted text-xs uppercase tracking-wider">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ChevronRight size={14} className={isOpen ? "rotate-90" : ""} />
      </div>
      <div id={panelId}>
        <div className="ml-2 space-y-1 mt-1">{children}</div>
      </div>
    </div>
  );
}
