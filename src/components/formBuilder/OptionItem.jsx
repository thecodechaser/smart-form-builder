import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Box, 
  Typography,  
  TextField, 
  Button,
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
  removeFollowUp,
  removeOptionGroup
} from '../../store/formBuilderSlice'
import FollowUpQuestion from './FollowUpQuestion'
import AddOption from './AddOption'

const OptionItem = ({ question, followUpOption }) => {
  const dispatch = useDispatch()
  const [optionDialog, setOptionDialog] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  
  const handleAddOptions = () => {
    setOptionDialog(true)
  }
  
  const handleAddFollowUp = (optionId) => {
    setSelectedOptionId(optionId)
  }
  
  const handleRemoveFollowUp = (optionId) => {
    dispatch(removeFollowUp({
      questionId: question.id,
      optionId
    }))
  }

  const handleRemoveOption = () => {  
    dispatch(removeOptionGroup({
      questionId: question.id,
      
    }))
  }
  
  return (
    <>
      {/* Options Section */}
      {question.type !== 'subjective' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Options:  {
              question.options.length > 0 && (
              <Button 
                                size="small" 
                                color="error" 
                                onClick={() => handleRemoveOption()}
                              >
                                Remove Option
                              </Button>)
}
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
                        
                        {
                          !followUpOption && (
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
                          )
                        }
                      </Box>
                      
                      {/* Follow-up Question */}
                      {(option.id === selectedOptionId || option.followUpId) && (
                        <FollowUpQuestion question={question} option={option} />
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

                        {
                          !followUpOption && (
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
                          )
                        }
                      </Box>
                      
                      {/* Follow-up Question */}
                      {(option.id === selectedOptionId || option.followUpId) && (
                       <FollowUpQuestion question={question} option={option} />
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

      <AddOption 
      question={question} 
      optionDialog={optionDialog} 
      setOptionDialog={setOptionDialog}/>
      
      </>
  )
}

export default OptionItem