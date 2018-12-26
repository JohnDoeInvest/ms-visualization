import { FETCH_REQUESTED, FETCH_FAILED, FETCH_SUCCEEDED } from '../actions/fetch.action';
import { SERVICE_DESCRIPTION_SEARCH_REQUESTED, SERVICE_DESCRIPTION_SEARCH_SUCCEEDED } from '../actions/serviceDescription.action';

const initialState = {
    isFetching: false,
    error: null,
};

export default function uiReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REQUESTED:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case FETCH_SUCCEEDED:
            return {
                ...state,
                isFetching: false,
                error: null
            };
        case FETCH_FAILED:
            return {
                ...state,
                isFetching: false,
                error: payload.error,
            }
        case SERVICE_DESCRIPTION_SEARCH_REQUESTED:
            return {
                ...state,
                isSearching: true,
            };
        case SERVICE_DESCRIPTION_SEARCH_SUCCEEDED:
            return {
                ...state,
                isSearching: false,
            };
        default:
            return state;
    }
}