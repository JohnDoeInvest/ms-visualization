import {
    SERVICE_DESCRIPTION_LOAD_SUCCEEDED,
    SERVICE_DESCRIPTION_SEARCH_SUCCEEDED,
    SERVICE_DESCRIPTION_SELECTED
} from '../actions/serviceDescription.action';

const initialState = {
    searchedServiceDescriptions: [],
    selectedServiceDescriptions: [],
    selectedServiceDescriptionIndex: undefined,
};

export default function serviceDescriptionReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SERVICE_DESCRIPTION_SEARCH_SUCCEEDED: 
            return {...state, searchedServiceDescriptions: payload.searchedServiceDescriptions };
        case SERVICE_DESCRIPTION_LOAD_SUCCEEDED:
            return {...state, selectedServiceDescriptions: payload.selectedServiceDescriptions };
        case SERVICE_DESCRIPTION_SELECTED:
            return { ...state, selectedServiceDescriptionIndex: payload.selectedServiceDescriptionIndex };
        default: return state;
    }
}