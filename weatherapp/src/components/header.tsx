export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Weather App</h1>
      <input
        type="text"
        placeholder="Search for a city..."
        className="px-4 py-2 border rounded-lg focus:outline-none"
      />
    </header>
  );
}