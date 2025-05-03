import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
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
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Collapse
} from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import {
  updateQuestion,
  deleteQuestion,
  addOptionGroup,
  updateOption,
  addFollowUpQuestion,
  removeFollowUp,
  setActiveQuestion
} from '../store/formBuilderSlice'

const QuestionComponent = ({ question, index, isActive, allQuestions }) => {
  const dispatch = useDispatch()
  const [editMode, setEditMode] = useState(false)
  const [editedText, setEditedText] = useState(question.text)
  const [editedType, setEditedType] = useState(question.type)
  const [optionDialog, setOptionDialog] = useState(false)
  const [optionsInput, setOptionsInput] = useState('')
  const [isMultiSelect, setIsMultiSelect] = useState(question.type === 'multi-select')
  const [followUpDialog, setFollowUpDialog] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [followUpText, setFollowUpText] = useState('')
  const [followUpType, setFollowUpType] = useState('objective')
  
  const handleEdit = () => {
    setEditMode(true)
    setEditedText(question.text)
    setEditedType(question.type)
  }
  
  const handleDelete = () => {
    dispatch(deleteQuestion({ id: question.id }))
  }
  
  const handleSaveEdit = () => {
    if (editedText.trim()) {
      dispatch(updateQuestion({
        id: question.id,
        text: editedText,
        type: editedType
      }))
      setEditMode(false)
    }
  }
  
  const handleCancelEdit = () => {
    setEditMode(false)
  }
  
  const handleTextChange = (e) => {
    setEditedText(e.target.value)
  }
  
  const handleTypeChange = (e) => {
    setEditedType(e.target.value)
  }
  
  const handleAddOptions = () => {
    setOptionDialog(true)
  }
  
  const handleOptionDialogClose = () => {
    setOptionDialog(false)
    setOptionsInput('')
    setIsMultiSelect(question.type === 'multi-select')
  }
  
  const handleOptionsInputChange = (e) => {
    setOptionsInput(e.target.value)
  }
  
  const handleIsMultiSelectChange = (e) => {
    setIsMultiSelect(e.target.checked)
  }
  
  const handleOptionSubmit = () => {
    if (optionsInput.trim()) {
      const options = optionsInput.split('\n').filter(opt => opt.trim())
      if (options.length > 0) {
        dispatch(addOptionGroup({
          questionId: question.id,
          options,
          isMultiSelect
        }))
        handleOptionDialogClose()
      }
    }
  }
  
  const handleAddFollowUp = (optionId) => {
    setSelectedOptionId(optionId)
    setFollowUpDialog(true)
    setFollowUpText('')
    setFollowUpType('objective')
  }
  
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
    if (followUpText.trim() && selectedOptionId) {
      dispatch(addFollowUpQuestion({
        questionId: question.id,
        optionId: selectedOptionId,
        followUpText,
        followUpType
      }))
      handleFollowUpDialogClose()
    }
  }
  
  const handleRemoveFollowUp = (optionId) => {
    dispatch(removeFollowUp({
      questionId: question.id,
      optionId
    }))
  }
  
  const handleQuestionClick = () => {
    dispatch(setActiveQuestion(question.id))
  }
  
  // Find follow-up questions for options
  const getFollowUpQuestion = (followUpId) => {
    return allQuestions.find(q => q.id === followUpId)
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
          
          {editMode ? (
            <TextField
              autoFocus
              value={editedText}
              onChange={handleTextChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
          ) : (
            <Typography variant="h6">
              {question.text}
            </Typography>
          )}
        </Box>
        
        <Box>
          {editMode ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={editedType}
                  onChange={handleTypeChange}
                  label="Question Type"
                >
                  <MenuItem value="objective">Objective (Single Choice)</MenuItem>
                  <MenuItem value="multi-select">Multi-Select</MenuItem>
                  <MenuItem value="subjective">Subjective (Text Answer)</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleSaveEdit}
                size="small"
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleCancelEdit}
                size="small"
              >
                Cancel
              </Button>
            </Box>
          ) : (
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
          )}
        </Box>
      </Box>

      {/* Options Section */}
      {question.type !== 'subjective' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Options:
          </Typography>
          
          {question.options.length === 0 ? (
            <Droppable droppableId={`question-${question.id}`}>
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="drag-placeholder"
                  onClick={handleAddOptions}
                  sx={{
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: 'primary.light',
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)'
                  }}
                >
                  <Typography>
                    Click here or drag option groups from the bank
                  </Typography>
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ) : (
            <Box sx={{ mt: 2 }}>
              {question.type === 'objective' ? (
                <RadioGroup>
                  {question.options.map(option => (
                    <Box key={option.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          value={option.id}
                          control={<Radio />}
                          label={option.text}
                          disabled
                        />
                        <Box sx={{ ml: 'auto', display: 'flex' }}>
                          {option.followUpId ? (
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveFollowUp(option.id)}
                            >
                              Remove Follow-up
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              color="primary" 
                              startIcon={<AddIcon />}
                              onClick={() => handleAddFollowUp(option.id)}
                            >
                              Add Follow-up
                            </Button>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Follow-up Question */}
                      {option.followUpId && (
                        <Box className="follow-up" sx={{ ml: 4, pl: 2, borderLeft: '2px solid', borderColor: 'primary.light' }}>
                          <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                            Follow-up Question:
                          </Typography>
                          
                          {(() => {
                            const followUpQuestion = getFollowUpQuestion(option.followUpId)
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
                      )}
                    </Box>
                  ))}
                </RadioGroup>
              ) : (
                <FormGroup>
                  {question.options.map(option => (
                    <Box key={option.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={option.text}
                          disabled
                        />
                        <Box sx={{ ml: 'auto', display: 'flex' }}>
                          {option.followUpId ? (
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveFollowUp(option.id)}
                            >
                              Remove Follow-up
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              color="primary" 
                              startIcon={<AddIcon />}
                              onClick={() => handleAddFollowUp(option.id)}
                            >
                              Add Follow-up
                            </Button>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Follow-up Question */}
                      {option.followUpId && (
                        <Box className="follow-up" sx={{ ml: 4, pl: 2, borderLeft: '2px solid', borderColor: 'primary.light' }}>
                          <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                            Follow-up Question:
                          </Typography>
                          
                          {(() => {
                            const followUpQuestion = getFollowUpQuestion(option.followUpId)
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
                      )}
                    </Box>
                  ))}
                </FormGroup>
              )}
            </Box>
          )}
        </Box>
      )}
      
      {/* Subjective Question */}
      {question.type === 'subjective' && (
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Text answer will appear here"
            disabled
            multiline
            rows={3}
          />
        </Box>
      )}
      
      {/* Add Options Dialog */}
      <Dialog open={optionDialog} onClose={handleOptionDialogClose}>
        <DialogTitle>Add Options</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter each option on a new line
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Options"
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            value={optionsInput}
            onChange={handleOptionsInputChange}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={isMultiSelect}
                onChange={handleIsMultiSelectChange}
              />
            }
            label="Allow multiple options to be selected"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOptionDialogClose}>Cancel</Button>
          <Button onClick={handleOptionSubmit} variant="contained" color="primary">
            Add Options
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </Paper>
  )
}

export default QuestionComponent