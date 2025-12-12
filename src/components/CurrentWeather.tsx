import React from "react";
import { type WeatherData, getWeatherIcon } from "../utils/api";
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiNa,
  WiStrongWind,
  WiHumidity,
} from "react-icons/wi";

interface CurrentWeatherProps {
  data: WeatherData;
  city: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, city }) => {
  const { current } = data;
  const iconName = getWeatherIcon(current.weatherCode, current.isDay);

  const renderIcon = () => {
    const size = 60; // Reduced base size
    const className = "text-white drop-shadow-lg filter font-light";
    switch (iconName) {
      case "clear-day":
        return <WiDaySunny size={size} className={className} />;
      case "clear-night":
        return <WiNightClear size={size} className={className} />;
      case "partly-cloudy-day":
        return <WiDayCloudy size={size} className={className} />;
      case "partly-cloudy-night":
        return <WiNightAltCloudy size={size} className={className} />;
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
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto p-6 md:p-8 text-white bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-xl gap-6 md:gap-10">
      
      {/* City & Icon Section */}
      <div className="relative flex flex-col items-center md:items-start mb-4 md:mb-0">
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-shadow-sm z-10 relative">
          {city}
          <div className="absolute -top-8 -right-8 md:-top-8 md:-right-10 animate-float opacity-90 rotate-15">
            {renderIcon()}
          </div>
        </h2>
        <div className="mt-2 text-sm md:text-base opacity-70 font-light tracking-wider uppercase">
          Current Weather
        </div>
      </div>

      {/* Temperature */}
      <div className="text-7xl md:text-8xl font-thin tracking-tighter leading-none">
        {Math.round(current.temperature)}°
      </div>
      
      {/* Details Section */}
      <div className="flex flex-row md:flex-row gap-6 md:gap-12 items-center">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-full mb-2 backdrop-blur-md">
            <WiStrongWind size={24} className="text-white" />
          </div>
          <span className="text-xs opacity-70 uppercase tracking-wider">Wind</span>
          <span className="text-lg font-semibold">{current.windSpeed} <span className="text-xs font-normal">km/h</span></span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-full mb-2 backdrop-blur-md">
            <WiHumidity size={24} className="text-white" />
          </div>
          <span className="text-xs opacity-70 uppercase tracking-wider">Humidity</span>
          <span className="text-lg font-semibold">{current.humidity}<span className="text-xs font-normal">%</span></span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
