import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

let initialState = {
  traveledPlaces: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
//useReducer expects a reducer function as its first argument and an initial state as its second argument
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, traveledPlaces: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        traveledPlaces: [...state.traveledPlaces, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        traveledPlaces: state.traveledPlaces.filter(
          (city) => city.id !== action.payload
        ),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown Action Type");
  }
}

function CitesProvider({ children }) {
  const [{ traveledPlaces, isLoading, currentCity, error }, dispatch] =
    useReducer(reducer, initialState);
  // const [traveledPlaces, setTraveledPlaces] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "Error while fetching data" });
      }
    }
    fetchCities();
  }, []);

  async function getCityDetail(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error while fetching city data" });
    }
  }

  async function createCityDetail(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error while creating city data" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error while deleting city data" });
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
        error,
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
