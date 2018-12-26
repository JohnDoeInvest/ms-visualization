import { all } from 'redux-saga/effects';
import watchFetchAndSearchServiceDescription from './serviceDescription.saga';

export default function* rootSaga() {
    yield all([
        watchFetchAndSearchServiceDescription(),
    ]);
}