import { useState, useEffect } from "react";

const fetchplaces = function (setIsLoading) {
  // this state will hold the fetched places
  // when the fetching is going on this will be an empty array
  // once the fetching is done this will hold the fetched places
  const [AvailablePlaces, setAvialablePlaces] = useState([]);

  useEffect(() => {
    async function fetchplaces() {
      const response = await fetch("http://localhost:3000/places");
      const data = await response.json();
      setAvialablePlaces(data.places);
      setIsLoading(false);
    }

    fetchplaces();
  }, []);

  return AvailablePlaces;
};

export default fetchplaces;

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
