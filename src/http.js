import { useEffect, useState } from "react";

export default function fetchPlaces() {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetchplaces() {
      const response = await fetch("http://localhost:3000/places");
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Could not fetch places.");
      }
      setAvailablePlaces(data.places);
    }
    fetchplaces();
  }, []);
  return availablePlaces;
}

export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    // this is a PUT request
    method: "PUT",
    body: JSON.stringify({ places: places }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not update user places.");
  }

  return data.message;
}

export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:3000/user-places", {
    // this is a GET request
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Could not fetch user places.");
  }
  return data.places;
}
