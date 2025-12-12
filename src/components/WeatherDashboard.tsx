import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import { getWeather, type WeatherData, type City } from "../utils/api";
import sunriseBg from "../assets/sunrise.png";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("London");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      if (data) {
        setWeatherData(data);
        setCity(cityName);
      } else {
        setError("Failed to fetch weather data.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(51.5074, -0.1278, "London");
  }, []);

  const handleCitySelect = (selectedCity: City) => {
    fetchWeather(
      selectedCity.latitude,
      selectedCity.longitude,
      selectedCity.name
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="h-screen w-screen flex flex-col items-center py-6 px-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat fixed"
        style={{ backgroundImage: `url(${sunriseBg})` }}
      />

      {/* Overlay - Darker as requested */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-black/50 backdrop-blur-[3px] fixed" />

      <div className="relative z-10 w-full h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex-none flex flex-col items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            Weather<span className="font-light opacity-80">App</span>
          </h1>
          <SearchBar onCitySelect={handleCitySelect} />
        </div>

        {/* Main Content Area - Flex Grow to fill space */}
        <div className="flex-grow flex flex-col justify-center w-full overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg animate-pulse">
                Loading weather data...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-center mx-auto">
              {error}
            </div>
          )}

          {!loading && weatherData && (
            <div className="w-full h-full flex flex-col items-center justify-start gap-8 animate-fade-in overflow-y-auto p-2 scrollbar-hide">
              {/* Current Weather - Top */}
              <div className="w-full flex-none">
                <CurrentWeather data={weatherData} city={city} />
              </div>

              {/* Forecast - Bottom */}
              <div className="w-full max-w-5xl flex-none">
                <Forecast data={weatherData} />
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <footer className="flex-none mt-4 flex flex-col items-center text-white/80 pb-2">
          <p className="text-xs md:text-sm mb-2 font-light">
            &copy; {currentYear}{" "}
            <span className="font-semibold">Ponkoj Mondol</span>. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <FaFacebook size={18} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WeatherDashboard;
