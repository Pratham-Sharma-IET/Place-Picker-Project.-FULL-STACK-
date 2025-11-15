import Places from "./Places.jsx";
import fetchPlaces from "../http.js";
import useFetch from "../hooks/usefetch.js";
export default function AvailablePlaces({ onSelectPlace }) {
  // here was the code for fetching the places which is now moved to http.js
  // const places = fetchPlaces();

  const { data: places, isLoading } = useFetch(
    "http://localhost:3000",
    "places"
  );

  return (
    <Places
      title="Available Places"
      places={places}
      loadingText="Loading places..."
      onLoading={isLoading}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
