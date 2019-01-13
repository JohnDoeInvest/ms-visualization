import { ServiceTypes } from '../types/service.types';
import { ServiceNode } from '../types/node.types';
import { getMicroserviceIcon, getRestAPIIcon, getTopicIcon, getStoreIcon, getSharedServiceIcon } from './base.utils';

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
                const serviceId = createServiceId(service, type);
                if (serviceDescriptionDic.has(serviceId)) {
                    const serviceObj = serviceDescriptionDic.get(serviceId);
                    serviceObj.belongToIds.push(microserviceName)
                    serviceDescriptionDic.set(serviceId, serviceObj);
                } else {
                    serviceDescriptionDic.set(serviceId, {
                        type,
                        belongToIds: [microserviceName],
                        originData: {...service}
                    });
                }
            }
        };

        // microservice
        serviceDescriptionDic.set(microserviceName, {
            type: ServiceTypes.Microservice,
            belongToIds: [microserviceName],
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
        const { id, name, description, icon } = fn(originData);
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

    const parseMicroserviceToServiceNode = withServiceNodeParser((microservice) => {
        const id = createServiceId(microservice, ServiceTypes.Microservice);
        const name = microservice.name;
        const description = microservice.description;
        const icon = getMicroserviceIcon(microservice);
        return { id, name, description, icon };
    });
    
    const parseRestAPIToServiceNode = withServiceNodeParser((restAPI) => {
        const { uri, method } = restAPI;
        const id = createServiceId(restAPI, ServiceTypes.RestAPI);
        const name = uri;
        const description = uri;
        const icon = getRestAPIIcon(restAPI);
        return { id, name, description, icon };
    });
    
    const parseTopicToServiceNode = withServiceNodeParser((topic) => {
        const { name, producerConsumerName } = topic;
        const id = createServiceId(topic, ServiceTypes.Topic);
        const description = name;
        const icon = getTopicIcon(topic);
        return { id, name, description, icon };
    });
    
    const parseStoreToServiceNode = withServiceNodeParser((store) => {
        const { name } = store;
        const id = createServiceId(store, ServiceTypes.Store);
        const description = name;
        const icon = getStoreIcon(store);
        return { id, name, description, icon };
    });
    const parseSharedServiceToServiceNode = withServiceNodeParser((sharedService) => {
        const { name } = sharedService;
        const id = createServiceId(sharedService, ServiceTypes.SharedService);
        const description = name;
        const icon = getSharedServiceIcon(sharedService);
        return { id, name, description, icon };
    });

    switch (type) {
        case ServiceTypes.Microservice: return parseMicroserviceToServiceNode;
        case ServiceTypes.RestAPI: return parseRestAPIToServiceNode;
        case ServiceTypes.Topic: return parseTopicToServiceNode;
        case ServiceTypes.Store: return parseStoreToServiceNode;
        case ServiceTypes.SharedService: return parseSharedServiceToServiceNode;
    }
}

export function createServiceId(service, type) {
    switch (type) {
        case ServiceTypes.Microservice: return service.name;
        case ServiceTypes.RestAPI: return 'rest_api_' + service.method.toLowerCase() + '_' + service.uri.toLowerCase();
        case ServiceTypes.Topic: return 'topic_' + service.name.toLowerCase();
        case ServiceTypes.Store: return 'store_' + service.name.toLowerCase();
        default: return 'shared_service_' + service.name.toLowerCase();
    }
}
