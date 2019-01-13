import {  ServiceTypes, ServiceIconNames } from '../types/service.types';
import { SOURCE_ASSET_BASE_URI } from '../types/base.types';

const getMicroserviceIcon = (microservice) => SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Microservice;
const getStoreIcon = (store) => SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Store;
const getSharedServiceIcon = (sharedSerice) => SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.SharedService;
const getTopicIcon = ({ name, producerConsumerName }) => {
    switch (producerConsumerName.toLowerCase()) {
		case 'kafka': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Topic.Kafka;
		default: return '';
	}
};
const getRestAPIIcon = (restAPI) => {
    const { method } = restAPI;
	switch (method.toLowerCase()) {
		case 'post': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Post;
		case 'get': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Get;
		case 'delete': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Delete;
		default: return '';
	}
};

export const ServiceIconFactory = (type) => (service) => {
	switch (type) {
		case ServiceTypes.Microservice: return getMicroserviceIcon(service);
		case ServiceTypes.RestAPI: return getRestAPIIcon(service);
		case ServiceTypes.Topic: return getTopicIcon(service);
		case ServiceTypes.Store: return getStoreIcon(service);
		default: return getSharedServiceIcon(service);
	}
}

