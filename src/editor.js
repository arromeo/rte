import React, { Component } from 'react'
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  Editor,
  EditorState,
  Modifier
} from 'draft-js'

const rawContent = {
  blocks: [
    {
      text:
        'This is an "immutable" entity: Superman. Deleting any ' +
        'characters will delete the entire entity. Adding characters ' +
        'will remove the entity from the range.',
      type: 'unstyled',
      entityRanges: [
        {
          offset: 31,
          length: 8,
          key: 'first'
        }
      ]
    },
    {
      text: '',
      type: 'unstyled'
    },
    {
      text:
        'This is a "mutable" entity: Batman. Characters may be added ' +
        'and removed.',
      type: 'unstyled',
      entityRanges: [
        {
          offset: 28,
          length: 6,
          key: 'second'
        }
      ]
    },
    {
      text: '',
      type: 'unstyled'
    },
    {
      text:
        'This is a "segmented" entity: Green Lantern. Deleting any ' +
        'characters will delete the current "segment" from the range. ' +
        'Adding characters will remove the entire entity from the range.',
      type: 'unstyled',
      entityRanges: [
        {
          offset: 30,
          length: 13,
          key: 'third'
        }
      ]
    }
  ],
  entityMap: {
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE'
    },
    second: {
      type: 'TOKEN',
      mutability: 'MUTABLE'
    },
    third: {
      type: 'TOKEN',
      mutability: 'SEGMENTED'
    }
  }
}

export default class EntityEditorExample extends Component {
  constructor(props) {
    super(props)
    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      },
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan
      },
      {
        strategy: getEntityStrategy('SEGMENTED'),
        component: TokenSpan
      }
    ])
    const blocks = convertFromRaw(rawContent)
    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator)
    }

    this.focus = () => this.refs.editor.focus()
    this.onChange = editorState => this.setState({ editorState })
  }

  setEntityAtSelection = ({ type, mutability, data }) => {
    const contentstate = this.editorState.getCurrentContent()
    let newContentState = contentstate.createEntity(type, mutability, {
      url: data
    })
    const entityKey = contentstate.getLastCreatedEntityKey()
    const selectionState = this.state.editorState.getSelection()

    newContentState = Modifier.applyEntity(
      newContentState,
      selectionState,
      entityKey
    )

    const newEditorState = EditorState.push(
      this.state.editorState,
      newContentState,
      'apply-entity'
    )

    this.setState({ editorState: newEditorState })
  }

  render() {
    return (
      <div>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
          />
        </div>
      </div>
    )
  }
}

function getEntityStrategy(mutability) {
  return function(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      if (entityKey === null) {
        return false
      }
      return contentState.getEntity(entityKey).getMutability() === mutability
    }, callback)
  }
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE':
      return styles.immutable
    case 'MUTABLE':
      return styles.mutable
    case 'SEGMENTED':
      return styles.segmented
    default:
      return null
  }
}

const TokenSpan = props => {
  const style = getDecoratedStyle(
    props.contentState.getEntity(props.entityKey).getMutability()
  )
  return (
    <span data-offset-key={props.offsetkey} style={style}>
      {props.children}
    </span>
  )
}

const styles = {
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  immutable: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 0'
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0'
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0'
  }
}
