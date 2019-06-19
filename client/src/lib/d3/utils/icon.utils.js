import { ServiceTypes } from "../types/service.types";
import { SERVICE_ICON, DB_ICON, DB_SHARED_ICON, KAFKA_ICON, GET_API_ICON, POST_API_ICON, DELETE_API_ICON, PUT_API_ICON } from '../types/icon.types';

export const getIconByNode = (node) => {
    const { type } = node;

    switch (type) {
        case ServiceTypes.Microservice: return SERVICE_ICON;
        case ServiceTypes.DB: return DB_ICON;
        case ServiceTypes.SharedDB: return DB_SHARED_ICON;
        case ServiceTypes.Topic: return KAFKA_ICON;
        case ServiceTypes.RestAPI: return getRestAPIIcon(node.data);
        default: return '';
    }
}

function getRestAPIIcon(service) {
    try {
        const method = service.method.toLowerCase();
        
        switch (method) {
            case 'get': return GET_API_ICON;
            case 'post': return POST_API_ICON;
            case 'delete': return DELETE_API_ICON;
            case 'put': return PUT_API_ICON;
            default: return GET_API_ICON;
        }
    } catch (err) {
        return GET_API_ICON;
    }
}