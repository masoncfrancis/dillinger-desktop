export interface Document {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  filePath?: string;
  fileModifiedAt?: number;
  isDirty?: boolean;
}

export interface UserSettings {
  enableWordsCount: boolean;
  enableCharactersCount: boolean;
  enableScrollSync: boolean;
  tabSize: number;
  keybindings: "default" | "vim" | "emacs";
  enableNightMode: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  enableWordsCount: true,
  enableCharactersCount: true,
  enableScrollSync: true,
  tabSize: 4,
  keybindings: "default",
  enableNightMode: false,
};

export const DEFAULT_DOCUMENT_BODY = "";
