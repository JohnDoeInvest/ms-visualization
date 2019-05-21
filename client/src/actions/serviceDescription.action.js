export const SERVICE_DESCRIPTION_FETCH_REQUESTED = 'SERVICE_DESCRIPTION_FETCH_REQUESTED';
export const SERVICE_DESCRIPTION_LOAD_SUCCEEDED = 'SERVICE_DESCRIPTION_LOAD_SUCCEEDED';
export const SERVICE_DESCRIPTION_SEARCH_REQUESTED = 'SERVICE_DESCRIPTION_SEARCH_REQUESTED';
export const SERVICE_DESCRIPTION_SEARCH_SUCCEEDED = 'SERVICE_DESCRIPTION_SEARCH_SUCCEEDED';
export const SERVICE_DESCRIPTION_LOAD_CONTENT_REQUESTED = 'SERVICE_DESCRIPTION_LOAD_CONTENT_REQUESTED';
export const SERVICE_DESCRIPTION_LOAD_CONTENT_SUCCEEDED = 'SERVICE_DESCRIPTION_LOAD_CONTENT_SUCCEEDED';
export const SERVICE_DESCRIPTION_SELECTED = 'SERVICE_DESCRIPTION_SELECTED';

export const fetchServiceDescriptionRequest = (url) => {
    return {
        type: SERVICE_DESCRIPTION_FETCH_REQUESTED,
        payload: { url }
    }
};

export const loadServiceDescriptionSuccess = (selectedServiceDescriptions) => ({
    type: SERVICE_DESCRIPTION_LOAD_SUCCEEDED,
    payload: { selectedServiceDescriptions }
});

export const searchServiceDescriptionRequest = ({ repo, token }) => {
    return {
        type: SERVICE_DESCRIPTION_SEARCH_REQUESTED,
        payload: { repo, token }
    }
};

export const searchServiceDescriptionSuccess = (searchedServiceDescriptions) => ({
    type: SERVICE_DESCRIPTION_SEARCH_SUCCEEDED,
    payload: { searchedServiceDescriptions }
});

export const loadAllCodeContentRequest = ({codes, token}) => {
    return {
        type: SERVICE_DESCRIPTION_LOAD_CONTENT_REQUESTED,
        payload: { codes, token }
    }
};

export const selectServiceDescription = (selectedServiceDescriptionIndex) => ({
    type: SERVICE_DESCRIPTION_SELECTED,
    payload: { selectedServiceDescriptionIndex }
})