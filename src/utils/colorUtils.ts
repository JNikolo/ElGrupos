export const getGroupColor = (color: string) => {
  const colorMap: { [key: string]: string } = {
    grey: "bg-slate-400",
    blue: "bg-material-info",
    red: "bg-material-error",
    yellow: "bg-material-warning",
    green: "bg-material-success",
    pink: "bg-pink-400",
    purple: "bg-material-primary",
    cyan: "bg-material-secondary",
    orange: "bg-orange-400",
  };
  return colorMap[color] || "bg-slate-400";
};
