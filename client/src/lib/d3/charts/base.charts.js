export const createConfigurationBuilder = (builder, decorateBuilderFn) => (classnameOfBuilderNode) => {
  const withContext = (rootSelection, context) => {
    let nodeRootGroup = rootSelection.select(`g.${classnameOfBuilderNode}`)

    if (nodeRootGroup.empty()) {
      nodeRootGroup = rootSelection.insert('svg:g', 'g').attr('class', classnameOfBuilderNode)
    }
    decorateBuilderFn(builder)
    builder.context(context)
    nodeRootGroup.call(builder)
  }

  withContext.getBuilder = () => builder

  return withContext
}

export default { createConfigurationBuilder }
