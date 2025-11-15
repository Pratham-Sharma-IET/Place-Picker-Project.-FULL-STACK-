import Places from "./Places.jsx";
import fetchplaces from "../http.js";
import { useState } from "react";
export default function AvailablePlaces({ onSelectPlace }) {
  const [isloading, setIsLoading] = useState(true);
  // here was the code for fetching the places which is now moved to http.js
  // using the custom hook to get the places
  const places = fetchplaces(setIsLoading);

  return (
    <Places
      title="Available Places"
      places={places}
      loadingText="Loading places..."
      onLoading={isloading}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
