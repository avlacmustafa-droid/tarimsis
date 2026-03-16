"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

interface FieldMapProps {
  token: string;
  initialCoordinates?: number[][][];
  onPolygonChange?: (coordinates: number[][][], areaSqm: number) => void;
  readOnly?: boolean;
  center?: [number, number];
  zoom?: number;
}

export function FieldMap({
  token,
  initialCoordinates,
  onPolygonChange,
  readOnly = false,
  center = [32.85, 39.92], // Ankara varsayılan
  zoom = 6,
}: FieldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite");

  const handleDrawChange = useCallback(() => {
    if (!draw.current || !onPolygonChange) return;
    const data = draw.current.getAll();
    if (data.features.length > 0) {
      const polygon = data.features[0];
      const coords = (polygon.geometry as GeoJSON.Polygon).coordinates;
      const area = turf.area(polygon);
      onPolygonChange(coords, area);
    } else {
      onPolygonChange([], 0);
    }
  }, [onPolygonChange]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center,
      zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (!readOnly) {
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "simple_select",
      });

      map.current.addControl(draw.current as unknown as mapboxgl.IControl);
      map.current.on("draw.create", handleDrawChange);
      map.current.on("draw.update", handleDrawChange);
      map.current.on("draw.delete", handleDrawChange);
    }

    // Başlangıç polygon'u varsa göster
    if (initialCoordinates && initialCoordinates.length > 0) {
      map.current.on("load", () => {
        if (readOnly && map.current) {
          map.current.addSource("field-polygon", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: initialCoordinates,
              },
            },
          });
          map.current.addLayer({
            id: "field-fill",
            type: "fill",
            source: "field-polygon",
            paint: {
              "fill-color": "#22c55e",
              "fill-opacity": 0.3,
            },
          });
          map.current.addLayer({
            id: "field-border",
            type: "line",
            source: "field-polygon",
            paint: {
              "line-color": "#16a34a",
              "line-width": 2,
            },
          });

          // Polygon'a zoom yap
          const bounds = turf.bbox(
            turf.polygon(initialCoordinates),
          ) as [number, number, number, number];
          map.current.fitBounds(bounds, { padding: 50 });
        } else if (draw.current) {
          draw.current.add({
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: initialCoordinates,
            },
          });
          const bounds = turf.bbox(
            turf.polygon(initialCoordinates),
          ) as [number, number, number, number];
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggleStyle = () => {
    if (!map.current) return;
    const newStyle =
      mapStyle === "satellite" ? "streets" : "satellite";
    map.current.setStyle(
      newStyle === "satellite"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/streets-v12",
    );
    setMapStyle(newStyle);
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-[500px] w-full rounded-lg" />
      <button
        onClick={toggleStyle}
        className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-md hover:bg-gray-50"
        type="button"
      >
        {mapStyle === "satellite" ? "Harita" : "Uydu"}
      </button>
    </div>
  );
}
