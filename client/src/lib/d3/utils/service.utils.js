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
    const id = ServiceTypes.RestAPI.toLowerCase() + '_' + method.toLowerCase() + '_' + uri.toLowerCase();
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
