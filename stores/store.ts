import { create } from "zustand";
import type * as Monaco from "monaco-editor";
import { Document, UserSettings, DEFAULT_SETTINGS, DEFAULT_DOCUMENT_BODY } from "@/lib/types";
import { DEFAULT_DOCUMENT_TITLE } from "@/lib/document";

interface AppState {
  // Documents
  documents: Document[];
  currentDocument: Document | null;
  editorInstance: Monaco.editor.IStandaloneCodeEditor | null;

  // Settings
  settings: UserSettings;

  // UI State
  sidebarOpen: boolean;
  settingsOpen: boolean;
  shortcutsOpen: boolean;
  previewVisible: boolean;
  zenMode: boolean;
  isDirty: boolean;
  editorScrollPercent: number;
  editorTopLine: number;

  // Document Actions
  createDocument: () => void;
  createImportedDocument: (title: string, body: string, filePath?: string, fileModifiedAt?: number) => void;
  setCurrentDocumentFilePath: (filePath: string, fileModifiedAt?: number) => void;
  setCurrentDocumentFileModifiedAt: (fileModifiedAt: number) => void;
  markCurrentDocumentSaved: (body: string, fileModifiedAt: number) => boolean;
  selectDocument: (id: string) => void;
  updateDocumentBody: (body: string) => void;
  updateDocumentTitle: (title: string) => void;
  setEditorInstance: (editor: Monaco.editor.IStandaloneCodeEditor | null) => void;
  insertMarkdownAtCursor: (markdown: string) => void;

  // Settings Actions
  updateSettings: (settings: Partial<UserSettings>) => void;

  // UI Actions
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleShortcuts: () => void;
  togglePreview: () => void;
  setZenMode: (enabled: boolean) => void;
  setEditorScrollPercent: (percent: number) => void;
  setEditorTopLine: (line: number) => void;

}

const createDefaultDocument = (): Document => ({
  id: Date.now().toString(),
  title: DEFAULT_DOCUMENT_TITLE,
  body: DEFAULT_DOCUMENT_BODY,
  createdAt: new Date().toISOString(),
});

const initialDocument = createDefaultDocument();

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  documents: [initialDocument],
  currentDocument: initialDocument,
  editorInstance: null,
  settings: DEFAULT_SETTINGS,
  sidebarOpen: false,
  settingsOpen: false,
  shortcutsOpen: false,
  previewVisible: true,
  zenMode: false,
  isDirty: false,
  editorScrollPercent: 0,
  editorTopLine: 1,

  // Document Actions
  createDocument: () => {
    const newDoc = createDefaultDocument();
    set((state) => ({
      documents: [...state.documents, newDoc],
      currentDocument: newDoc,
    }));
  },

  createImportedDocument: (title: string, body: string, filePath?: string, fileModifiedAt?: number) => {
    const newDoc = {
      ...createDefaultDocument(),
      title,
      body,
      ...(filePath ? { filePath, fileModifiedAt } : {}),
    };

    set((state) => ({
      documents: [...state.documents, newDoc],
      currentDocument: newDoc,
    }));
  },

  setCurrentDocumentFilePath: (filePath: string, fileModifiedAt?: number) => {
    const { currentDocument, documents } = get();
    if (!currentDocument) return;

    const updated = {
      ...currentDocument,
      filePath,
      ...(fileModifiedAt !== undefined ? { fileModifiedAt } : {}),
    };
    const updatedDocs = documents.map((doc) =>
      doc.id === currentDocument.id ? updated : doc
    );

    set({ currentDocument: updated, documents: updatedDocs });
  },

  markCurrentDocumentSaved: (body: string, fileModifiedAt: number) => {
    const { currentDocument, documents } = get();
    if (!currentDocument || currentDocument.body !== body) return false;

    const updated = { ...currentDocument, fileModifiedAt };
    const updatedDocs = documents.map((doc) =>
      doc.id === currentDocument.id ? updated : doc
    );

    set({ currentDocument: updated, documents: updatedDocs, isDirty: false });
    return true;
  },

  setCurrentDocumentFileModifiedAt: (fileModifiedAt: number) => {
    const { currentDocument, documents } = get();
    if (!currentDocument) return;

    const updated = { ...currentDocument, fileModifiedAt };
    const updatedDocs = documents.map((doc) =>
      doc.id === currentDocument.id ? updated : doc
    );

    set({ currentDocument: updated, documents: updatedDocs });
  },

  selectDocument: (id: string) => {
    const doc = get().documents.find((d) => d.id === id);
    if (doc) {
      set({ currentDocument: doc });
    }
  },

  updateDocumentBody: (body: string) => {
    const { currentDocument, documents } = get();
    if (!currentDocument) return;

    const updated = { ...currentDocument, body };
    const updatedDocs = documents.map((d) =>
      d.id === currentDocument.id ? updated : d
    );

    set({ currentDocument: updated, documents: updatedDocs, isDirty: true });
  },

  updateDocumentTitle: (title: string) => {
    const { currentDocument, documents } = get();
    if (!currentDocument) return;

    const updated = { ...currentDocument, title };
    const updatedDocs = documents.map((d) =>
      d.id === currentDocument.id ? updated : d
    );

    set({ currentDocument: updated, documents: updatedDocs });
  },

  setEditorInstance: (editor) => set({ editorInstance: editor }),

  insertMarkdownAtCursor: (markdown: string) => {
    const { editorInstance, currentDocument, documents } = get();

    if (editorInstance) {
      const selection = editorInstance.getSelection();
      if (selection) {
        editorInstance.executeEdits("dillinger-inline-insert", [
          {
            range: selection,
            text: markdown,
            forceMoveMarkers: true,
          },
        ]);
        editorInstance.focus();
        return;
      }
    }

    if (!currentDocument) return;

    const updated = { ...currentDocument, body: `${currentDocument.body}${markdown}` };
    const updatedDocs = documents.map((doc) =>
      doc.id === currentDocument.id ? updated : doc
    );

    set({ currentDocument: updated, documents: updatedDocs });
  },

  // Settings Actions
  updateSettings: (newSettings: Partial<UserSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  // UI Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
  toggleShortcuts: () => set((state) => ({ shortcutsOpen: !state.shortcutsOpen })),
  togglePreview: () => set((state) => ({ previewVisible: !state.previewVisible })),
  setZenMode: (enabled) => set({ zenMode: enabled }),
  setEditorScrollPercent: (percent) => set({ editorScrollPercent: percent }),
  setEditorTopLine: (line) => set({ editorTopLine: line }),

}));
