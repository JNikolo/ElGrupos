import { getColorConfig } from "./groupColors";
import type { ChromeTabGroupColor } from "../services/types";

export const getGroupColor = (color: string) => {
  const colorConfig = getColorConfig(color as ChromeTabGroupColor);
  return colorConfig.class;
};
