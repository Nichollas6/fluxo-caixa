export default function Button({ children, color = "blue", ...props }) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    yellow: "bg-yellow-400"
  };

  return (
    <button
      className={`${colors[color]} text-white px-4 py-2 rounded-xl transition`}
      {...props}
    >
      {children}
    </button>
  );
}