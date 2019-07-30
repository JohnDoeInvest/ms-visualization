export const getPathData = ({ source, target }) => {
  const path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`
  return path
}

export const getLinkPath = ({ source, target }) => {
  const offset = 30

  const midpointX = (source.x + target.x) / 2
  const midpointY = (source.y + target.y) / 2

  const dx = (target.x - source.x)
  const dy = (target.y - source.y)

  const normalise = Math.sqrt((dx * dx) + (dy * dy))

  const offSetX = midpointX + offset * (dy / normalise)
  const offSetY = midpointY - offset * (dx / normalise)

  return `M${source.x},${source.y
  }S${offSetX},${offSetY
  } ${target.x},${target.y}`
}

export const getScreenCoords = (node) => {
  const ctm = node.getCTM()
  const x = node.getAttribute('cx')
  const y = node.getAttribute('cy')
  const xn = ctm.e + x * ctm.a + y * ctm.c
  const yn = ctm.f + x * ctm.b + y * ctm.d

  return { x: xn, y: yn }
}
