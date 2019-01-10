export const SOURCE_ASSET_BASE_URI = '/assets/d3';

export function createConfigurationBuilder(builder, decorateBuilderFn) {
	return function (classnameOfBuilderNode) {
		// eslint-disable-next-line func-style
		const withContext = function (rootSelection, context) {
			let nodeRootGroup = rootSelection.select(`g.${classnameOfBuilderNode}`);

			if (nodeRootGroup.empty()) {
				nodeRootGroup = rootSelection.append('svg:g').attr('class', classnameOfBuilderNode);
			}
			decorateBuilderFn(builder);
			builder.context(context);
		  nodeRootGroup.call(builder);
		};

		withContext.getBuilder = function () {
			return builder;
		};

		return withContext;
	};
}