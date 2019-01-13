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
