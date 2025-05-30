// src/store.js
import { legacy_createStore as createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { teachersReducer } from './redux/teachersReducer'
import { statsReducer } from './redux/statsReducer'

// 1️⃣ Auth reducer - for user persistence only
const initialAuthState = {
  authenticatedUser: null,
}

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return { ...state, authenticatedUser: action.payload }
    case 'LOGOUT':
      return { ...state, authenticatedUser: null }
    default:
      return state
  }
}

// 2️⃣ App reducer - UI-related state
const initialAppState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const changeState = (state = initialAppState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

// 3️⃣ Combine reducers
const rootReducer = combineReducers({
  app: changeState,
  teachers: teachersReducer,
  auth: authReducer, // persist this only
  stats: statsReducer, // add stats reducer
})

// 4️⃣ Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // ✅ only persist auth reducer
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// 5️⃣ Store setup
const store = createStore(persistedReducer)
export const persistor = persistStore(store)
export default store
