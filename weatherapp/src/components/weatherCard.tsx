export default function WeatherCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold mb-2">Lagos, Nigeria</h2>
      <p className="text-5xl font-bold">28°C</p>
      <p className="text-gray-500 text-lg">Sunny</p>
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
        <div>
          <i className="fas fa-wind mr-1" />
          14 km/h
        </div>
        <div>
          <i className="fas fa-tint mr-1" />
          68% Humidity
        </div>
        <div>
          <i className="fas fa-cloud-sun-rain mr-1" />
          UV: Moderate
        </div>
      </div>
    </div>
  );
}
