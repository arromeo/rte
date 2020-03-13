import React from 'react'
import styled from 'styled-components'

const DecoratedPipeLink = styled.span`
  background-color: tan;

  // &:hover {
  //   background-color: pink;
  //   cursor: pointer;
  // }
`

export function PipeLink({ contentState, entityKey, ...otherProps }) {
  const { label } = contentState.getEntity(entityKey).getData()
  return <DecoratedPipeLink>{label}</DecoratedPipeLink>
}
