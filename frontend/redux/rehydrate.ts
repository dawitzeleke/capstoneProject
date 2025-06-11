import { AppDispatch } from "./store";
import { getUserData } from "@/scripts/storage"; // your saveUserData/getUserData file
import { rehydrateUser } from "./userReducer/userActions";

export const rehydrateApp = async (dispatch: AppDispatch) => {
  try {
    const userData = await getUserData();

    if (userData) {
      dispatch(rehydrateUser(userData));
      console.log("Redux state rehydrated with user data.");
    } else {
      console.log("No user data found in storage.");
    }
  } catch (error) {
    console.error("Failed to rehydrate app:", error);
  }
};
