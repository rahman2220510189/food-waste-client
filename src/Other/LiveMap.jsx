import React, { useEffect, useRef, useState } from "react";

export const LiveMap = () => {
 const mapRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("❌ API key not found in .env file");
      return;
    }

    // Google Maps script dynamically load
    const existingScript = document.getElementById("google-maps");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 23.8103, lng: 90.4125 }, // Dhaka
          zoom: 12,
        });

        new window.google.maps.Marker({
          position: { lat: 23.8103, lng: 90.4125 },
          map,
          title: "Dhaka, Bangladesh",
        });
      } else {
        setError("⚠️ Google Maps not loaded properly!");
      }
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div ref={mapRef} style={{ width: "90%", height: "500px", borderRadius: "10px" }}></div>
    </div>
  );
};

