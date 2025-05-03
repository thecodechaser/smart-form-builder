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
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
} from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  addOptionGroup,
  addFollowUpQuestion,
  removeFollowUp,
} from '../../store/formBuilderSlice'
import FollowUpQuestion from './FollowUpQuestion'

const OptionItem = ({ question, allQuestions }) => {
  const dispatch = useDispatch()
  const [optionDialog, setOptionDialog] = useState(false)
  const [optionsInput, setOptionsInput] = useState('')
  const [isMultiSelect, setIsMultiSelect] = useState(question.type === 'multi-select')
  const [followUpDialog, setFollowUpDialog] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [followUpText, setFollowUpText] = useState('')
  const [followUpType, setFollowUpType] = useState('objective')

  
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
    // setFollowUpDialog(true)
    // setFollowUpText('')
    // setFollowUpType('objective')
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
  
  return (

    <>
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
                          ) :
                            selectedOptionId == option.id ? (
                              <Button 
                              size="small" 
                              color="primary" 
                              startIcon={<RemoveIcon />}
                              onClick={() => setSelectedOptionId(null)}
                            >
                              Close Follow-up
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
                      {(option.id === selectedOptionId || option.followUpId) && (
                        <FollowUpQuestion question={question} option={option} allQuestions={allQuestions} />
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
                          )
                          :
                            selectedOptionId == option.id ? (
                            <Button 
                              size="small" 
                              color="primary" 
                              startIcon={<RemoveIcon />}
                              onClick={() => setSelectedOptionId(null)}
                            >
                              Close Follow-up
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
                      {(option.id === selectedOptionId || option.followUpId) && (
                       <FollowUpQuestion question={question} option={option} allQuestions={allQuestions} />
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
      </>
  )
}

export default OptionItem