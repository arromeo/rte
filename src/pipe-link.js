import React from 'react'
import styled from 'styled-components'

const DecoratedPipeLink = styled.span`
  background-color: tan;

  &:hover {
    background-color: pink;
    cursor: pointer;
  }
`

export function PipeLink({ contentState, entityKey, children, ...otherProps }) {
  const { label } = contentState.getEntity(entityKey).getData()
  console.log(otherProps)
  return (
    <DecoratedPipeLink data-offset-key={otherProps.offsetKey}>
      {children}
    </DecoratedPipeLink>
  )
}
