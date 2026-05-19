import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer, { getTotals } from "./reducer/CartReducer";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  carts: cartReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

store.dispatch(getTotals());

export type RootState = ReturnType<typeof store.getState>;