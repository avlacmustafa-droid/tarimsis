"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  MapPin,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  RefreshCw,
  Sprout,
  ShieldAlert,
  Info,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  visibility: number | null;
  clouds: number;
  sunrise: string | null;
  sunset: string | null;
  description: string;
  icon: string;
}

interface HourlyWeather {
  time: string;
  temp: number;
  icon: string;
  pop: number;
  description: string;
}

interface DailyWeather {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  pop: number;
}

interface WeatherAlert {
  type: "danger" | "warning" | "info";
  title: string;
  message: string;
}

interface WeatherData {
  location: string;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
}

function weatherIconUrl(icon: string, size: "2x" | "4x" = "2x") {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

function getAlertStyle(type: WeatherAlert["type"]) {
  switch (type) {
    case "danger":
      return {
        border: "border-red-200 dark:border-red-900",
        bg: "bg-red-50 dark:bg-red-950/30",
        icon: "text-red-600 dark:text-red-400",
        title: "text-red-800 dark:text-red-300",
        text: "text-red-700 dark:text-red-400",
        IconComp: ShieldAlert,
      };
    case "warning":
      return {
        border: "border-amber-200 dark:border-amber-900",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        icon: "text-amber-600 dark:text-amber-400",
        title: "text-amber-800 dark:text-amber-300",
        text: "text-amber-700 dark:text-amber-400",
        IconComp: AlertTriangle,
      };
    case "info":
      return {
        border: "border-green-200 dark:border-green-900",
        bg: "bg-green-50 dark:bg-green-950/30",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-800 dark:text-green-300",
        text: "text-green-700 dark:text-green-400",
        IconComp: Info,
      };
  }
}

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Hava durumu alınamadı");
    }

    setData(json);
    setLastUpdated(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  const loadWeather = useCallback(
    (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setError("Tarayıcınız konum desteği sunmuyor");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await fetchWeather(pos.coords.latitude, pos.coords.longitude);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Hava durumu alınamadı");
          }
          setLoading(false);
          setRefreshing(false);
        },
        () => {
          // Konum izni reddedilirse Ankara varsayılan
          fetchWeather(39.92, 32.85)
            .catch((e) =>
              setError(e instanceof Error ? e.message : "Hava durumu alınamadı"),
            )
            .finally(() => {
              setLoading(false);
              setRefreshing(false);
            });
        },
      );
    },
    [fetchWeather],
  );

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Hava Durumu</h1>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-muted-foreground">
          <CloudSun className="mb-3 h-12 w-12 animate-pulse text-sky-500" />
          <p className="text-sm">Hava durumu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Hava Durumu</h1>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-muted-foreground">
          <MapPin className="mb-3 h-12 w-12" />
          <p className="text-sm">{error || "Veri alınamadı"}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => loadWeather()}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  const { location, current, hourly, daily, alerts } = data;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hava Durumu</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {location}
            {lastUpdated && (
              <span className="ml-2 text-xs">
                (Son güncelleme: {lastUpdated})
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadWeather(true)}
          disabled={refreshing}
          className="gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

      {/* Tarımsal Uyarılar */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sprout className="h-4 w-4 text-green-600" />
            Tarımsal Uyarılar
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {alerts.map((alert, i) => {
              const style = getAlertStyle(alert.type);
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 ${style.border} ${style.bg}`}
                >
                  <style.IconComp className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${style.icon}`} />
                  <div>
                    <p className={`text-sm font-semibold ${style.title}`}>{alert.title}</p>
                    <p className={`mt-0.5 text-xs ${style.text}`}>{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Anlık Hava Durumu */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white dark:from-sky-700 dark:to-blue-800">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={weatherIconUrl(current.icon, "4x")}
                alt={current.description}
                className="h-24 w-24 drop-shadow-lg"
              />
              <div>
                <p className="text-5xl font-bold tracking-tight">{current.temp}°C</p>
                <p className="mt-1 text-lg capitalize text-white/80">
                  {current.description}
                </p>
                <p className="text-sm text-white/60">
                  Hissedilen: {current.feels_like}°C
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Droplets className="h-4 w-4" />
                <span>Nem: %{current.humidity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Wind className="h-4 w-4" />
                <span>Rüzgar: {current.wind_speed} km/s</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Gauge className="h-4 w-4" />
                <span>Basınç: {current.pressure} hPa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Cloud className="h-4 w-4" />
                <span>Bulut: %{current.clouds}</span>
              </div>
              {current.visibility !== null && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Eye className="h-4 w-4" />
                  <span>Görüş: {current.visibility} km</span>
                </div>
              )}
              {current.sunrise && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Sunrise className="h-4 w-4" />
                  <span>Gündoğumu: {current.sunrise}</span>
                </div>
              )}
              {current.sunset && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Sunset className="h-4 w-4" />
                  <span>Günbatımı: {current.sunset}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Saatlik Tahmin */}
      {hourly.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock className="h-4 w-4 text-sky-500" />
              Saatlik Tahmin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hourly.map((h, i) => (
                <div
                  key={i}
                  className="flex min-w-[72px] flex-col items-center gap-1 rounded-xl border border-border/40 bg-muted/30 p-3"
                >
                  <span className="text-xs font-medium text-muted-foreground">{h.time}</span>
                  <img
                    src={weatherIconUrl(h.icon)}
                    alt={h.description}
                    className="h-8 w-8"
                  />
                  <span className="text-sm font-semibold">{h.temp}°</span>
                  {h.pop > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-500">
                      <Droplets className="h-2.5 w-2.5" />%{h.pop}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5 Günlük Tahmin */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CloudSun className="h-4 w-4 text-sky-500" />
            {daily.length} Günlük Tahmin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {daily.map((day) => {
              const dayName = new Date(day.date).toLocaleDateString("tr-TR", {
                weekday: "long",
              });
              const dayDate = new Date(day.date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              });
              // Sıcaklık bar genişliği (0-40 arası normalleştirilmiş)
              const minPos = Math.max(0, ((day.temp_min + 10) / 50) * 100);
              const maxPos = Math.max(0, ((day.temp_max + 10) / 50) * 100);
              const barLeft = Math.min(minPos, maxPos);
              const barWidth = Math.max(maxPos - minPos, 4);

              return (
                <div
                  key={day.date}
                  className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/40"
                >
                  {/* Gün */}
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-medium capitalize">{dayName}</p>
                    <p className="text-xs text-muted-foreground">{dayDate}</p>
                  </div>

                  {/* İkon & Durum */}
                  <div className="flex w-28 shrink-0 items-center gap-2">
                    <img
                      src={weatherIconUrl(day.icon)}
                      alt={day.description}
                      className="h-8 w-8"
                    />
                    <span className="truncate text-xs capitalize text-muted-foreground">
                      {day.description}
                    </span>
                  </div>

                  {/* Sıcaklık min */}
                  <span className="w-8 shrink-0 text-right text-sm text-muted-foreground">
                    {day.temp_min}°
                  </span>

                  {/* Sıcaklık barı */}
                  <div className="relative hidden h-2 flex-1 rounded-full bg-muted/60 sm:block">
                    <div
                      className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                      style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Sıcaklık max */}
                  <span className="w-8 shrink-0 text-sm font-semibold">
                    {day.temp_max}°
                  </span>

                  {/* Nem & Rüzgar & Yağış */}
                  <div className="hidden items-center gap-3 lg:flex">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="h-3 w-3 text-blue-500" />%{day.humidity}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Wind className="h-3 w-3 text-teal-500" />{day.wind_speed}
                    </span>
                    {day.pop > 0 && (
                      <span className="flex items-center gap-1 text-xs text-blue-500">
                        <Droplets className="h-3 w-3" />%{day.pop}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tarımsal Bilgi Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                <Droplets className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sulama Önerisi</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {current.humidity > 70
                    ? "Nem seviyesi yüksek. Sulama ihtiyacı düşük."
                    : current.humidity > 40
                      ? "Normal nem seviyesi. Düzenli sulama programına devam edin."
                      : "Düşük nem. Sulama sıklığını artırmanız önerilir."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <Sprout className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">İlaçlama Durumu</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {current.wind_speed > 30
                    ? "Rüzgar çok kuvvetli. İlaçlama yapılmamalı."
                    : current.wind_speed > 15
                      ? "Hafif rüzgar var. İlaçlama dikkatli yapılmalı."
                      : daily[0]?.pop > 60
                        ? "Yağış bekleniyor. İlaçlama ertelenmeli."
                        : "Hava koşulları ilaçlama için uygun."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <Thermometer className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sıcaklık Değerlendirmesi</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {current.temp > 35
                    ? "Aşırı sıcak. Gölgeleme ve sulama kritik öneme sahip."
                    : current.temp > 25
                      ? "Sıcak hava. Bitkilerin su ihtiyacı artabilir."
                      : current.temp > 10
                        ? "Ilıman hava. Çoğu tarımsal faaliyet için uygun."
                        : current.temp > 0
                          ? "Serin hava. Soğuğa hassas bitkilere dikkat."
                          : "Don tehlikesi! Bitkileri koruma altına alın."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
