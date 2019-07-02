export function buildDefs () {
  let patterns = ''

  // eslint-disable-next-line func-style
  const builder = function (svg) {
    let defs = svg.select('defs')
    if (defs.empty()) {
      defs = svg.append('svg:defs')
    }

    defs.html(patterns)
  }

  builder.patterns = function (value) {
    patterns = value || patterns
    return builder
  }

  return builder
}

const arrowPattern = (id) => `
    <marker 
    id=${id}
    class="arrow"
        refX="100"
        refY="64"
        viewBox="0 0 129 129"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
  >
    <path d="m40.4,121.3c-0.8,0.8-1.8,1.2-2.9,1.2s-2.1-0.4-2.9-1.2c-1.6-1.6-1.6-4.2 0-5.8l51-51-51-51c-1.6-1.6-1.6-4.2 0-5.8 1.6-1.6 4.2-1.6 5.8,0l53.9,53.9c1.6,1.6 1.6,4.2 0,5.8l-53.9,53.9z"/>
    </marker>
`

// type: 'arrow'
export function getPattern (type) {
  switch (type) {
    case 'arrow': return arrowPattern
    default: return arrowPattern
  }
}
