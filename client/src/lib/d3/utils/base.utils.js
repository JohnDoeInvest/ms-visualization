import {  ServiceTypes, ServiceIconNames } from '../types/service.types';
import { SOURCE_ASSET_BASE_URI } from '../types/base.types';

export function getMicroserviceIcon(microservice) {
    return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Microservice;
}

export function getStoreIcon(store) {
    return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Store;
}
export function getSharedServiceIcon(sharedSerice) {
    return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.SharedService;
}

export function getTopicIcon({ name, producerConsumerName }) {
    switch (producerConsumerName.toLowerCase()) {
		case 'kafka': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Topic.Kafka;
		default: return '';
	}
}

export function getRestAPIIcon(restAPI) {
    const { method } = restAPI;
	switch (method.toLowerCase()) {
		case 'post': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Post;
		case 'get': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Get;
		case 'delete': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Delete;
		default: return '';
	}
}

