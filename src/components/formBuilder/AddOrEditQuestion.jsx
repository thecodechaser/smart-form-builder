import { useState, useEffect } from 'react'
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
  updateQuestion,
  addQuestion,
  addFollowUpQuestion,
} from '../../store/formBuilderSlice'

const AddOrEditQuestion = ({ editMode = false, editQuestion, parentQuestion, option, openDialog, setOpenDialog, followUpQ  }) => {
  const dispatch = useDispatch()
  const [question, setQuestion] = useState({ text: '', type: 'objective' })

  useEffect(() => {
    if (editMode && editQuestion) {
      setQuestion({
        text: editQuestion.text || '',
        type: editQuestion.type || 'objective',
      });
    }
  }, [editMode, editQuestion]);
  
  const handleQuestionDialogClose = () => {
    setQuestion({ text: '', type: 'objective' })
    setOpenDialog(false)
  }
  
  const handleQuestionChange = (e) => {
    setQuestion({
      ...question,
      text: e.target.value
    })
  }
  
  const handleQuestionTypeChange = (e) => {
    setQuestion({
      ...question,
      type: e.target.value
    })
  }
  
  const handleQuestionSubmit = () => {
    const trimmedText = question.text.trim();
    if (!trimmedText) return;

    if(editMode) {
      dispatch(updateQuestion(
        {
          questionId: editQuestion.id,
          questionText: trimmedText,
          questionType: question.type
        }
      ))
    } else if (followUpQ && option?.id) {
      dispatch(addFollowUpQuestion({
        questionId: parentQuestion.id,
        optionId: option.id,
        questionText: trimmedText,
        questionType: question.type
      }));
    } else {
      dispatch(addQuestion({
        questionText: trimmedText,
        questionType: question.type
      }));
    }
    handleQuestionDialogClose();
  };
  
  
  return (
      <Dialog open={openDialog} onClose={handleQuestionDialogClose}>
        <DialogTitle>{editMode ? 'Edit' : 'Add'} {followUpQ ? 'Follow-up' : 'New'} Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={question.text}
            onChange={handleQuestionChange}
            sx={{ mt: 1, mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={question.type}
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
           {editMode ? 'Save': 'Add'} {followUpQ ? 'Follow-up' : 'Question'}
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default AddOrEditQuestion