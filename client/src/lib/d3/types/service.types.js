export const ServiceTypes = {
	Microservice: 'Microservice',
	Topic: 'Topic',
	Store: 'Store',
	RestAPI: 'RestAPI',
	SharedService: 'SharedService'
}

export const ServiceIconNames = {
    Microservice: 'icn-service.svg',
    RestAPI: {
        Get: 'icn-get.svg',
        Post: 'icn-post.svg',
        Delete: 'icn-delete.svg',
    },
    Topic: {
        Kafka: 'icn-kafka.svg'
    },
    Store: 'icn-db.svg',
    SharedService: 'icn-db.svg'
}

export class ServiceNode {
	constructor({
        id, name, type, isGroup, belongToIds,
        metadata: { description, icon, isHighlighted }
    }) {
		this.id = id;
		this.name = name;
		this.type = type;
        this.isGroup = isGroup;
        this.belongToIds = belongToIds;
		this.metadata = { description, icon, isHighlighted };
		this.size = undefined;
        this.children = [];
	}

	setSize(size) {
        this.size = size || this.size;
        return this;
    }

    setHighlight(isHighlighted) {
        this.metadata.isHighlighted = isHighlighted;
        return this;
    }
    
	addNodesToChildren(nodes) {
        this.children = [...this.children, ...nodes];
        return this;
	}
}

/**
 * 
 */
export class ServiceLink {
    /**
     * @constructor
     * @param {{source: ServiceNode, target: ServiceNode, belongToId: string }} 
     */
    constructor({ source, target, belongToId }) {
        this.source = source;
        this.target = target;
        this.belongToId = belongToId;
    }
}