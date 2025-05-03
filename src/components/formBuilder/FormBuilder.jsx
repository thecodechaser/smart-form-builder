import { useSelector, useDispatch } from 'react-redux'
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  IconButton, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOptionGroup,
  updateOption,
  addFollowUpQuestion,
  removeFollowUp
} from '../../store/formBuilderSlice'
import QuestionComponent from '../QuestionComponent'

const FormBuilder = () => {
  const dispatch = useDispatch()
  const { questions, activeQuestion } = useSelector(state => state.formBuilder)
  const [questionDialog, setQuestionDialog] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'objective' })
  
  const handleAddQuestion = () => {
    setQuestionDialog(true)
  }
  
  const handleQuestionDialogClose = () => {
    setQuestionDialog(false)
    setNewQuestion({ text: '', type: 'objective' })
  }
  
  const handleQuestionSubmit = () => {
    if (newQuestion.text.trim()) {
      dispatch(addQuestion({ 
        questionText: newQuestion.text, 
        questionType: newQuestion.type 
      }))
      handleQuestionDialogClose()
    }
  }
  
  const handleQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      text: e.target.value
    })
  }
  
  const handleQuestionTypeChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      type: e.target.value
    })
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Form Builder</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </Box>

      {(
              questions.map((question, index) => (
                <QuestionComponent 
                  key={question.id} 
                  question={question} 
                  index={index}
                  isActive={activeQuestion === question.id}
                  allQuestions={questions}
                />
              ))
            )}
      
      <Droppable droppableId={`formBuilder-${uuidv4()}`}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ 
              minHeight: '70vh',
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(0,0,0,0.03)'
            }}
          >
            <Box 
              className="drag-placeholder"
              onClick={handleAddQuestion}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 2,
                p: 3
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" color="primary">
                Click here or drag a question from the bank to add
              </Typography>
            </Box>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      
      {/* Add Question Dialog */}
      <Dialog open={questionDialog} onClose={handleQuestionDialogClose}>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={newQuestion.text}
            onChange={handleQuestionChange}
            sx={{ mt: 1, mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={newQuestion.type}
              onChange={handleQuestionTypeChange}
              label="Question Type"
            >
              <MenuItem value="objective">Objective (Single Choice)</MenuItem>
              <MenuItem value="multi-select">Multi-Select</MenuItem>
              <MenuItem value="subjective">Subjective (Text Answer)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuestionDialogClose}>Cancel</Button>
          <Button onClick={handleQuestionSubmit} variant="contained" color="primary">
            Add Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FormBuilder