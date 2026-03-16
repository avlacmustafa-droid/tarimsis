"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeatherAlert {
  type: "danger" | "warning" | "info";
  title: string;
  message: string;
}

interface WeatherData {
  location: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
  };
  daily: {
    date: string;
    temp_min: number;
    temp_max: number;
    description: string;
    icon: string;
  }[];
  alerts: WeatherAlert[];
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      setError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
          );
          if (res.ok) {
            setWeather(await res.json());
          } else {
            setError(true);
          }
        } catch {
          setError(true);
        }
        setLoading(false);
      },
      () => {
        fetch(`/api/weather?lat=39.92&lon=32.85`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((data) => setWeather(data))
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      },
    );
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow-sm">
              <CloudSun className="h-4 w-4 text-white" />
            </div>
            Hava Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow-sm">
              <CloudSun className="h-4 w-4 text-white" />
            </div>
            Hava Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-10">
            <CloudSun className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Hava durumu yüklenemedi
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, daily, alerts } = weather;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow-sm">
              <CloudSun className="h-4 w-4 text-white" />
            </div>
            Hava Durumu
          </CardTitle>
          <Link href="/dashboard/weather">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
              Detay
              <ArrowRight size={12} className="ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ana hava durumu */}
        <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 dark:from-sky-950/20 dark:to-blue-950/20">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.description}
            className="h-16 w-16 drop-shadow-sm"
          />
          <div className="flex-1">
            <p className="text-4xl font-bold tracking-tight">{current.temp}°C</p>
            <p className="mt-0.5 text-sm capitalize text-muted-foreground">
              {current.description}
            </p>
          </div>
        </div>

        {/* Detay bilgiler */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-2.5">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-muted-foreground">Hissedilen</span>
            <span className="text-sm font-semibold">{current.feels_like}°C</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-2.5">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Nem</span>
            <span className="text-sm font-semibold">%{current.humidity}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-2.5">
            <Wind className="h-4 w-4 text-teal-500" />
            <span className="text-xs text-muted-foreground">Rüzgar</span>
            <span className="text-sm font-semibold">{current.wind_speed} km/s</span>
          </div>
        </div>

        {/* 3 günlük mini tahmin */}
        {daily.length > 0 && (
          <div className="flex gap-2">
            {daily.slice(0, 3).map((d) => (
              <div
                key={d.date}
                className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-border/40 bg-card p-2.5"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {new Date(d.date).toLocaleDateString("tr-TR", {
                    weekday: "short",
                  })}
                </span>
                <img
                  src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                  alt={d.description}
                  className="h-8 w-8"
                />
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-semibold">{d.temp_max}°</span>
                  <span className="text-muted-foreground">{d.temp_min}°</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uyarılar */}
        {alerts.length > 0 && (
          <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
            {alerts.filter(a => a.type !== "info").slice(0, 2).map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 text-xs ${a.type === "danger" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{a.title}: {a.message}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
