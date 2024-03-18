/* eslint-disable react/prop-types */
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { traveledPlaces, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!traveledPlaces?.length)
    return <Message message="Pls Start Adding City From The Map!" />;
  return (
    <ul className={styles.cityList}>
      {traveledPlaces?.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
