
import * as d3 from 'd3'
import { trimToPixel } from '../utils/string.utils'
import { buildTooltip } from './tooltip.charts'
import { NODE_SIZE } from '../types/node.types'
import { getIconByNode, getBBoxOfDescriptionArea } from '../utils/icon.utils'
import { EventManager, EventNames } from '../types/event.types'
import { ServiceTypes } from '../types/service.types'

export function buildNodes () {
  let context = null
  let selectionRef = null
  const tooltip = buildTooltip()

  const builder = function (selection) {
    selectionRef = selection
    selection.call(tooltip)

    const { nodes } = context.svg.datum()

    const nodeGroups = selection.selectAll('.node').data(nodes)
    const nodeGroupsEnter = nodeGroups.enter().append('g')
    const nodeGroupMerge = nodeGroups.merge(nodeGroupsEnter).attr('class', 'node')

    nodeGroupsEnter.append('svg:g')
    nodeGroupsEnter.append('svg:text')

    nodeGroupMerge
      .attr('id', d => d.id)
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', d => (d.metadata.canClickable ? 'pointer' : 'auto'))
      .style('visibility', 'visible')
      .on('click', (d) => {
        if (d.type === ServiceTypes.RestAPI && d.metadata.canClickable) {
          const updatedNode = {
            ...d,
            metadata: {
              ...d.metadata,
              isCollapsed: !d.metadata.isCollapsed
            }
          }

          EventManager.dispatch.collapse.call(EventNames.Collapsable, null, updatedNode)
        }
      })

    const iconsGroup = nodeGroupMerge.select('g')
    const textsGroup = nodeGroupMerge.select('text')

    iconsGroup
      .attr('class', 'node-icon')
      .html(d => getIconByNode(d))

    iconsGroup.select('svg')
      .attr('width', NODE_SIZE * 2)
      .attr('height', function () {
        const bbox = d3.select(this).node().getBBox()
        const scale = bbox.width / bbox.height
        return 2 * NODE_SIZE / scale
      })

    textsGroup
      .attr('class', 'node-description')
      .attr('x', (d) => {
        const bbox = getBBoxOfDescriptionArea(d.id, 'description')
        return bbox.x + bbox.width / 2
      })
      .attr('y', (d) => {
        const bbox = getBBoxOfDescriptionArea(d.id, 'description')
        return bbox.y + bbox.height / 2
      })
      .attr('dy', 3)
      .attr('text-anchor', 'middle')
      .text((d) => {
        const padding = 4
        const { width } = getBBoxOfDescriptionArea(d.id, 'description')
        return trimToPixel(d.name, width - padding)
      })
      .on('mouseover', (d) => {
        tooltip.renderContent(
          ` 
            <h3 class="title">${d.name}</h3>
            <p class="description">${d.metadata.description}</p>
          `,
          { top: d3.event.pageY, left: d3.event.pageX }
        )
      })
      .on('mouseout', () => {
        tooltip.hide()
      })

    nodeGroups.exit().remove()
  }

  builder.context = function (value) {
    context = value
    return builder
  }

  builder.destroy = function () {
    tooltip.destroy()
    d3.select(selectionRef).remove()
  }

  return builder
}

export function toggleNodes (rootNodeClass, collapsedNodesMap) {
  const rootSelection = d3.select(`.${rootNodeClass}`)
  if (!rootSelection.empty()) {
    const nodes = rootSelection.selectAll('.node')

    nodes.each(function (nodeData) {
      const currentNode = d3.select(this)
      const isCollasped = checkNodeCollapsed(nodeData, collapsedNodesMap)

      currentNode
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
        .style('visibility', isCollasped ? 'hidden' : 'visible')
    })
  }
}

function checkNodeCollapsed (currentNode, collapsedNodesMap) {
  let flattenChildren = []

  for (const node of collapsedNodesMap.values()) {
    flattenChildren = flattenChildren.concat(node.children || [])
  }

  const isCollasped = flattenChildren.find(child => child.id === currentNode.id)

  return !!isCollasped
}
