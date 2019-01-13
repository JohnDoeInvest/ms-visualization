
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
