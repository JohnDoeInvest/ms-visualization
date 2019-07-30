import * as d3 from 'd3'

export const buildTooltip = () => {
  const rootEl = document.body
  let nodeEl = null
  let node = null

  const builder = function (selection) {
    node = getNode()
  }

  builder.show = function () {
    node.style('opacity', 1)
    return builder
  }
  builder.hide = function () {
    node.style('opacity', 0)
    return builder
  }
  builder.renderContent = function (htmlContent, position) {
    const { top, left } = position

    node
      .style('left', `${left}px`)
      .style('top', `${top}px`)
      .html(htmlContent)

    builder.show()
    return builder
  }
  builder.destroy = function () {
    node.remove()
  }

  return builder

  function initNodeEl () {
    const divEl = document.createElement('div')
    const div = d3.select(divEl)
    div
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('z-index', 9999)
      .style('pointer-events', 'none')
      .style('box-sizing', 'border-box')

    return div.node()
  }

  function getNode () {
    const tooltipEl = d3.select('.tooltip')
    if (tooltipEl.empty()) {
      nodeEl = initNodeEl()
      rootEl.appendChild(nodeEl)
    }
    return d3.select(nodeEl)
  }
}
