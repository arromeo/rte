import React, { Fragment, useState } from 'react'
import styled from 'styled-components'

// Components
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

const DecoratedPipeLink = styled.span`
  background-color: tan;
  margin-left: 1px;
  margin-right: 1px;

  &:hover {
    background-color: pink;
    cursor: pointer;
  }
`

export function PipeLink({ contentState, entityKey, children, offsetKey }) {
  const { pipeId } = contentState.getEntity(entityKey).getData()
  const [dialogOpen, setDialogOpen] = useState(false)

  const openDialog = () => setDialogOpen(true)
  const closeDialog = () => setDialogOpen(false)

  function handleClick() {
    openDialog()
  }

  return (
    <Fragment>
      <DecoratedPipeLink onClick={handleClick} data-offset-key={offsetKey}>
        {children}
      </DecoratedPipeLink>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Pipe Modal</DialogTitle>
        <DialogContent>This is the dialog for pipe id: {pipeId}</DialogContent>
      </Dialog>
    </Fragment>
  )
}
