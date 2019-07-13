import * as d3 from 'd3'
import { ServiceTypes } from '../types/service.types'
import {
  SERVICE_ICON,
  DB_ICON,
  DB_SHARED_ICON,
  KAFKA_ICON,
  GET_API_ICON,
  POST_API_ICON,
  DELETE_API_ICON,
  PUT_API_ICON,
  GLOBAL_ICON
} from '../types/icon.types'

export const ConnectorIdDics = {
  DB_SHARED: {
    left: 'toMS'
  },
  DB: {
    left: 'toMS'
  },
  KAFKA: {
    left: 'producer',
    right: 'consumer'
  },
  MICROSERVICE: {
    left: 'incoming',
    topRight: 'kafkaProduce',
    bottomRight: 'kafkaConsume',
    right: 'db',
    bottom: 'dbShared'
  },
  GET_API: {
    right: 'toMS'
  },
  POST_API: {
    right: 'toMS'
  },
  DELETE_API: {
    right: 'toMS'
  },
  PUT_API: {
    right: 'toMS'
  }
}

const getRestAPIIcon = (service) => {
  try {
    const method = service.method.toLowerCase()

    switch (method) {
      case 'get': return GET_API_ICON
      case 'post': return POST_API_ICON
      case 'delete': return DELETE_API_ICON
      case 'put': return PUT_API_ICON
      default: return GET_API_ICON
    }
  } catch (err) {
    return GET_API_ICON
  }
}

const getMicroserviceIcon = (service) => {
  const name = service.name.toLowerCase()
  if (name === 'global') {
    return GLOBAL_ICON
  }
  return SERVICE_ICON
}

export const getIconByNode = (node) => {
  const { type } = node

  switch (type) {
    case ServiceTypes.Microservice: return getMicroserviceIcon(node)
    case ServiceTypes.DB: return DB_ICON
    case ServiceTypes.SharedDB: return DB_SHARED_ICON
    case ServiceTypes.Topic: return KAFKA_ICON
    case ServiceTypes.RestAPI: return getRestAPIIcon(node.data)
    default: return ''
  }
}

export function getBBoxOfDescriptionArea (parentId, descriptionId) {
  const parent = d3.select(`#${parentId}`)
  const nodeImg = parent.select('.node-icon')
  const svg = parent.select('svg')
  const description = svg.select(`#${descriptionId}`)

  const nodeImgBBox = nodeImg.node().getBBox()
  const svgBBox = svg.node().getBBox()
  const descriptionBBox = description.node().getBBox()
  const imgWidth = nodeImgBBox.width
  const imgHeight = nodeImgBBox.width * svgBBox.height / svgBBox.width
  const widthRatio = svgBBox.width / descriptionBBox.width

  const x = descriptionBBox.x * imgWidth / svgBBox.width
  const y = descriptionBBox.y * imgHeight / svgBBox.height
  const width = imgWidth / widthRatio
  const height = width * descriptionBBox.height / descriptionBBox.width

  return {
    x, y, width, height
  }
}
