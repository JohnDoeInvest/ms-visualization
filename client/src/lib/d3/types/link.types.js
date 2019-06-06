import { ServiceTypes } from "./service.types";

export const createLink = ({ source, target, sourceNode, targetNode, belongToId }) => {
    return {
        source,
        target,
        sourceNode,
        targetNode,
        belongToId,
    }
}

export const getLinks = (nodes) => {
    let restAPILinks = [];
    let dbLinks = [];
    let topicLinks = [];

    const nodesMap = new Map();
    for (const node of nodes) {
        nodesMap.set(node.id, node);
    }

    for (const node of nodes) {
        const { id, type, belongToIds } = node;
        if (type === ServiceTypes.RestAPI) {
            let newRestLinks = belongToIds.map((parentId) => ({
                source: id,
                target: parentId,
                belongToId: parentId,
                sourceNode: node,
                targetNode: nodesMap.get(parentId)
            }));

            restAPILinks = restAPILinks.concat(newRestLinks);

        } else if (type === ServiceTypes.SharedDB || type === ServiceTypes.DB) {
            let newLinks = belongToIds.map((parentId) => ({
                source: parentId,
                target: id,
                belongToId: parentId,
                sourceNode: nodesMap.get(parentId),
                targetNode: node
            }));

            dbLinks = dbLinks.concat(newLinks);

        } else if (type === ServiceTypes.Topic) {
            let newTopicLinks = [];
            for (const parentId of belongToIds) {
                const outIncLinks = [
                    {
                        source: parentId,
                        target: id,
                        belongToId: parentId,
                        sourceNode: nodesMap.get(parentId),
                        targetNode: node
                    },
                    {
                        source: id,
                        target: parentId,
                        belongToId: parentId,
                        sourceNode: node,
                        targetNode: nodesMap.get(parentId)
                    }
                ];

                newTopicLinks = newTopicLinks.concat(outIncLinks);
            }

            topicLinks = topicLinks.concat(newTopicLinks);
        }
    }

    return [
        ...restAPILinks,
        ...dbLinks,
        ...topicLinks
    ];
}