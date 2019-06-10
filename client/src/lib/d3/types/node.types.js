import { validId } from "../utils/string.utils";
import { ServiceTypes, ServiceDirectionTypes } from "./service.types";

export const NODE_SIZE = 50;

export const createNode = ({id, name, type, belongToIds, service, metadata, data, direction }) => {
    return {
        id,
        name,
        type, 
        belongToIds,
        metadata,
        service,
        data,
        direction
    };
}

export const getNodes = (serviceDescriptions) => {
    let serviceNodes = [];

    for (const serviceDescription of serviceDescriptions) {
        const microserviceId = validId(serviceDescription.name);
        const microserviceNode = createNode({
            id: microserviceId,
            name: serviceDescription.name,
            belongToIds: [],
            type: ServiceTypes.Microservice,
            metadata: {
                description: serviceDescription.description
            },
            direction: ServiceDirectionTypes.Both
        });

        serviceNodes = serviceNodes.concat([microserviceNode]);
        serviceNodes = serviceNodes.concat(getRestAPINodes(serviceDescription.incoming.restAPI, microserviceId));
        serviceNodes = serviceNodes.concat(getDBNodes(serviceDescription.services, microserviceId));
        serviceNodes = serviceNodes.concat(getSharedDBNodes(serviceDescription.services, microserviceId));
        serviceNodes = serviceNodes.concat(getTopicNodes(serviceDescription.services, microserviceId));
    }

    return mergeSimilarNodes(serviceNodes);
}

function mergeSimilarNodes(serviceNodes) {
    let microserviceNodes = [];
    let restAPINodes = [];
    let dbNodes = [];
    let sharedDBNodes = [];
    let topicNodes = [];

    for (const node of serviceNodes) {
        const { type } = node;

        if (type === ServiceTypes.Microservice) {
            microserviceNodes.push(node);
        } else if (type === ServiceTypes.RestAPI) {
            restAPINodes.push(node);
        } else if (type === ServiceTypes.DB) {
            dbNodes.push(node);
        } else if (type === ServiceTypes.SharedDB) {
            sharedDBNodes.push(node);
        } else if (type === ServiceTypes.Topic) {
            topicNodes.push(node);
        }
    }

    restAPINodes = mergeSimilarRestAPINodes(restAPINodes);
    dbNodes = mergeNodes(dbNodes);
    sharedDBNodes = mergeNodes(sharedDBNodes);
    topicNodes = mergeNodes(topicNodes);

    return [
        ...microserviceNodes,
        ...restAPINodes,
        ...dbNodes,
        ...sharedDBNodes,
        ...topicNodes
    ];
}

function mergeSimilarRestAPINodes(restAPINodes) {
    const mergedNodes = [];
    const nodeMap = new Map();

    for (const node of restAPINodes) {
        const { id, belongToIds } = node;
        const key = id;

        if (!nodeMap.has(key)) {
            nodeMap.set(key, {
                belongToIds,
                node: {...node}
            });
        } 
    }

    for (const value of nodeMap.values()) {
        const { node } = value;
        mergedNodes.push(node);
    }

    return mergedNodes;
}

function getRestAPINodes(restAPI, parentId) {
    let restAPINodes = [];
    if (restAPI) {
        const { pathPrefix, endpoints } = restAPI;
        if (endpoints) {
            for (const [key, value] of Object.entries(endpoints)) {
                const name = pathPrefix + key;
                const apis = value.map((api) => {
                    const id = validId(`${parentId}_${name}_${api.method}`)
                    return createNode({
                        id,
                        name,
                        type: ServiceTypes.RestAPI,
                        belongToIds: [parentId],
                        metadata: {
                            description: api.description
                        },
                        direction: ServiceDirectionTypes.Outcome,
                        data: api
                    })
                    
                });
                restAPINodes = restAPINodes.concat(apis);
            }
        }
    }
    return restAPINodes;
}

function getDBNodes(services, parentId) {
    let dbNodes = [];
    if (services.local && services.local.sqllite && services.local.sqllite.db) {
        for (const key of Object.keys(services.local.sqllite.db)) {
            const id = validId(`${parentId}_db_${key}`);
            const dbNode = createNode({
                id,
                type: ServiceTypes.DB,
                name: key,
                belongToIds: [parentId],
                metadata: {
                    description: key
                },
                direction: ServiceDirectionTypes.Income
            });
            dbNodes.push(dbNode);
        }
    }
    return dbNodes;
}

function getSharedDBNodes(services, parentId) {
    let sharedDBNodes = [];

    if (services && services.shared && services.shared.redis) {
        const id = validId(`${parentId}_sharedDB_redis`);
        const node = createNode({
            id,
            type: ServiceTypes.SharedDB,
            name: 'redis',
            belongToIds: [parentId],
            metadata: {
                description: 'Redis'
            },
            direction: ServiceDirectionTypes.Income
        });
        sharedDBNodes.push(node);
    }

    return sharedDBNodes;
}

function getTopicNodes(services, parentId) {
    let topicNodes = [];

    if (services && services.shared && services.shared.kafka) {
        const { consumes, produces } = services.shared.kafka;

        const consumesNodes = consumes.map((consume) => {
            return createNode({
                id: validId(`${parentId}_kafka_${consume}`),
                type: ServiceTypes.Topic,
                name: consume,
                belongToIds: [parentId],
                metadata: {
                    description: consume
                },
                direction: ServiceDirectionTypes.Income
            });
        });

        const producesNodes = produces.map((produce) => {
            return createNode({
                id: validId(`${parentId}_kafka_${produce}`),
                type: ServiceTypes.Topic,
                name: produce,
                belongToIds: [parentId],
                metadata: {
                    description: produce
                },
                direction: ServiceDirectionTypes.Outcome
            });
        });

        for (const consumeNode of consumesNodes) {
            const idx = producesNodes.findIndex((produce) => consumeNode.name === produce.name);

            if (idx > -1) {
                consumeNode.direction = ServiceDirectionTypes.Both;
                producesNodes.splice(idx, 1);
            }

            topicNodes.push(consumeNode);
        }

        topicNodes = topicNodes.concat(producesNodes);
    }

    return topicNodes;
}

function mergeNodes(nodes) {
    const mergedNodes = [];
    const nodeMap = new Map();

    for (const node of nodes) {
        const { name, belongToIds, type } = node;
        if (nodeMap.has(name)) {
            const oldNode = nodeMap.get(name);
            oldNode.belongToIds = [...oldNode.belongToIds, ...belongToIds];
            oldNode.node = {...node};
            nodeMap.set(name, oldNode);
        } else {
            nodeMap.set(name, {
                belongToIds,
                node: {...node}
            });
        }
    }

    for (const value of nodeMap.values()) {
        const { belongToIds, node } = value;
        const id = validId(`${belongToIds.join('_')}_${node.type}_${node.name}`);

        mergedNodes.push({
            ...node,
            id,
            belongToIds
        })
    }

    return mergedNodes;
}
