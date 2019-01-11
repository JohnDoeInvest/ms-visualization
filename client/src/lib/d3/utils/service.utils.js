import { ServiceTypes, ServiceNode } from '../types/service.types';
import { getMicroserviceIcon, getRestAPIIcon, getTopicIcon } from './base.utils';

const withServiceNodeParser = (fn) => (service) => {
    const { id, name, type, description, icon } = fn(service);
    return new ServiceNode({
        id,
        name,
        type,
        isGroup: false,
        metadata: {
            description,
            isHighlighted: false,
            belongToId: id,
            icon
        }
    });
}

export const parseMicroserviceToServiceNode = withServiceNodeParser((microservice) => {
    const id = microservice.name;
    const name = microservice.name;
    const type = ServiceTypes.Microservice;
    const description = microservice.description;
    const icon = getMicroserviceIcon(microservice);
    return { id, name, type, description, icon };
});

export const parseRestAPIToServiceNode = withServiceNodeParser((restAPI) => {
    const { uri, method } = restAPI;
    const id = method.toLowerCase() + '_' + uri.toLowerCase();
    const name = uri;
    const type = ServiceTypes.RestAPI;
    const description = uri;
    const icon = getRestAPIIcon(restAPI);
    return { id, name, type, description, icon };
});

export const parseTopicToServiceNode = withServiceNodeParser((topic) => {
    const { name, producerConsumerName } = topic;
    const id = name.toLowerCase();
    const name = name;
    const type = ServiceTypes.Topic;
    const description = name;
    const icon = getTopicIcon(topic);
    return { id, name, type, description, icon };
});

export const parseStoreToServiceNode = withServiceNodeParser((store) => {

});

/**
 * 
 * @param {*} producers 
 * @returns {Array<{name: string; producerConsumerName: string}>} topics
 */
export function parseProducerConsumerToTopics(producers) {
    return producers.reducer((accTopics, producer) => {
        const { name, topics } = producer;
        const newTopics = topics.map(topic => ({
            name: topic,  
            producerConsumerName: name,
        }));
        return [..accTopics, ...newTopics];
    }, []);
}

/**
 * 
 * @return {Array<{belongToIds: Array<string>; type: ServiceTypes; originData}>} seviceDescriptionObj 
 */
function mergeServiceDescriptions(seviceDescriptions) {
    const serviceDescriptionDic = new Map();

    for (const serviceDescription of seviceDescriptions) {
        const { name: microserviceName, restAPIs, sharedServices, produces, stores } = serviceDescription;

        const withAddServiceToDic = (createIdFn) => (services, type) => {
            for (const service of services) {
                const serviceId = createIdFn(service);
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
        const addRestAPIToDic  = withAddServiceToDic(restAPI => restAPI.method.toLowerCase() + '_' + restAPI.uri.toLowerCase());
        addRestAPIToDic(restAPIs, ServiceTypes.RestAPI);

        // sharedServices
        const addSharedServiceToDic  = withAddServiceToDic(sharedService => sharedService.name);
        addSharedServiceToDic(sharedServices, ServiceTypes.SharedService);

        // produces
        const addProduceToDic  = withAddServiceToDic(produce => produce.name);
        addProduceToDic(produces, ServiceTypes.Topic);

        // produces
        const addStoreToDic  = withAddServiceToDic(store => store.name);
        addStoreToDic(stores, ServiceTypes.Store);
    }

    return serviceDescriptionDic.values();
}