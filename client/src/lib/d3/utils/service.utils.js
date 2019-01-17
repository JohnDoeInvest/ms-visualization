import { ServiceTypes } from '../types/service.types';
import { ServiceNode } from '../types/node.types';
import { ServiceIconFactory } from './base.utils';
import { validId } from './string.utils';

/**
 * @return {Array<{belongToIds: Array<string>; type: ServiceTypes; originData}>} seviceDescriptionORM 
 */
export function createServiceDescriptionORM(serviceDescriptions) {
    const flattenServiceDescriptions = flatServiceDescriptions(serviceDescriptions);
    const serviceDescriptionORM = mapServiceDescriptionsToORM(flattenServiceDescriptions);
    return serviceDescriptionORM;
}

/**
 * 
 * @param {ServiceDescription} serviceDescriptions 
 * @returns {Array<{name, description, restAPIs, sharedServices, topics, stores}>}
 */
export function flatServiceDescriptions(serviceDescriptions) {
    return serviceDescriptions.map((serviceDescription) => {
        const { name, description } = serviceDescription;
        const topics = ServiceNodeFlatterFactory(ServiceTypes.Topic)(serviceDescription.produces);
        const stores = ServiceNodeFlatterFactory(ServiceTypes.Store)(serviceDescription.stores);
        const sharedServices = serviceDescription.sharedServices;
        const restAPIs = serviceDescription.restAPIs;
    
        return {
            name,
            description,
            restAPIs,
            sharedServices,
            topics,
            stores
        };
    });
}

/**
 * 
 * @return {Array<{belongToIds: Array<string>; type: ServiceTypes; originData}>} seviceDescriptionORM 
 */
export function mapServiceDescriptionsToORM(seviceDescriptions) {
    const serviceDescriptionDic = new Map();

    for (const serviceDescription of seviceDescriptions) {
        const { name: microserviceName, restAPIs, sharedServices, topics, stores } = serviceDescription;

        const addServiceToDic = (services, type) => {
            for (const service of services) {
                const serviceId = createServiceId(service, type, microserviceName);
                if (serviceDescriptionDic.has(serviceId)) {
                    const serviceObj = serviceDescriptionDic.get(serviceId);
                    serviceObj.belongToIds.push(validId(microserviceName))
                    serviceDescriptionDic.set(serviceId, serviceObj);
                } else {
                    serviceDescriptionDic.set(serviceId, {
                        type,
                        belongToIds: [validId(microserviceName)],
                        originData: {...service}
                    });
                }
            }
        };

        // microservice
        serviceDescriptionDic.set(microserviceName, {
            type: ServiceTypes.Microservice,
            belongToIds: [validId(microserviceName)],
            originData: {
                name: microserviceName,
                description: serviceDescription.description
            }
        });

        // restAPIs
        addServiceToDic(restAPIs, ServiceTypes.RestAPI);

        // sharedServices
        addServiceToDic(sharedServices, ServiceTypes.SharedService);

        // topics
        addServiceToDic(topics, ServiceTypes.Topic);

        // stores
        addServiceToDic(stores, ServiceTypes.Store);
    }

    return Array.from(serviceDescriptionDic.values());
}

export const ServiceNodeFlatterFactory = (type) => {
    /**
     * @param {*} producers 
     * @returns {Array<{name: string; producerConsumerName: string}>} topics
     */
    const flatProducerConsumerToTopics = (producers) => {
        return producers.reduce((accTopics, producer) => {
            const { name, topics } = producer;
            const newTopics = topics.map(topic => ({
                name: topic,  
                producerConsumerName: name,
            }));
            return [...accTopics, ...newTopics];
        }, []);
    }
    /**
     * @param {*} stores 
     * @returns {Array<{name: string; storeName: string}>} stores
     */
    const flatStores = (stores) => {
        return stores.reduce((accStores, store) => {
            const { name, dbs } = store;
            const newStores = dbs.map(db => ({
                name: db.name,  
                storeName: name,
            }));
            return [...accStores, ...newStores];
        }, []);
    }

    switch (type) {
        case ServiceTypes.Topic: return flatProducerConsumerToTopics;
        case ServiceTypes.Store: return flatStores;
    }
}

export const ServiceNodeParserFactory = (type) => {
    const withServiceNodeParser = (fn) => (serviceORM) => {
        const { type, belongToIds, originData } = serviceORM;
        const prefixId = getPrefixId(serviceORM);
        const { id, name, description, icon } = fn(originData, prefixId);
        return new ServiceNode({
            id,
            name,
            type,
            belongToIds,
            isGroup: false,
            metadata: {
                description,
                isHighlighted: false,
                icon
            }
        });
    };

    const parseMicroserviceToServiceNode = withServiceNodeParser((microservice, prefixId) => {
        const id = createServiceId(microservice, ServiceTypes.Microservice, prefixId);
        const name = microservice.name;
        const description = microservice.description;
        const icon = ServiceIconFactory(ServiceTypes.Microservice)(microservice);
        return { id, name, description, icon };
    });
    
    const parseRestAPIToServiceNode = withServiceNodeParser((restAPI, prefixId) => {
        const { uri, method } = restAPI;
        const id = createServiceId(restAPI, ServiceTypes.RestAPI, prefixId);
        const name = uri;
        const description = uri;
        const icon = ServiceIconFactory(ServiceTypes.RestAPI)(restAPI);
        return { id, name, description, icon };
    });
    
    const parseTopicToServiceNode = withServiceNodeParser((topic, prefixId) => {
        const { name, producerConsumerName } = topic;
        const id = createServiceId(topic, ServiceTypes.Topic, prefixId);
        const description = name;
        const icon = ServiceIconFactory(ServiceTypes.Topic)(topic);
        return { id, name, description, icon };
    });
    
    const parseStoreToServiceNode = withServiceNodeParser((store, prefixId) => {
        const { name } = store;
        const id = createServiceId(store, ServiceTypes.Store, prefixId);
        const description = name;
        const icon = ServiceIconFactory(ServiceTypes.Store)(store);
        return { id, name, description, icon };
    });
    const parseSharedServiceToServiceNode = withServiceNodeParser((sharedService, prefixId) => {
        const { name } = sharedService;
        const id = createServiceId(sharedService, ServiceTypes.SharedService, prefixId);
        const description = name;
        const icon = ServiceIconFactory(ServiceTypes.SharedService)(sharedService);
        return { id, name, description, icon };
    });

    switch (type) {
        case ServiceTypes.Microservice: return parseMicroserviceToServiceNode;
        case ServiceTypes.RestAPI: return parseRestAPIToServiceNode;
        case ServiceTypes.Topic: return parseTopicToServiceNode;
        case ServiceTypes.Store: return parseStoreToServiceNode;
        default: return parseSharedServiceToServiceNode;
    }
}

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
        case ServiceTypes.Store: return validId(prefixId + '_store_' + service.name.toLowerCase());
        case ServiceTypes.Topic: return validId('topic_' + service.name.toLowerCase());
        default: return validId('shared_service_' + service.name.toLowerCase());
    }
}

export function getPrefixId(serviceORM) {
    const { type, belongToIds, originData } = serviceORM;
    if (type === ServiceTypes.RestAPI || type === ServiceTypes.Store) {
        return belongToIds[0];
    }
    return undefined;
}
