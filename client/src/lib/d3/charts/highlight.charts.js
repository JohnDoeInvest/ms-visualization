import * as d3 from 'd3'

export function buildHighlight(rootLinkClass, selectedRootId) {
    const rootLink = d3.select(`.${rootLinkClass}`);
    if (!rootLink.empty()) {
        const links = rootLink.selectAll('.link');
        links.classed('highlight', d => d.belongToId === selectedRootId);
        links.select('path').attr('marker-end', d => d.belongToId === selectedRootId ? 'url(#arrow-marker-highlight)' : 'url(#arrow-marker)');
    }
}
