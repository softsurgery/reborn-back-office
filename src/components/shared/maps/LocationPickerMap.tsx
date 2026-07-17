"use client";

import React from "react";
import { AbstractGoogleMap } from "./AbstractGoogleMap";
import { cn } from "@/lib/utils";

export interface LocationPickerMapProps {
  latitude?: number;
  longitude?: number;
  onChange: (coord: { latitude?: number; longitude?: number }) => void;
  className?: string;
  height?: string | number;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onChange,
  className,
  height = "380px",
}) => {
  const hasCoordinates =
    latitude !== undefined &&
    longitude !== undefined &&
    latitude !== null &&
    longitude !== null &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const marker = hasCoordinates ? { lat: latitude, lng: longitude } : null;

  const handleMapCoordChange = (coord: { lat: number; lng: number }) => {
    onChange({
      latitude: Number(coord.lat.toFixed(6)),
      longitude: Number(coord.lng.toFixed(6)),
    });
  };

  const handleClear = () => {
    onChange({ latitude: undefined, longitude: undefined });
  };

  const isFlex = height === "flex-1";
  const isFullscreen = height === "fullscreen";

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-3",
        (isFlex || isFullscreen) && "flex-1 min-h-0 h-full",
        className,
      )}
    >
      <AbstractGoogleMap
        marker={marker}
        onMarkerChange={handleMapCoordChange}
        onMapClick={handleMapCoordChange}
        height={height}
        showSearch={true}
        onClear={handleClear}
        showClear={hasCoordinates}
      />
    </div>
  );
};
