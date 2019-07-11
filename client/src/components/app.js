import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { Router } from 'preact-router' // eslint-disable-line no-unused-vars
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'preact-redux' // eslint-disable-line no-unused-vars
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers/root.reducer'
import Home from '../routes/home' // eslint-disable-line no-unused-vars
import rootSaga from '../sagas/root.saga'

import LoaderContainer from './loader' // eslint-disable-line no-unused-vars

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, createLogger()))
sagaMiddleware.run(rootSaga)

export default class App extends Component {
  /** Gets fired when the route changes.
   *  @param {Object} event    "change" event from [preact-router](http://git.io/preact-router)
   *  @param {string} event.url  The newly routed URL
   */
  handleRoute = (e) => {
    this.currentUrl = e.url
  };

  render () {
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
    )
  }
}
