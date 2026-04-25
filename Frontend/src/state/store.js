import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { useDispatch ,useSelector } from "react-redux";
import lookupReducer from "./features/lookupSlice"
import searchReducer from "./features/searchSlice"
import globalSearchReducer from "./features/globalSearchSlice";
import mapReducer from "./features/mapSlice";
import fhirReducer from "./features/fhirSlice";


const rootReducer = combineReducers({
    lookup:lookupReducer,
    search:searchReducer,
    globalSearch: globalSearchReducer,
     map: mapReducer, 
     fhir: fhirReducer,
}) 

const store = configureStore({
    reducer: rootReducer,
})

export const useAppDispatch = () => useDispatch();

// pass-through wrapper (correct)
export const useAppSelector = useSelector;

export default store;