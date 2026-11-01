import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/stores/store";
import { DEFAULT_DOCUMENT_BODY, DEFAULT_SETTINGS } from "@/lib/types";
import { DEFAULT_DOCUMENT_TITLE } from "@/lib/document";

const initialState = useStore.getState();

function resetStore() {
  useStore.setState(
    {
      ...initialState,
      documents: [],
      currentDocument: null,
      editorInstance: null,
      settings: { ...DEFAULT_SETTINGS },
      sidebarOpen: true,
      settingsOpen: false,
      shortcutsOpen: false,
      previewVisible: true,
      zenMode: false,
      isDirty: false,
      editorScrollPercent: 0,
      editorTopLine: 1,
    },
    true
  );
}

function createTestDocument(overrides: Partial<{
  id: string;
  title: string;
  body: string;
  createdAt: string;
}> = {}) {
  return {
    id: overrides.id ?? "doc-1",
    title: overrides.title ?? "Test.md",
    body: overrides.body ?? "# Test",
    createdAt: overrides.createdAt ?? "2026-03-10T00:00:00.000Z",
  };
}

describe("useStore", () => {
  beforeEach(resetStore);

  it("creates a local default document in memory", () => {
    useStore.getState().createDocument();

    expect(useStore.getState().currentDocument?.title).toBe(DEFAULT_DOCUMENT_TITLE);
    expect(useStore.getState().currentDocument?.body).toBe(DEFAULT_DOCUMENT_BODY);
  });

  it("creates imported documents without persistence", () => {
    useStore.getState().createImportedDocument("Imported.html", "# Imported");

    const state = useStore.getState();
    expect(state.currentDocument?.title).toBe("Imported.html");
    expect(state.currentDocument?.body).toBe("# Imported");
    expect(localStorage.getItem("files")).toBeNull();
  });

  it("keeps the native file path and modification time", () => {
    useStore.getState().createImportedDocument("notes.md", "# Notes", "C:\\Notes\\notes.md", 10);

    expect(useStore.getState().currentDocument?.filePath).toBe("C:\\Notes\\notes.md");
    expect(useStore.getState().currentDocument?.fileModifiedAt).toBe(10);
  });

  it("marks matching native file content as saved", () => {
    useStore.getState().createImportedDocument("notes.md", "# Notes", "C:\\Notes\\notes.md", 10);
    useStore.getState().updateDocumentBody("# Updated");

    expect(useStore.getState().markCurrentDocumentSaved("# Updated", 20)).toBe(true);
    expect(useStore.getState().isDirty).toBe(false);
    expect(useStore.getState().currentDocument?.fileModifiedAt).toBe(20);
  });

  it("does not clear dirty state for stale content", () => {
    useStore.getState().createImportedDocument("notes.md", "# Notes", "C:\\Notes\\notes.md", 10);
    useStore.getState().updateDocumentBody("# Latest");

    expect(useStore.getState().markCurrentDocumentSaved("# Older", 20)).toBe(false);
    expect(useStore.getState().isDirty).toBe(true);
  });

  it("updates and selects open documents in memory", () => {
    const first = createTestDocument({ id: "first" });
    const second = createTestDocument({ id: "second", title: "Second.md" });
    useStore.setState({ documents: [first, second], currentDocument: first });

    useStore.getState().selectDocument("second");
    expect(useStore.getState().currentDocument?.id).toBe("second");
    useStore.getState().updateDocumentTitle("Renamed.md");
    expect(useStore.getState().documents[1]?.title).toBe("Renamed.md");
  });

  it("updates the editor document and marks it dirty", () => {
    const document = createTestDocument();
    useStore.setState({ documents: [document], currentDocument: document });

    useStore.getState().updateDocumentBody("Updated");

    expect(useStore.getState().currentDocument?.body).toBe("Updated");
    expect(useStore.getState().isDirty).toBe(true);
  });

  it("updates settings in memory without local storage", () => {
    useStore.getState().updateSettings({ tabSize: 2 });

    expect(useStore.getState().settings.tabSize).toBe(2);
    expect(localStorage.getItem("profileV3")).toBeNull();
  });

  it("never exposes a document deletion action", () => {
    expect("deleteDocument" in useStore.getState()).toBe(false);
  });
});
