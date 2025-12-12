import React from "react";
import { type WeatherData, getWeatherIcon } from "../utils/api";
import {
  WiDaySunny,
  WiDayCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiNa,
} from "react-icons/wi";

interface ForecastProps {
  data: WeatherData;
}

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  const { daily } = data;

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const renderIcon = (code: number) => {
    const iconName = getWeatherIcon(code, 1); // Always use day icons for forecast
    const size = 32;
    const className = "text-white";
    switch (iconName) {
      case "clear-day":
      case "clear-night":
        return <WiDaySunny size={size} className={className} />;
      case "partly-cloudy-day":
      case "partly-cloudy-night":
        return <WiDayCloudy size={size} className={className} />;
      case "fog":
        return <WiFog size={size} className={className} />;
      case "rain":
        return <WiRain size={size} className={className} />;
      case "snow":
        return <WiSnow size={size} className={className} />;
      case "thunderstorm":
        return <WiThunderstorm size={size} className={className} />;
      default:
        return <WiNa size={size} className={className} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h3 className="text-xl font-semibold text-white mb-4 px-4 opacity-90">
        7-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 px-4">
        {daily.time.map((time, index) => (
          <div
            key={time}
            className="flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-sm font-medium text-white/80 mb-2">
              {getDayName(time)}
            </span>
            <div className="mb-2">{renderIcon(daily.weatherCode[index])}</div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">
                {Math.round(daily.temperatureMax[index])}°
              </span>
              <span className="text-xs text-white/60">
                {Math.round(daily.temperatureMin[index])}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
