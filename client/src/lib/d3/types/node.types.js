import { validId } from "../utils/string.utils";
import { ServiceTypes } from "./service.types";

export const NODE_SIZE = 120;

export const createNode = ({id, name, type, belongToIds, service, metadata }) => {
    return {
        id,
        name,
        type, 
        belongToIds,
        metadata,
        service,
    };
}

export const getNodes = (serviceDescriptions) => {
    let restAPINodes = [];
    let sharedDBNodes = [];
    let dbNodes = [];
    let topicNodes = [];
    let microserviceNodes = [];

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
            serivce: serviceDescription
        });

        microserviceNodes.push(microserviceNode);

        restAPINodes = restAPINodes.concat(getRestAPINodes(serviceDescription.restAPIs, microserviceId));
        sharedDBNodes = sharedDBNodes.concat(getSharedDBNodes(serviceDescription.sharedServices, microserviceId));
        dbNodes = dbNodes.concat(getDBNodes(serviceDescription.stores, microserviceId));
        topicNodes = topicNodes.concat(getTopicNodes(serviceDescription.produces, microserviceId));
    }

    restAPINodes = mergeRestAPINodes(restAPINodes);
    sharedDBNodes = mergeNodes(sharedDBNodes);
    dbNodes = mergeNodes(dbNodes);
    topicNodes = mergeNodes(topicNodes);

    return [
        ...microserviceNodes,
        ...restAPINodes,
        ...sharedDBNodes,
        ...dbNodes,
        ...topicNodes
    ];
}

function getRestAPINodes(restAPIs = [], parentId) {
    return restAPIs.map((restAPI) => {
        const method = restAPI.method.toLowerCase();
        const uri = restAPI.uri.toLowerCase();
        const id = validId(`${parentId}_${method}_${uri}`);

        return createNode({
            id,
            name: `${uri}`,
            type: ServiceTypes.RestAPI,
            belongToIds: [parentId],
            metadata: {
                description: restAPI.uri
            },
            service: restAPI
        });
    })
}

function getSharedDBNodes(sharedDBs = [], parentId) {
    return sharedDBs.map((sharedDB) => {
        const name = sharedDB.name.toLowerCase();
        const id = validId(`${parentId}_shareddb_${name}`);

        return createNode({
            id,
            name,
            type: ServiceTypes.SharedDB,
            belongToIds: [parentId],
            metadata: {
                description: name
            },
            service: sharedDB
        });
    });
}

function getDBNodes(dbs = [], parentId) {
    return dbs.map((db) => {
        const name = db.name.toLowerCase();
        const id = validId(`${parentId}_db_${name}`);

        return createNode({
            id,
            name,
            type: ServiceTypes.DB,
            belongToIds: [parentId],
            metadata: {
                description: name
            },
            service: db
        })
    });
}

function getTopicNodes(producers = [], parentId) {
    return producers.reduce((topicNodes, producer) => {
        const nodes = producer.topics.map((topic) => {
            const name = topic.toLowerCase();
            const id = validId(`${parentId}_${producer.name}_${name}`);

            return createNode({
                id,
                name,
                type: ServiceTypes.Topic,
                belongToIds: [parentId],
                metadata: {
                    description: name
                },
                service: topic
            })
        });
        return [...topicNodes, ...nodes];
    }, []);
}

function mergeRestAPINodes(nodes) {
    const mergedNodes = [];
    const nodeMap = new Map();

    for (const node of nodes) {
        const { name, belongToIds, type, service } = node;
        const key = validId(`${service.method}_${service.uri}`);

        if (nodeMap.has(key)) {
            const oldNode = nodeMap.get(key);
            oldNode.belongToIds = [...oldNode.belongToIds, ...belongToIds];
            oldNode.node = {...node};
            nodeMap.set(key, oldNode);
        } else {
            nodeMap.set(key, {
                belongToIds,
                node: {...node}
            });
        }
    }

    for (const value of nodeMap.values()) {
        const { belongToIds, node } = value;
        const key = validId(`${node.service.method}_${node.service.uri}`);
        const id = validId(`${belongToIds.join('_')}_${node.type}_${key}`);

        mergedNodes.push({
            ...node,
            id,
            belongToIds
        })
    }

    return mergedNodes;
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
