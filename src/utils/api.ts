
export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
    isDay: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}

export const searchCities = async (query: string): Promise<City[]> => {
  if (query.length < 2) return [];
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await response.json();

    // Open-Meteo current_weather doesn't include humidity directly in the same object usually,
    // but we can get it from hourly[0] or similar if we match time.
    // For simplicity, let's grab the current hour's humidity.
    const currentHourIndex = new Date().getHours();
    const humidity = data.hourly.relativehumidity_2m[currentHourIndex] || 0;
    const isDay = data.hourly.is_day[currentHourIndex] ?? 1;

    return {
      current: {
        temperature: data.current_weather.temperature,
        weatherCode: data.current_weather.weathercode,
        windSpeed: data.current_weather.windspeed,
        humidity: humidity,
        isDay: isDay,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weathercode,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
      },
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export const getWeatherIcon = (code: number, isDay: number = 1): string => {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog and depositing rime fog
  // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
  // 56, 57: Freezing Drizzle: Light and dense intensity
  // 61, 63, 65: Rain: Slight, moderate and heavy intensity
  // 66, 67: Freezing Rain: Light and heavy intensity
  // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
  // 77: Snow grains
  // 80, 81, 82: Rain showers: Slight, moderate, and violent
  // 85, 86: Snow showers slight and heavy
  // 95: Thunderstorm: Slight or moderate
  // 96, 99: Thunderstorm with slight and heavy hail

  // Mapping to simple icon names or emojis for now, can be replaced with React Icons later
  // We will return a string identifier that the component can use to render an icon
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  if ([1, 2, 3].includes(code)) return isDay ? "partly-cloudy-day" : "partly-cloudy-night";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "unknown";
};
