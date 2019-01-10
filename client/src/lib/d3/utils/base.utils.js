import {  ServiceTypes } from '../types/service.types';

export const SOURCE_ASSET_BASE_URI = '/assets/d3';

export const ServiceIconNames = {
    Microservice: 'icn-service.svg',
    RestAPI: {
        Get: 'icn-get.svg',
        Post: 'icn-post.svg',
        Delete: 'icn-delete.svg',
    },
    Topic: {
        Kafka: 'icn-kafka.svg'
    },
    Store: 'icn-db.svg'
}

export function getMicroserviceIcon(microservice) {
    return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Microservice;
}

export function getStoreIcon(store) {
    return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Store;
}

export function getTopicIcon(topic) {
    const name = topic.name.toLowerCase();
    switch (name) {
		case 'kafka': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.Topic.Kafka;
		default: return '';
	}
}

export function getRestAPIIcon(restAPI) {
    const { method } = restAPI.method.toLowerCase();
	switch (method) {
		case 'post': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Post;
		case 'get': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Get;
		case 'delete': return SOURCE_ASSET_BASE_URI + '/' + ServiceIconNames.RestAPI.Delete;
		default: return '';
	}
}
