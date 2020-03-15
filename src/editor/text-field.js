import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import {
  CompositeDecorator,
  Editor,
  EditorState,
  Entity,
  Modifier
} from 'draft-js'
import { v4 as uuid } from 'uuid'

// Components
import { PipeLink } from './pipe-link'

// Strategies
import { pipeLinkStrategy } from './strategies'

const TextFieldContainer = styled.div`
  border: 1px solid blue;
  padding: 4px;
  margin-top: 2px;
  width: 500px;
`

const Button = styled.button`
  margin-right: 2px;
`

export function TextField() {
  const decorators = new CompositeDecorator([
    {
      strategy: pipeLinkStrategy,
      component: PipeLink
    }
  ])

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorators)
  )

  function handleEditorChange(newEditorState) {
    setEditorState(newEditorState)
  }

  function selectionToEntity(linkType, mutability, metadata) {
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    contentState.createEntity(linkType, mutability, metadata)

    const newEntityKey = contentState.getLastCreatedEntityKey()

    const newContentState = Modifier.applyEntity(
      contentState,
      selection,
      newEntityKey
    )

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'apply-entity'
    )

    setEditorState(newEditorState)
  }

  function insertEntity(linkType, mutability, label, metadata) {
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    contentState.createEntity(linkType, mutability, metadata)

    const newEntityKey = contentState.getLastCreatedEntityKey()

    const newContentState = Modifier.insertText(
      contentState,
      selection,
      label,
      null,
      newEntityKey
    )

    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    )

    newEditorState = EditorState.moveFocusToEnd(newEditorState)
    setEditorState(newEditorState)
  }

  function handlePipeInsert() {
    return insertEntity('PIPE_LINK', 'IMMUTABLE', '{{pipe}}', {
      pipeId: uuid()
    })
  }

  function handlePipeSelection() {
    return selectionToEntity('PIPE_LINK', 'IMMUTABLE', { pipeId: uuid() })
  }

  return (
    <Fragment>
      <Button onClick={handlePipeSelection}>Add Link to Selection</Button>
      <Button onClick={handlePipeInsert}>Insert Placeholder</Button>
      <TextFieldContainer>
        <Editor editorState={editorState} onChange={handleEditorChange} />
      </TextFieldContainer>
    </Fragment>
  )
}
