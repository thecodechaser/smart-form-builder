import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import { loadFormData, handleDragEnd } from './store/formBuilderSlice'

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Load saved form data from localStorage
    dispatch(loadFormData())
  }, [dispatch])

  const onDragEnd = (result) => {
    // Pass the result object directly without wrapping it
    dispatch(handleDragEnd({ result }))
  }

  return (
    <Box className="app-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Layout />
      </DragDropContext>
    </Box>
  )
}

export default App