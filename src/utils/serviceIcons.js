import { SERVICE_ICON_LIST } from "./serviceIconList";
import { LuInfo } from "react-icons/lu";

export const getServiceIcon = (key = "") => {
  const found = SERVICE_ICON_LIST.find((i) => i.key === key.toLowerCase());
  return found?.Icon || LuInfo;
};
