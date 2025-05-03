import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  Button,
  Divider,
  Alert
} from '@mui/material'

const FormPreview = () => {
  const { questions } = useSelector(state => state.formBuilder)
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)
  
  // Function to get valid questions based on conditional logic
  const getVisibleQuestions = () => {
    const visibleQuestions = []
    const seenQuestionIds = new Set()
    
    // Helper function to add a question and its visible follow-ups
    const processQuestion = (questionId) => {
      if (seenQuestionIds.has(questionId)) return
      
      const question = questions.find(q => q.id === questionId)
      if (!question) return
      
      seenQuestionIds.add(questionId)
      visibleQuestions.push(question)
      
      // Check if any follow-up questions should be shown
      if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
          if (option.followUpId && shouldShowFollowUp(question.id, option.id)) {
            processQuestion(option.followUpId)
          }
        })
      }
    }
    
    // Start with top-level questions (those not referenced as follow-ups)
    const topLevelQuestionIds = new Set(questions.map(q => q.id))
    questions.forEach(q => {
      if (q.options) {
        q.options.forEach(o => {
          if (o.followUpId) {
            topLevelQuestionIds.delete(o.followUpId)
          }
        })
      }
    })
    
    // Process each top-level question
    topLevelQuestionIds.forEach(qId => {
      processQuestion(qId)
    })
    
    return visibleQuestions
  }
  
  // Check if a follow-up question should be shown based on responses
  const shouldShowFollowUp = (questionId, optionId) => {
    const response = responses[questionId]
    if (!response) return false
    
    const question = questions.find(q => q.id === questionId)
    if (!question) return false
    
    if (question.type === 'objective') {
      return response === optionId
    } else if (question.type === 'multi-select') {
      return response.includes(optionId)
    }
    
    return false
  }
  
  // Handle response changes
  const handleResponseChange = (questionId, value, questionType) => {
    if (questionType === 'multi-select') {
      // For multi-select, toggle the option in an array
      const currentSelections = responses[questionId] || []
      const newSelections = currentSelections.includes(value)
        ? currentSelections.filter(id => id !== value)
        : [...currentSelections, value]
      
      setResponses({
        ...responses,
        [questionId]: newSelections
      })
    } else {
      // For objective and subjective, just set the value
      setResponses({
        ...responses,
        [questionId]: value
      })
    }
  }
  
  const handleSubmit = () => {
    console.log('Form responses:', responses)
    setSubmitted(true)
    // Here you would typically send the data to your backend
  }
  
  const visibleQuestions = getVisibleQuestions()
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Form Preview
      </Typography>
      
      {submitted ? (
        <Box sx={{ my: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Form submitted successfully!
          </Alert>
          <Button 
            variant="outlined" 
            onClick={() => {
              setResponses({})
              setSubmitted(false)
            }}
          >
            Fill Out Again
          </Button>
        </Box>
      ) : (
        <>
          {visibleQuestions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No questions have been added to the form yet. Go to Edit mode to add questions.
              </Typography>
            </Paper>
          ) : (
            <Box>
              {visibleQuestions.map((question, index) => (
                <Paper key={question.id} sx={{ mb: 4, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {index + 1}. {question.text}
                  </Typography>
                  
                  {question.type === 'objective' && (
                    <RadioGroup
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value, 'objective')}
                    >
                      {question.options.map(option => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio />}
                          label={option.text}
                        />
                      ))}
                    </RadioGroup>
                  )}
                  
                  {question.type === 'multi-select' && (
                    <FormGroup>
                      {question.options.map(option => (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Checkbox 
                              checked={(responses[question.id] || []).includes(option.id)}
                              onChange={() => handleResponseChange(question.id, option.id, 'multi-select')}
                            />
                          }
                          label={option.text}
                        />
                      ))}
                    </FormGroup>
                  )}
                  
                  {question.type === 'subjective' && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Your answer"
                      multiline
                      rows={3}
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value, 'subjective')}
                    />
                  )}
                </Paper>
              ))}
              
              <Box sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default FormPreview