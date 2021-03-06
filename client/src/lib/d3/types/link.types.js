import { ServiceTypes } from './service.types'
import { NODE_SIZE } from './node.types'

export const createLink = ({
  source, target, sourceNode, targetNode, belongToId
}) => ({
  source,
  target,
  sourceNode,
  targetNode,
  belongToId
})

export const getLinks = (nodes) => {
  let restAPILinks = []
  let dbLinks = []
  let topicLinks = []

  const nodesMap = new Map()
  for (const node of nodes) {
    nodesMap.set(node.id, node)
  }

  for (const node of nodes) {
    const {
      id, type, toIds, fromIds, belongToIds
    } = node
    if (type === ServiceTypes.RestAPI) {
      const newRestLinks = toIds.map(parentId => ({
        source: id,
        target: parentId,
        belongToId: belongToIds[0],
        sourceNode: node,
        targetNode: nodesMap.get(parentId)
      }))

      restAPILinks = restAPILinks.concat(newRestLinks)
    } else if (type === ServiceTypes.SharedDB || type === ServiceTypes.DB) {
      const newLinks = fromIds.map(parentId => ({
        source: parentId,
        target: id,
        belongToId: parentId,
        sourceNode: nodesMap.get(parentId),
        targetNode: node
      }))

      dbLinks = dbLinks.concat(newLinks)
    } else if (type === ServiceTypes.Topic) {
      if (fromIds) {
        const incLinks = fromIds.map(fromId => ({
          source: fromId,
          target: id,
          belongToId: fromId,
          sourceNode: nodesMap.get(fromId),
          targetNode: node
        }))
        topicLinks = topicLinks.concat(incLinks)
      }
      if (toIds) {
        const outLinks = toIds.map(toId => ({
          source: id,
          target: toId,
          belongToId: toId,
          sourceNode: node,
          targetNode: nodesMap.get(toId)
        }))
        topicLinks = topicLinks.concat(outLinks)
      }
    }
  }

  return [
    ...restAPILinks,
    ...dbLinks,
    ...topicLinks
  ]
}

export const LinkDistances = {
  RestAPI: NODE_SIZE,
  DB: NODE_SIZE,
  SharedDB: NODE_SIZE * 4,
  KAFKA: NODE_SIZE * 2
}

export const getLinkDistance = (link) => {
  const { sourceNode, targetNode } = link
  const sourceType = sourceNode.type
  const targetType = targetNode.type

  if (sourceType === ServiceTypes.RestAPI || targetType === ServiceTypes.RestAPI) {
    return LinkDistances.RestAPI
  }
  if (sourceType === ServiceTypes.Topic || targetType === ServiceTypes.Topic) {
    return LinkDistances.KAFKA
  }
  if (sourceType === ServiceTypes.DB || targetType === ServiceTypes.DB) {
    return LinkDistances.DB
  }
  if (sourceType === ServiceTypes.SharedDB || targetType === ServiceTypes.SharedDB) {
    return LinkDistances.SharedDB
  }

  return 20
}
