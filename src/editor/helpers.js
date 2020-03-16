const PIPE_RANGE_REGEX = /{{(\d+)}}/

export function buildRawDraftObject(content, pipes) {
  const result = { blocks: [], entityMap: {} }

  pipes.forEach(
    (pipe, index) =>
      (result.entityMap[index] = {
        type: 'PIPE_LINK',
        mutability: 'IMMUTABLE',
        data: pipe
      })
  )

  content.split(/\n/g).forEach(block => {
    let currentStr = block
    let offset
    const entityRanges = []

    while ((offset = currentStr.search(PIPE_RANGE_REGEX)) !== -1) {
      const pipeIndex = PIPE_RANGE_REGEX.exec(currentStr)[1]
      const entity = result.entityMap[pipeIndex]
      const pipeLabel = `${entity.data.questionLabel}.${entity.data.selector}`
      const entityLength = pipeLabel.length

      entityRanges.push({
        offset,
        length: entityLength,
        key: pipeIndex
      })

      currentStr = currentStr.replace(PIPE_RANGE_REGEX, pipeLabel)
    }

    result.blocks.push({
      type: 'unstyled',
      text: currentStr,
      entityRanges
    })
  })

  return result
}

export function buildStringFromDraftObject(draftObj) {
  const result = []

  draftObj.blocks.forEach(block => {
    let currentStr = block.text.split('')
    let currentOffset = 0

    block.entityRanges.forEach(range => {
      const replacement = `{{${range.key}}}`.split('')

      currentStr.splice(
        range.offset + currentOffset,
        range.length,
        ...replacement
      )

      currentOffset = currentOffset - range.length + replacement.length
    })

    result.push(currentStr.join(''))
  })

  return result.join('\n')
}
