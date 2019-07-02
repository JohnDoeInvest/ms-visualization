import { ServiceTypes } from '../types/service.types'
import * as IconResources from '../types/icon.types'

const getMicroserviceIcon = (microservice) => IconResources.SERVICE_ICON
const getStoreIcon = (store) => IconResources.DB_ICON
const getSharedServiceIcon = (sharedSerice) => IconResources.DB_SHARED_ICON
const getTopicIcon = ({ name, producerConsumerName }) => {
  switch (producerConsumerName.toLowerCase()) {
    case 'kafka': return IconResources.KAFKA_ICON
    default: return ''
  }
}
const getRestAPIIcon = (restAPI) => {
  const { method } = restAPI
  switch (method.toLowerCase()) {
    case 'post': return IconResources.POST_API_ICON
    case 'get': return IconResources.GET_API_ICON
    case 'delete': return IconResources.DELETE_API_ICON
    default: return ''
  }
}

export const ServiceIconFactory = (type) => (service) => {
  switch (type) {
    case ServiceTypes.Microservice: return getMicroserviceIcon(service)
    case ServiceTypes.RestAPI: return getRestAPIIcon(service)
    case ServiceTypes.Topic: return getTopicIcon(service)
    case ServiceTypes.Store: return getStoreIcon(service)
    default: return getSharedServiceIcon(service)
  }
}
