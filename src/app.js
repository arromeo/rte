import React from 'react'

// Components
import { TextField } from './editor/text-field'

// Data
import { pipeableQuestions } from './data'

function App() {
  return <TextField pipeableQuestions={pipeableQuestions} />
}

export default App
