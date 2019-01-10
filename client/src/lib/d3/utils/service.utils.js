import { ServiceNode } from '../types/node.types';
import { ServiceTypes } from '../types/service.types';

export const SOURCE_ASSET_BASE_URI = '/assets/d3';


function createServiceDescriptionNode(serviceDescriptionArr) {
    let microservices = [];
    let restAPIs = [];
    let topics = [];
    let sharedServices = [];
    let stores = [];

    microservices = serviceDescriptionArr.map((service) => ({

    }))


    return Object.freeze({
        microservices,
        restAPIs,
        topics,
        sharedServices,
        stores
    });
}


/**
 * 
 * @param {*} microservice 
 * @returns {ServiceNode} serviceNode
 */
function parseMicroserviceToServiceNode (microservice) {
    const id = microservice.name;
    const name = microservice.name;
    const type = ServiceTypes.Microservice;
    const description = microservice.description;
    const icon = 
    
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
    })
} 