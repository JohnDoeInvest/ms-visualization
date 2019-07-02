import { combineReducers } from 'redux'
import ui from './ui.reducer'
import serviceDescription from './serviceDescription.reducer'

export default combineReducers({
  ui,
  serviceDescription
})
