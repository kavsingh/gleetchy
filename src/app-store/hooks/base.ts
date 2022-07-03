import { useDispatch, useSelector, useStore } from "react-redux";

import type { TypedUseSelectorHook } from "react-redux";
import type { AppState, AppDispatch, AppStore } from "../configure-store";

export const useAppStore = () => useStore<AppStore>();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
