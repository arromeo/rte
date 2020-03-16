import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import {
  CompositeDecorator,
  convertFromRaw,
  Editor,
  EditorState,
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

const data = {
  blocks: [
    {
      type: 'unstyled',
      text:
        'This is a Question1.selected pipe and a AgeQuestion.unselected pipe',
      entityRanges: [
        {
          offset: 10,
          length: 18,
          key: '0'
        },
        {
          offset: 40,
          length: 22,
          key: '1'
        }
      ]
    }
  ],
  entityMap: {
    '0': {
      type: 'PIPE_LINK',
      mutability: 'IMMUTABLE',
      data: {
        pipeId: '3',
        questionLabel: 'Question1',
        selector: 'selected'
      }
    },
    '1': {
      type: 'PIPE_LINK',
      mutability: 'IMMUTABLE',
      data: {
        pipeId: '452',
        questionLabel: 'AgeQuestion',
        selector: 'unselected'
      }
    }
  }
}

export function TextField() {
  const decorators = new CompositeDecorator([
    {
      strategy: pipeLinkStrategy,
      component: PipeLink
    }
  ])

  const blocks = convertFromRaw(data)

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(blocks, decorators)
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
