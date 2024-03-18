import { createContext, useContext, useEffect, useState } from "react";
const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitesProvider({ children }) {
  const [traveledPlaces, setTraveledPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setTraveledPlaces(data);
      } catch (error) {
        alert("Error while fetching data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCityDetail(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      alert("Error while getting city data");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCityDetail(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setTraveledPlaces((traveledPlaces) => [...traveledPlaces, data]);
    } catch (error) {
      alert("Error while creating data...");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setTraveledPlaces((traveledPlaces) =>
        traveledPlaces.filter((city) => city.id !== id)
      );
    } catch (error) {
      alert("Error while deleting data...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        traveledPlaces,
        isLoading,
        currentCity,
        getCityDetail,
        createCityDetail,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext used outside CitesProvider");
  return context;
}

export { CitesProvider, useCities };
