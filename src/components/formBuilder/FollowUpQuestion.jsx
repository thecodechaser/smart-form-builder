import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { 
  Box, 
  Typography,  
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
  addFollowUpQuestion,
} from '../../store/formBuilderSlice'
import { Droppable } from 'react-beautiful-dnd'
import {v4 as uuidv4} from 'uuid'
import AddIcon from '@mui/icons-material/Add'

const FollowUpQuestion = ({ question, option, allQuestions }) => {
  const dispatch = useDispatch()
  const [followUpDialog, setFollowUpDialog] = useState(false)
  const [followUpText, setFollowUpText] = useState('')
  const [followUpType, setFollowUpType] = useState('objective')
  
  const handleFollowUpDialogClose = () => {
    setFollowUpDialog(false)
    setSelectedOptionId(null)
  }
  
  const handleFollowUpTextChange = (e) => {
    setFollowUpText(e.target.value)
  }
  
  const handleFollowUpTypeChange = (e) => {
    setFollowUpType(e.target.value)
  }
  
  const handleFollowUpSubmit = () => {
    if (followUpText.trim() && option.id) {
      dispatch(addFollowUpQuestion({
        questionId: question.id,
        optionId: option.id,
        followUpText,
        followUpType
      }))
      handleFollowUpDialogClose()
    }
  }
  
  
  // Find follow-up questions for options
  const getFollowUpQuestion = (followUpId) => {
    return allQuestions.find(q => q.id === followUpId)
  }
  
  return (

    <>
     
     <Box>
      
      <Droppable droppableId={`formBuilder-followUp-${question.id}<=>${option.id}`}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ 
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(0,0,0,0.03)'
            }}
          >
             {/* {(
              questions.map((question, index) => (
                <QuestionComponent 
                  key={question.id} 
                  question={question} 
                  index={index}
                  isActive={activeQuestion === question.id}
                  allQuestions={questions}
                />
              ))
            )} */}
            <Box 
              className="drag-placeholder"
              // onClick={handleAddQuestion}
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
      
    </Box>
                      
                      {/* Follow-up Question */}
                      
                        <Box className="follow-up" sx={{ ml: 4, pl: 2, borderLeft: '2px solid', borderColor: 'primary.light' }}>
                          <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                            Follow-up Question:
                          </Typography>
                          
                          {(() => {
                            const followUpQuestion = getFollowUpQuestion(option.followUpId)
                            console.log(option)
                            if (!followUpQuestion) return null
                            
                            return (
                              <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
                                <Typography variant="body1">
                                  {followUpQuestion.text}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  backgroundColor: 'rgba(0,0,0,0.07)', 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1,
                                  display: 'inline-block',
                                  mt: 1
                                }}>
                                  {followUpQuestion.type === 'objective' ? 'Single Choice' : 
                                   followUpQuestion.type === 'multi-select' ? 'Multiple Choice' : 'Text Answer'}
                                </Typography>
                              </Box>
                            )
                          })()}
                        </Box>
                      
                    
     
      
      {/* Add Follow-up Question Dialog */}
      <Dialog open={followUpDialog} onClose={handleFollowUpDialogClose}>
        <DialogTitle>Add Follow-up Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Follow-up Question Text"
            fullWidth
            variant="outlined"
            value={followUpText}
            onChange={handleFollowUpTextChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={followUpType}
              onChange={handleFollowUpTypeChange}
              label="Question Type"
            >
              <MenuItem value="objective">Objective (Single Choice)</MenuItem>
              <MenuItem value="multi-select">Multi-Select</MenuItem>
              <MenuItem value="subjective">Subjective (Text Answer)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFollowUpDialogClose}>Cancel</Button>
          <Button onClick={handleFollowUpSubmit} variant="contained" color="primary">
            Add Follow-up
          </Button>
        </DialogActions>
      </Dialog>
      </>
  )
}

export default FollowUpQuestion