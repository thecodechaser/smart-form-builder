import { useSelector } from 'react-redux'
import { 
  Box, 
  Typography, 
  Button, 
} from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import QuestionItem from './QuestionItem'
import AddOrEditQuestion from './AddOrEditQuestion'

const FormBuilder = () => {
  const { questions, activeQuestion } = useSelector(state => state.formBuilder)
  const [questionDialog, setQuestionDialog] = useState(false)
  
  const handleAddQuestion = () => {
    setQuestionDialog(true)
  }
  
  return (
    <>
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
              questions
              .filter(question => !question.followUpQ)
              .map((question, index) => (
                <QuestionItem 
                  key={question.id} 
                  question={question} 
                  index={index}
                  isActive={activeQuestion === question.id}
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
    </Box>
    <AddOrEditQuestion 
      openDialog={questionDialog} 
      setOpenDialog={setQuestionDialog} 
      followUpQ={false} />
      </>

  )
}

export default FormBuilder