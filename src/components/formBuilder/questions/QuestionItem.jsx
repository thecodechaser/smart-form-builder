import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  deleteQuestion,
  setActiveQuestion
} from '../../../store/formBuilderSlice'
import OptionItem from '../options/OptionItem'
import AddOrEditQuestion from './AddOrEditQuestion'

const QuestionItem = ({ question, index, isActive }) => {
  const dispatch = useDispatch()
  const [editMode, setEditMode] = useState(false)
  
  const handleEdit = () => {
    setEditMode(true)
  }
  
  const handleDelete = () => {
    dispatch(deleteQuestion({ id: question.id }))
  }
  
  
  const handleQuestionClick = () => {
    dispatch(setActiveQuestion(question.id))
  }
  
  return (
    <Paper 
      elevation={isActive ? 3 : 1} 
      className={`question-card ${isActive ? 'active' : ''}`}
      onClick={handleQuestionClick}
      sx={{ 
        mb: 3,
        border: isActive ? '2px solid' : 'none',
        borderColor: 'primary.main',
        p: 3,
        transition: 'all 0.2s ease'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 32,
              height: 32, 
              borderRadius: '50%', 
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              fontWeight: 'bold'
            }}
          >
            {index + 1}
          </Box>
          
          
            <Typography variant="h6">
              {question.text}
            </Typography>
          
        </Box>
        
        <Box>
          
              <Typography variant="caption" sx={{ 
                backgroundColor: 'rgba(0,0,0,0.07)', 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                mr: 2
              }}>
                {question.type === 'objective' ? 'Single Choice' : 
                 question.type === 'multi-select' ? 'Multiple Choice' : 'Text Answer'}
              </Typography>
              <IconButton size="small" onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            
          
        </Box>
      </Box>

      <OptionItem question={question} />
      <AddOrEditQuestion
      editMode={editMode}
      editQuestion={question}
      openDialog={editMode} 
      setOpenDialog={setEditMode} />
    </Paper>
  )
}

export default QuestionItem