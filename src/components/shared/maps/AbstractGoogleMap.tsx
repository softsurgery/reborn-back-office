"use client";

import React from "react";
import { Search, AlertCircle, Loader2, Navigation, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google: any;
    __googleMapsLoadingPromise?: Promise<void>;
  }
}

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 };

export interface AbstractGoogleMapProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  marker?: { lat: number; lng: number } | null;
  onMarkerChange?: (coord: { lat: number; lng: number }) => void;
  onMapClick?: (coord: { lat: number; lng: number }) => void;
  className?: string;
  height?: string | number;
  interactive?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  fallbackMessage?: string;
  onClear?: () => void;
  showClear?: boolean;
}

export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Google Maps on server side"));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve();
  }

  if (window.__googleMapsLoadingPromise) {
    return window.__googleMapsLoadingPromise;
  }

  window.__googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const callbackName = `__googleMapsCallback_${Date.now()}`;
    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      resolve();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      window.__googleMapsLoadingPromise = undefined;
      delete (window as any)[callbackName];
      reject(new Error("Failed to load Google Maps API script"));
    };

    document.head.appendChild(script);
  });

  return window.__googleMapsLoadingPromise;
};

export const AbstractGoogleMap: React.FC<AbstractGoogleMapProps> = ({
  apiKey: propApiKey,
  center = DEFAULT_CENTER,
  zoom = 13,
  marker = null,
  onMarkerChange,
  onMapClick,
  className,
  height = "800px",
  interactive = true,
  showSearch = true,
  searchPlaceholder = "Search address or place...",
  fallbackMessage,
  onClear,
  showClear = false,
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);

  const isFlex = height === "flex-1";
  const isFullscreen = height === "fullscreen";

  const resolvedHeight =
    typeof height === "number"
      ? `${height}px`
      : height && !isNaN(Number(height))
        ? `${height}px`
        : isFlex || isFullscreen
          ? undefined
          : height || "800px";

  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markerInstanceRef = React.useRef<any>(null);
  const autocompleteRef = React.useRef<any>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = React.useState<boolean>(false);

  const effectiveApiKey =
    propApiKey ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ||
    "";

  // Check if API key is present and initialize
  React.useEffect(() => {
    if (!effectiveApiKey) {
      setIsApiKeyMissing(true);
      return;
    }

    setIsApiKeyMissing(false);
    setIsLoading(true);
    setError(null);

    loadGoogleMapsScript(effectiveApiKey)
      .then(() => {
        setIsLoading(false);
        initMap();
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || "Failed to initialize Google Maps");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveApiKey]);

  // Initialize or re-initialize map
  const initMap = React.useCallback(() => {
    if (!mapContainerRef.current || !window.google || !window.google.maps) {
      return;
    }

    const hasValidMarker =
      marker &&
      marker.lat !== undefined &&
      marker.lng !== undefined &&
      marker.lat !== null &&
      marker.lng !== null &&
      !isNaN(marker.lat) &&
      !isNaN(marker.lng);

    const initialCenter = hasValidMarker
      ? { lat: marker.lat, lng: marker.lng }
      : center;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(
        mapContainerRef.current,
        {
          center: initialCenter,
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: interactive ? "auto" : "none",
        },
      );

      if (interactive && onMapClick) {
        mapInstanceRef.current.addListener("click", (e: any) => {
          if (e.latLng) {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            onMapClick({ lat: newLat, lng: newLng });
          }
        });
      }
    } else {
      window.google.maps.event.trigger(mapInstanceRef.current, "resize");
      mapInstanceRef.current.setCenter(initialCenter);
      mapInstanceRef.current.setZoom(zoom);
    }

    // Initialize search autocomplete
    if (
      showSearch &&
      searchInputRef.current &&
      interactive &&
      !autocompleteRef.current &&
      window.google.maps.places
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        { fields: ["geometry", "name", "formatted_address"] },
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const newLat = place.geometry.location.lat();
          const newLng = place.geometry.location.lng();

          mapInstanceRef.current.setCenter({ lat: newLat, lng: newLng });
          mapInstanceRef.current.setZoom(16);

          if (onMarkerChange) {
            onMarkerChange({ lat: newLat, lng: newLng });
          } else if (onMapClick) {
            onMapClick({ lat: newLat, lng: newLng });
          }
        }
      });
    }

    updateMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    center,
    zoom,
    marker,
    interactive,
    onMapClick,
    onMarkerChange,
    showSearch,
  ]);

  // Update marker when coordinates change
  const updateMarker = React.useCallback(() => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) {
      return;
    }

    if (
      marker &&
      marker.lat !== undefined &&
      marker.lng !== undefined &&
      marker.lat !== null &&
      marker.lng !== null &&
      !isNaN(marker.lat) &&
      !isNaN(marker.lng)
    ) {
      const position = { lat: marker.lat, lng: marker.lng };

      if (!markerInstanceRef.current) {
        markerInstanceRef.current = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          draggable: interactive && Boolean(onMarkerChange),
          animation: window.google.maps.Animation.DROP,
        });

        if (interactive && onMarkerChange) {
          markerInstanceRef.current.addListener("dragend", (e: any) => {
            if (e.latLng) {
              const draggedLat = e.latLng.lat();
              const draggedLng = e.latLng.lng();
              onMarkerChange({ lat: draggedLat, lng: draggedLng });
            }
          });
        }
      } else {
        markerInstanceRef.current.setPosition(position);
        markerInstanceRef.current.setMap(mapInstanceRef.current);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(position);
      }
    } else if (markerInstanceRef.current) {
      markerInstanceRef.current.setMap(null);
      markerInstanceRef.current = null;
    }
  }, [marker, interactive, onMarkerChange]);

  React.useEffect(() => {
    if (window.google && window.google.maps && mapInstanceRef.current) {
      updateMarker();
    }
  }, [marker, updateMarker]);

  // ResizeObserver to prevent map/pin distortion when container resizes, expands (flex-1), or becomes visible in a modal/stepper tab
  React.useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current && window.google && window.google.maps) {
        const hasValidMarker =
          marker &&
          marker.lat !== undefined &&
          marker.lng !== undefined &&
          marker.lat !== null &&
          marker.lng !== null &&
          !isNaN(marker.lat) &&
          !isNaN(marker.lng);

        const currentCenter = hasValidMarker
          ? { lat: marker.lat, lng: marker.lng }
          : center;

        window.google.maps.event.trigger(mapInstanceRef.current, "resize");
        mapInstanceRef.current.setCenter(currentCenter);
      }
    });

    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [marker, center]);

  const handleCurrentLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          if (mapInstanceRef.current && window.google) {
            mapInstanceRef.current.setCenter({ lat: newLat, lng: newLng });
            mapInstanceRef.current.setZoom(16);
          }
          if (onMarkerChange) {
            onMarkerChange({ lat: newLat, lng: newLng });
          } else if (onMapClick) {
            onMapClick({ lat: newLat, lng: newLng });
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
      );
    }
  };

  if (isApiKeyMissing) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl border-2 border-dashed border-border/80 bg-card/60 flex flex-col items-center justify-center p-8 text-center space-y-3",
          isFlex || isFullscreen ? "flex-1 min-h-0 h-full" : "",
          className,
        )}
        style={
          isFlex || isFullscreen ? undefined : { minHeight: resolvedHeight }
        }
      >
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-base text-foreground">
          Google Maps API Key Required
        </h3>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          {fallbackMessage ||
            "Please provide NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file to enable the interactive map picker."}
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-[11px] font-mono font-medium text-muted-foreground">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-3",
        (isFlex || isFullscreen) && "flex-1 min-h-0 h-full",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden border border-border shadow-md bg-muted/40",
          isFlex || isFullscreen ? "flex-1 min-h-0 h-full" : "",
        )}
        style={isFlex || isFullscreen ? undefined : { height: resolvedHeight }}
      >
        {(showSearch && interactive) || (showClear && onClear) ? (
          <div className="absolute top-3 left-3 z-10 flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-[calc(100%-3.5rem)] pointer-events-none">
            {showSearch && interactive && (
              <>
                <div className="relative flex-1 sm:w-80 min-w-[200px] pointer-events-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    ref={searchInputRef}
                    placeholder={searchPlaceholder}
                    className="pl-9 h-10 rounded-xl bg-background/95 backdrop-blur-md border-border/80 shadow-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCurrentLocation}
                  className="h-10 rounded-xl px-3 gap-1.5 shrink-0 bg-background/95 backdrop-blur-md border-border/80 shadow-lg hover:bg-background pointer-events-auto"
                  title="Locate me"
                >
                  <Navigation className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline">My Location</span>
                </Button>
              </>
            )}

            {showClear && onClear && (
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="h-10 rounded-xl px-3 gap-1.5 shrink-0 bg-background/95 backdrop-blur-md border-destructive/30 text-destructive shadow-lg hover:bg-destructive hover:text-destructive-foreground transition-colors pointer-events-auto"
                title="Clear location"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        ) : null}

        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">
              Loading Google Maps...
            </span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-6 text-center gap-3">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <span className="text-sm font-bold text-destructive">
              Error Loading Map
            </span>
            <span className="text-xs text-muted-foreground max-w-sm">
              {error}
            </span>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
