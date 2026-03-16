import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY tanımlı değil" },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat ve lon parametreleri gerekli" },
      { status: 400 },
    );
  }

  // Anlık hava + 5 günlük tahmin (ücretsiz API)
  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEY}`,
      { next: { revalidate: 1800 } },
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEY}`,
      { next: { revalidate: 1800 } },
    ),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    const errText = await currentRes.text();
    return NextResponse.json(
      { error: `Hava durumu alınamadı: ${errText}` },
      { status: 502 },
    );
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  const location = currentData.name ?? "Bilinmeyen Konum";

  const current = {
    temp: Math.round(currentData.main.temp),
    feels_like: Math.round(currentData.main.feels_like),
    humidity: currentData.main.humidity,
    wind_speed: Math.round(currentData.wind.speed * 3.6),
    pressure: currentData.main.pressure,
    visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : null,
    clouds: currentData.clouds?.all ?? 0,
    sunrise: currentData.sys?.sunrise
      ? new Date(currentData.sys.sunrise * 1000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      : null,
    sunset: currentData.sys?.sunset
      ? new Date(currentData.sys.sunset * 1000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      : null,
    description: currentData.weather[0]?.description ?? "",
    icon: currentData.weather[0]?.icon ?? "01d",
  };

  // Saatlik tahmin (sonraki 24 saat / 8 kayıt)
  const hourly = forecastData.list.slice(0, 8).map((item: Record<string, unknown>) => ({
    time: (item.dt_txt as string).split(" ")[1]?.slice(0, 5),
    temp: Math.round((item.main as Record<string, number>).temp),
    icon: ((item.weather as Record<string, string>[])[0]?.icon ?? "01d"),
    pop: Math.round(((item.pop as number) ?? 0) * 100),
    description: ((item.weather as Record<string, string>[])[0]?.description ?? ""),
  }));

  // 5 günlük tahmini günlük gruplara ayır
  const dailyMap = new Map<
    string,
    { temps: number[]; humidity: number[]; wind: number[]; weather: { description: string; icon: string }; pop: number }
  >();

  for (const item of forecastData.list) {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [],
        humidity: [],
        wind: [],
        weather: {
          description: item.weather[0]?.description ?? "",
          icon: item.weather[0]?.icon ?? "01d",
        },
        pop: 0,
      });
    }
    const day = dailyMap.get(date)!;
    day.temps.push(item.main.temp);
    day.humidity.push(item.main.humidity);
    day.wind.push(item.wind.speed);
    if (item.pop > day.pop) day.pop = item.pop;
  }

  const daily = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([date, d]) => ({
      date,
      temp_min: Math.round(Math.min(...d.temps)),
      temp_max: Math.round(Math.max(...d.temps)),
      humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
      wind_speed: Math.round(Math.max(...d.wind) * 3.6),
      description: d.weather.description,
      icon: d.weather.icon,
      pop: Math.round(d.pop * 100),
    }));

  // Tarımsal uyarılar
  const alerts: { type: "danger" | "warning" | "info"; title: string; message: string }[] = [];
  const todayForecast = daily[0];

  if (todayForecast) {
    if (todayForecast.temp_min <= 0) {
      alerts.push({ type: "danger", title: "Don Tehlikesi", message: "Gece sıcaklığı 0°C altına düşebilir. Hassas bitkileri koruma altına alın." });
    } else if (todayForecast.temp_min <= 4) {
      alerts.push({ type: "warning", title: "Don Riski", message: `Gece sıcaklığı ${todayForecast.temp_min}°C'ye düşebilir. Fidelere dikkat edin.` });
    }
    if (todayForecast.wind_speed > 50) {
      alerts.push({ type: "danger", title: "Fırtına Uyarısı", message: "Rüzgar hızı 50 km/s üzerinde. Sera ve örtüleri kontrol edin." });
    } else if (todayForecast.wind_speed > 30) {
      alerts.push({ type: "warning", title: "Kuvvetli Rüzgar", message: "İlaçlama için uygun değil. Rüzgar hızı yüksek." });
    }
    if (todayForecast.pop > 70) {
      alerts.push({ type: "warning", title: "Yüksek Yağış Olasılığı", message: "İlaçlama önerilmez. Hasat planınızı gözden geçirin." });
    }
    if (todayForecast.humidity > 85) {
      alerts.push({ type: "warning", title: "Yüksek Nem", message: "Mantar ve küf hastalıklarına karşı dikkatli olun." });
    }
    if (current.temp > 35) {
      alerts.push({ type: "danger", title: "Aşırı Sıcak", message: "Sıcaklık 35°C üzerinde. Sulama sıklığını artırın." });
    }
    if (todayForecast.pop < 10 && todayForecast.wind_speed < 15 && todayForecast.humidity < 70) {
      alerts.push({ type: "info", title: "İlaçlama İçin Uygun", message: "Hava koşulları ilaçlama için ideal. Sabah erken saatleri tercih edin." });
    }
  }

  // Önümüzdeki günler için ek uyarılar
  for (let i = 1; i < Math.min(daily.length, 4); i++) {
    const d = daily[i];
    if (d.temp_min <= 0) {
      const dayName = new Date(d.date).toLocaleDateString("tr-TR", { weekday: "long" });
      alerts.push({ type: "warning", title: `${dayName} Don Riski`, message: `${dayName} günü sıcaklık ${d.temp_min}°C'ye düşebilir.` });
    }
  }

  return NextResponse.json({ location, current, hourly, daily, alerts });
}
