import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppState, AppDispatch, AppStore } from "../configure-store";
import type { TypedUseSelectorHook } from "react-redux";

export function useAppStore() {
	return useStore<AppStore>();
}

export function useAppDispatch() {
	return useDispatch<AppDispatch>();
}

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
