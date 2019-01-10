import { ServiceTypes, ServiceNode } from '../types/service.types';
import { getMicroserviceIcon, getRestAPIIcon } from './base.utils';

function parseMicroserviceToServiceNode (microservice) {
    const id = microservice.name;
    const name = microservice.name;
    const type = ServiceTypes.Microservice;
    const description = microservice.description;
    const icon = getMicroserviceIcon(microservice);

    
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
        },
    })
} 

/**
 * 
 * @param {*} restAPI 
 * {
        "uri": "/movies",
        "method": "POST",
        "parameters": {
          "ssid": "string with Swedish social security number"
        }
    }
 */

function parseRestAPIToServiceNode (restAPI) {
    const { uri, method } = restAPI;
    const id = ServiceTypes.RestAPI.toLowerCase() + '_' + method.toLowerCase() + '_' + uri.toLowerCase();
    const name = uri;
    const type = ServiceTypes.RestAPI;
    const description = microservice.description;
    const icon = getRestAPIIcon(restAPI);
    
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
        },
    })
}

/**
 * {
        "name": "kafka",
        "topics": ["clientrequests", "authenticate-bankid"]
    }
 * @param {*} topic 
 */

// function parseTopicToServiceNode (topic) {
//     const { name,  } = topic;
//     const id = method.toLowerCase() + '_' + uri.toLowerCase();
//     const name = uri;
//     const type = ServiceTypes.RestAPI;
//     const description = microservice.description;
//     const icon = getRestAPIIcon(restAPI);
    
//     return new ServiceNode({
//         id,
//         name,
//         type,
//         isGroup: false,
//         metadata: {
//             description,
//             isHighlighted: false,
//             belongToId: id,
//             icon
//         },
//     })
// }

