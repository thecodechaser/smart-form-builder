import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert
} from '@mui/material'
import QuestionItem from './QuestionItem'
import ResponseSummary from './ResponseSummary'

const FormPreview = () => {
  const { questions } = useSelector(state => state.formBuilder)
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleResponseChange = (questionId, value, type) => {
    if (type === 'multi-select') {
      const current = responses[questionId] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      setResponses(prev => ({ ...prev, [questionId]: updated }))
    } else {
      setResponses(prev => ({ ...prev, [questionId]: value }))
    }
  }

  const handleSubmit = () => {
    console.log('Form responses:', responses)
    setSubmitted(true)
  }

  const getTopLevelQuestions = () => {
    const followUps = new Set()
    questions.forEach(q => {
      q.options?.forEach(o => {
        if (o.followUpId) followUps.add(o.followUpId)
      })
    })
    return questions.filter(q => !followUps.has(q.id))
  }

  const topLevelQuestions = getTopLevelQuestions()

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
            <ResponseSummary questions={questions} responses={responses} />
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
            setResponses({})
            setSubmitted(false)
          }}>
            Fill Out Again
          </Button>
            </Box>
        
      ) : (
        <Box>
          {topLevelQuestions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No questions have been added to the form yet. Go to Edit mode to add questions.
              </Typography>
            </Paper>
          ) : (
            <>
              {topLevelQuestions.map((q, i) => (
                <Paper key={q.id} sx={{ mb: 4, p: 3 }}>
                  <QuestionItem
                    question={q}
                    questions={questions}
                    responses={responses}
                    onChange={handleResponseChange}
                    index={i}
                  />
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
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

export default FormPreview
