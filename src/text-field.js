import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { CompositeDecorator, Editor, EditorState, Modifier } from 'draft-js'

// Components
import { PipeLink } from './pipe-link'

const TextFieldContainer = styled.div`
  border: 2px solid blue;
  padding: 4px;
  width: 500px;
`

export function TextField() {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: PipeLink
    }
  ])

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  )

  function setEntityAtSelection() {
    const contentState = editorState.getCurrentContent()
    let newContentState = contentState.createEntity('LINK', 'IMMUTABLE', {
      url: 'http://google.com',
      label: 'Linky McLinkFace'
    })
    const entityKey = contentState.getLastCreatedEntityKey()
    const selectionState = editorState.getSelection()

    newContentState = Modifier.applyEntity(
      newContentState,
      selectionState,
      entityKey
    )

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'apply-entity'
    )

    setEditorState(newEditorState)
  }

  function getPosition() {
    console.log(editorState.getSelection().getStartOffset())
  }

  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    }, callback)
  }

  return (
    <Fragment>
      <button onClick={setEntityAtSelection}>Add Link</button>
      <button onClick={getPosition}>Get Position</button>
      <TextFieldContainer>
        <Editor editorState={editorState} onChange={setEditorState} />
      </TextFieldContainer>
    </Fragment>
  )
}
