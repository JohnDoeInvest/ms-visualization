import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'preact-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/root.reducer';
import Home from '../routes/home';
import rootSaga from '../sagas/root.saga';

import LoaderContainer from './loader';
import ErrorContainer from './error';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, createLogger()));
sagaMiddleware.run(rootSaga);

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<Provider store={store}>
				<div id="app">
					<Router onChange={this.handleRoute}>
						<Home path="/" />
					</Router>
					<LoaderContainer />
					{/* <ErrorContainer /> */}
				</div>
			</Provider>
		);
	}
}
