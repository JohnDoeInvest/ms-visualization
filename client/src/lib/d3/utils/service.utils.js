import { ServiceTypes } from '../types/service.types';
import { validId } from './string.utils';

/**
 * 
 * @param {ServiceDescription} service 
 * @param {ServiceTypes} type 
 * @param {string} prefixId 
 */
export function createServiceId(service, type, prefixId) {
    switch (type) {
        case ServiceTypes.Microservice: return validId(service.name);
        case ServiceTypes.RestAPI: return validId(prefixId + '_rest_api_' + service.method.toLowerCase() + '_' + service.uri.toLowerCase());
        case ServiceTypes.DB: return validId(prefixId + '_db_' + service.name.toLowerCase());
        case ServiceTypes.Topic: return validId('topic_' + service.name.toLowerCase());
        default: return validId('shared_db_' + service.name.toLowerCase());
    }
}
