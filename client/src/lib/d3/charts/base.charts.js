export function createConfigurationBuilder (builder, decorateBuilderFn) {
  return function (classnameOfBuilderNode) {
    // eslint-disable-next-line func-style
    const withContext = function (rootSelection, context) {
      let nodeRootGroup = rootSelection.select(`g.${classnameOfBuilderNode}`)

      if (nodeRootGroup.empty()) {
        nodeRootGroup = rootSelection.insert('svg:g', 'g').attr('class', classnameOfBuilderNode)
      }
      decorateBuilderFn(builder)
      builder.context(context)
      nodeRootGroup.call(builder)
    }

    withContext.getBuilder = function () {
      return builder
    }

    return withContext
  }
}
