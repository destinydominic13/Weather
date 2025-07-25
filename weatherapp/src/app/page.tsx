import Forecast from "@/components/forcast";
import Header from "@/components/header";
import SmsSubscribeForm from "@/components/subscribeForm";
import WeatherCard from "@/components/weatherCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 text-gray-800 font-sans">
      <Header />

      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Weather card showing current weather */}
        <WeatherCard />

        {/* Forecast section */}
        <Forecast />

        {/* SMS subscription form */}
        <SmsSubscribeForm />
      </section>
    </main>
  );
}
