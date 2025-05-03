import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  addQuestion,
  addFollowUpQuestion,
} from '../../store/formBuilderSlice'

const AddQuestion = ({ question, option, openDialog, setOpenDialog, followUpQ  }) => {
  const dispatch = useDispatch()
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'objective' })
  
  const handleQuestionDialogClose = () => {
    setNewQuestion({ text: '', type: 'objective' })
    setOpenDialog(false)
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
  
  const handleQuestionSubmit = () => {
    const trimmedText = newQuestion.text.trim();
    if (!trimmedText) return;

    if (followUpQ && option?.id) {
      dispatch(addFollowUpQuestion({
        questionId: question.id,
        optionId: option.id,
        questionText: trimmedText,
        questionType: newQuestion.type
      }));
    } else {
      dispatch(addQuestion({
        questionText: trimmedText,
        questionType: newQuestion.type
      }));
    }
    handleQuestionDialogClose();
  };
  
  
  return (
      <Dialog open={openDialog} onClose={handleQuestionDialogClose}>
        <DialogTitle>Add {followUpQ ? 'Follow-up' : 'New'} Question</DialogTitle>
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
            {followUpQ ? 'Add Follow-up' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default AddQuestion