export const getGroupColor = (color: string) => {
  const colorMap: { [key: string]: string } = {
    grey: "bg-gray-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
  };
  return colorMap[color] || "bg-gray-500";
};
