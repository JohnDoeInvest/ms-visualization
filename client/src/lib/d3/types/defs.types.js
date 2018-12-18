/* eslint-disable */
const defs = [
    {
        name: 'arrowMarker',
        path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z',
        viewbox: '-5 -5 10 10',
    }
]

export function getDefWithId(name) {
    const def = defs.find(d => d.name === name);
    return def || null;
}
