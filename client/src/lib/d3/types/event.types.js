import * as d3 from 'd3'

const EventNames = {
  Collapsable: 'Collapsable',
  Highlight: 'Highlight'
}

const collapsableDispatch = d3.dispatch([EventNames.Collapsable])
const hightlightDispatch = d3.dispatch([EventNames.Highlight])

const EventManager = {
  dispatch: {
    collapse: collapsableDispatch,
    highlight: hightlightDispatch
  }
}

Object.freeze(EventManager)

export { EventManager, EventNames }

export default EventManager
