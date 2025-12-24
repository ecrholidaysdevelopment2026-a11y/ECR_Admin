import { AMENITY_ICON_LIST } from "./amenityIconList";
import { LuInfo } from "react-icons/lu";

export const getAmenityIcon = (key = "") => {
  const found = AMENITY_ICON_LIST.find((i) => i.key === key.toLowerCase());
  return found ? found.Icon : LuInfo;
};
