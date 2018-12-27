import { delay } from 'redux-saga';
import { put, takeLatest, call } from 'redux-saga/effects';
import {
    SERVICE_DESCRIPTION_FETCH_REQUESTED,
    SERVICE_DESCRIPTION_SEARCH_REQUESTED,
    SERVICE_DESCRIPTION_LOAD_CONTENT_REQUESTED,
    loadServiceDescriptionSuccess,
    searchServiceDescriptionSuccess
}  from '../actions/serviceDescription.action';
import { fetchFailed, fetchRequest, fetchSuccess } from '../actions/fetch.action';
import * as serviceAPI from '../services/serviceDescription.service';

function* fetchServiceDescription(action) {
    try {
        yield put(fetchRequest());
        const data = yield call(serviceAPI.fetchServiceDescriptionAPI, action.payload.url);
        yield put(fetchSuccess());
        yield put(loadServiceDescriptionSuccess([data]));
    } catch (error) {
        yield put(fetchFailed(error.message));
    }
}

function* searchServiceDescription(action) {
    try {
        const data = yield call(serviceAPI.searchServiceDescriptionAPI, action.payload.text);
        yield put(searchServiceDescriptionSuccess(data));
    } catch (error) {
        // yield put(fetchFailed(err.message));
    }
}

function* loadAllCodeContents(action) {
    try {
        yield put(fetchRequest());
        const data = yield call(serviceAPI.loaddAllCodeContentsAPI, action.payload.codes);
        yield put(fetchSuccess());
        yield put(loadServiceDescriptionSuccess(data));
        yield put(searchServiceDescriptionSuccess([]));
    } catch (error) {
        yield put(fetchFailed(error.message));
    }
}

export default function* watchFetchAndSearchServiceDescription() {
    yield takeLatest(SERVICE_DESCRIPTION_FETCH_REQUESTED, fetchServiceDescription);
    yield takeLatest(SERVICE_DESCRIPTION_SEARCH_REQUESTED, searchServiceDescription);
    yield takeLatest(SERVICE_DESCRIPTION_LOAD_CONTENT_REQUESTED, loadAllCodeContents);
}