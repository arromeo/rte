import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Editor, EditorState } from 'draft-js'

const TextFieldContainer = styled.div`
    border: 2px solid blue;
    padding: 4px;
    width: 500px;
`

export function TextField() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    return (
        <Fragment>
            <button>Add Link</button>
            <TextFieldContainer>
                <Editor editorState={editorState} onChange={setEditorState} />
            </TextFieldContainer>
        </Fragment>
    )
}
