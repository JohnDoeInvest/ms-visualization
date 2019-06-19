import * as d3 from 'd3';

const EventNames = {
    Collapsable: 'Collapsable'
}

const collapsableDispatch = d3.dispatch([EventNames.Collapsable]);

const EventManager = {
    dispatch: collapsableDispatch
};

Object.freeze(EventManager);

export { EventManager, EventNames };

export default EventManager;