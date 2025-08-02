import type { ChromeTabGroupColor } from "../services/types";

export interface ColorConfig {
  name: ChromeTabGroupColor;
  class: string;
  label: string;
}

export const TAB_GROUP_COLORS: ColorConfig[] = [
  { name: "grey", class: "bg-gray-500", label: "Grey" },
  { name: "blue", class: "bg-blue-500", label: "Blue" },
  { name: "red", class: "bg-red-500", label: "Red" },
  { name: "yellow", class: "bg-yellow-500", label: "Yellow" },
  { name: "green", class: "bg-green-500", label: "Green" },
  { name: "pink", class: "bg-pink-500", label: "Pink" },
  { name: "purple", class: "bg-purple-500", label: "Purple" },
  { name: "cyan", class: "bg-cyan-500", label: "Cyan" },
  { name: "orange", class: "bg-orange-500", label: "Orange" },
];

export const getColorConfig = (colorName: ChromeTabGroupColor): ColorConfig => {
  return (
    TAB_GROUP_COLORS.find((color) => color.name === colorName) ||
    TAB_GROUP_COLORS[0]
  );
};
