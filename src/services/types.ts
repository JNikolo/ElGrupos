export interface GroupData {
  title: string;
  color: ChromeTabGroupColor;
}

export interface ImportedTab {
  title: string;
  url: string;
}

export interface ImportedGroup {
  title: string;
  color?: ChromeTabGroupColor;
  tabs: ImportedTab[];
}

export type ChromeTabGroupColor =
  | "blue"
  | "cyan"
  | "green"
  | "grey"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow";
