import { useRef, useState, useCallback } from "react";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces } from "./http.js";
import useFetch from "./hooks/usefetch.js";

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // using the custom useFetch hook to get user places
  const {
    data: fetchedPlaces,
    setData: setUserPlaces,
    error,
    isLoading,
  } = useFetch("http://localhost:3000", "user-places", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // optimistic updating approach
  // update the UI first and then update the server
  // if the server update fails, revert the UI update
  async function handleSelectPlace(selectedPlace) {
    console.log("UI updated - place added");
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces([selectedPlace, ...fetchedPlaces]);
      console.log("Server updated - place added");
    } catch (error) {
      console.error("Failed to update user places:", error);
      setUserPlaces(fetchedPlaces);
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      console.log("UI updated - Place deleted");
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      const { error } = useFetch("http://localhost:3000", "user-places", {
        method: "PUT",
        body: JSON.stringify({ places: fetchedPlaces }),
        headers: {
          "Content-type": "application/json",
        },
      });

      console.log(error);
      // try {
      //   await updateUserPlaces(
      //     fetchedPlaces.filter((place) => place.id !== selectedPlace.current.id)
      //   );
      //   console.log("Server updated - place deleted");
      // } catch (error) {
      //   console.error("Failed to update user places:", error);
      // }
      setModalIsOpen(false);
    },
    [selectedPlace, fetchedPlaces]
  );

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>

      <main>
        {isLoading && <p className="fallback-text">Loading places...</p>}
        {error && (
          <p className="fallback-text">Error loading places: {error.message}</p>
        )}
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={fetchedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
