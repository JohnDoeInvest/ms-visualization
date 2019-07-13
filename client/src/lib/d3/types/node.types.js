import { validId } from '../utils/string.utils'
import { ServiceTypes } from './service.types'

export const NODE_SIZE = 30

export const createNode = ({
  id, name, type, belongToIds, metadata, data, fromIds, toIds, children
}) => ({
  id,
  name,
  type,
  belongToIds,
  metadata,
  data,
  fromIds,
  toIds,
  children
})

export const getNodes = (serviceDescriptions) => {
  let serviceNodes = []

  for (const serviceDescription of serviceDescriptions) {
    const microserviceId = validId(serviceDescription.name)
    const microserviceNode = createNode({
      id: microserviceId,
      name: serviceDescription.name,
      belongToIds: [],
      type: ServiceTypes.Microservice,
      metadata: {
        description: serviceDescription.description
      }
    })

    serviceNodes = serviceNodes.concat([microserviceNode])

    serviceNodes = serviceNodes.concat(getRestAPINodes(serviceDescription.incoming.restAPI, microserviceId))
    serviceNodes = serviceNodes.concat(getDBNodes(serviceDescription.services, microserviceId))
    serviceNodes = serviceNodes.concat(getSharedDBNodes(serviceDescription.services, microserviceId))
    serviceNodes = serviceNodes.concat(getTopicNodes(serviceDescription.services, microserviceId))
  }

  return mergeSimilarNodes(serviceNodes)
}

function mergeSimilarNodes (serviceNodes) {
  const microserviceNodes = []
  let restAPINodes = []
  let dbNodes = []
  let sharedDBNodes = []
  let topicNodes = []

  for (const node of serviceNodes) {
    const { type } = node

    if (type === ServiceTypes.Microservice) {
      microserviceNodes.push(node)
    } else if (type === ServiceTypes.RestAPI) {
      restAPINodes.push(node)
    } else if (type === ServiceTypes.DB) {
      dbNodes.push(node)
    } else if (type === ServiceTypes.SharedDB) {
      sharedDBNodes.push(node)
    } else if (type === ServiceTypes.Topic) {
      topicNodes.push(node)
    }
  }

  restAPINodes = mergeSimilarRestAPINodes(restAPINodes)
  dbNodes = mergeNodes(dbNodes)
  sharedDBNodes = mergeNodes(sharedDBNodes)
  topicNodes = mergeNodes(topicNodes)

  return [
    ...microserviceNodes,
    ...restAPINodes,
    ...dbNodes,
    ...sharedDBNodes,
    ...topicNodes
  ]
}

function mergeSimilarRestAPINodes (restAPINodes) {
  const mergedNodes = []
  const nodeMap = new Map()

  for (const node of restAPINodes) {
    const { id, belongToIds } = node
    const key = id

    if (!nodeMap.has(key)) {
      nodeMap.set(key, {
        belongToIds,
        node: { ...node }
      })
    }
  }

  for (const value of nodeMap.values()) {
    const { node } = value
    mergedNodes.push(node)
  }

  return mergedNodes
}

function getRestAPINodes (restAPI, parentId) {
  let restAPINodes = []
  let childrenAPINodes = []
  if (restAPI) {
    const { pathPrefix, endpoints } = restAPI
    if (endpoints) {
      const groupRestNode = createNode({
        id: validId(`${parentId}_rest_api_group`),
        name: 'Rest APIs',
        type: ServiceTypes.RestAPI,
        belongToIds: [parentId],
        metadata: {
          description: 'Rest APIs',
          canClickable: true,
          isCollapsed: true
        },
        toIds: [parentId]
      })

      for (const [key, value] of Object.entries(endpoints)) {
        const name = pathPrefix + key
        const apis = value.map((api) => {
          const id = validId(`${parentId}_${name}_${api.method}`)
          return createNode({
            id,
            name,
            type: ServiceTypes.RestAPI,
            belongToIds: [parentId],
            toIds: [],
            metadata: {
              description: api.description
            },
            data: api,
            children: []
          })
        })
        childrenAPINodes = childrenAPINodes.concat(apis)
      }

      if (childrenAPINodes.length === 1) {
        childrenAPINodes[0].toIds = [parentId]
        childrenAPINodes[0].toIds = [parentId]
        restAPINodes = [childrenAPINodes[0]] 
      } else if (childrenAPINodes.length > 1) {
        for (const childNode of childrenAPINodes) {
          groupRestNode.toIds.push(childNode.id)
        }
        groupRestNode.children = [...childrenAPINodes]
        restAPINodes = [groupRestNode, ...childrenAPINodes]
      } else {
        restAPINodes = [];
      }
    }
  }
  return restAPINodes
}

