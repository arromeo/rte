import React, { Fragment, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  CompositeDecorator,
  Editor,
  EditorState,
  Entity,
  Modifier
} from 'draft-js'

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
  const [focus, setFocus] = useState(null)

  const editorRef = useRef(null)

  useEffect(() => {
    editorRef && console.log(editorRef.current) && setFocus(editorRef.current.focus)
  }, [editorRef])

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

  function insertPlacehold(label, meta) {
    const currentContent = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    const entityKey = Entity.create('LINK', 'IMMUTABLE', {meta})
    const textWithEntity = Modifier.insertText(
      currentContent,
      selection,
      label,
      null,
      entityKey
    )

    const newEditorState = EditorState.push(
      editorState,
      textWithEntity,
      'insert-characters'
    )

    setEditorState(newEditorState)
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
      <button onClick={setEntityAtSelection}>Add Link to Selection</button>
      <button onClick={() => insertPlacehold('{{empty pipe}}', 'meta')}>Insert Placeholder</button>
      <TextFieldContainer>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
        />
      </TextFieldContainer>
    </Fragment>
  )
}
