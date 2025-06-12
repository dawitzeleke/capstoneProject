import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistPartial } from "redux-persist/es/persistReducer";

import rootReducer from "./rootReducer";

// 🔐 persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

// ✅ create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

// 🏗️ create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// 💾 create persistor
export const persistor = persistStore(store);

// ✅ correct RootState type
export type RootState = ReturnType<typeof rootReducer> & PersistPartial;
export type AppDispatch = typeof store.dispatch;
