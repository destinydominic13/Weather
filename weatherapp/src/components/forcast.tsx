const data = [
  { time: "12PM", temp: "29°C", icon: "fas fa-sun" },
  { time: "3PM", temp: "30°C", icon: "fas fa-cloud-sun" },
  { time: "6PM", temp: "27°C", icon: "fas fa-cloud" },
  { time: "9PM", temp: "25°C", icon: "fas fa-moon" },
];

export default function Forecast() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-sm text-gray-500">{item.time}</span>
            <i className={`${item.icon} text-2xl my-2 text-yellow-500`} />
            <span className="font-semibold">{item.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