function getDBNodes (services, parentId) {
  const dbNodes = []
  if (services.local && services.local.sqllite && services.local.sqllite.db) {
    for (const key of Object.keys(services.local.sqllite.db)) {
      const id = validId(`${parentId}_db_${key}`)
      const dbNode = createNode({
        id,
        type: ServiceTypes.DB,
        name: key,
        belongToIds: [parentId],
        fromIds: [parentId],
        metadata: {
          description: key
        }
      })
      dbNodes.push(dbNode)
    }
  }
  return dbNodes
}

function getSharedDBNodes (services, parentId) {
  const sharedDBNodes = []

  if (services && services.shared && services.shared.redis) {
    const id = validId(`${parentId}_sharedDB_redis`)
    const node = createNode({
      id,
      type: ServiceTypes.SharedDB,
      name: 'redis',
      belongToIds: [parentId],
      fromIds: [parentId],
      metadata: {
        description: 'Redis'
      }
    })
    sharedDBNodes.push(node)
  }

  return sharedDBNodes
}

function getTopicNodes (services, parentId) {
  let topicNodes = []

  if (services && services.shared && services.shared.kafka) {
    const { consumes, produces } = services.shared.kafka

    const consumesNodes = consumes.map(consume => createNode({
      id: validId(`${parentId}_kafka_${consume}`),
      type: ServiceTypes.Topic,
      name: consume,
      belongToIds: [parentId],
      fromIds: [parentId],
      metadata: {
        description: consume
      }
    }))

    const producesNodes = produces.map(produce => createNode({
      id: validId(`${parentId}_kafka_${produce}`),
      type: ServiceTypes.Topic,
      name: produce,
      belongToIds: [parentId],
      toIds: [parentId],
      metadata: {
        description: produce
      }
    }))

    for (const consumeNode of consumesNodes) {
      const idx = producesNodes.findIndex(produce => consumeNode.name === produce.name)

      if (idx > -1) {
        consumeNode.toIds = [...producesNodes[idx].toIds]
        producesNodes.splice(idx, 1)
      }

      topicNodes.push(consumeNode)
    }

    topicNodes = topicNodes.concat(producesNodes)
  }

  return topicNodes
}

function mergeNodes (nodes) {
  const mergedNodes = []
  const nodeMap = new Map()

  for (const node of nodes) {
    const { name, belongToIds, fromIds, toIds } = node
    if (nodeMap.has(name)) {
      const oldNode = nodeMap.get(name)
      oldNode.belongToIds = [...oldNode.belongToIds, ...belongToIds]
      if (fromIds) {
        oldNode.fromIds = [...(oldNode.fromIds || []), ...fromIds]
      }
      if (toIds) {
        oldNode.toIds = [...(oldNode.toIds || []), ...toIds]
      }

      oldNode.node = { ...node }
      nodeMap.set(name, oldNode)
    } else {
      nodeMap.set(name, {
        belongToIds,
        fromIds,
        toIds,
        node: { ...node }
      })
    }
  }

  for (const value of nodeMap.values()) {
    const {
      belongToIds, node, fromIds, toIds
    } = value
    const id = validId(`${belongToIds.join('_')}_${node.type}_${node.name}`)

    mergedNodes.push({
      ...node,
      id,
      belongToIds,
      fromIds,
      toIds
    })
  }

  return mergedNodes
}

export function updateNodes (nodes, updatedNode) {
  if (updatedNode) {
    let newNodes = []
    const { children, metadata: { canClickable, isCollapsed } } = updatedNode
    for (const node of nodes) {
      if (node.id !== updatedNode.id && !children.find(child => child.id === node.id)) {
        newNodes.push(node)
      }
    }
    newNodes.push(updatedNode)

    if (canClickable) {
      if (!isCollapsed) {
        newNodes = newNodes.concat(children)
      }
    }

    return newNodes
  }
  return nodes
}
