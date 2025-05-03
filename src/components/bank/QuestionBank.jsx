import { Box, Typography, Paper } from '@mui/material'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { QUESTION_BANK } from '../../data/bankData'

const QuestionBank = ({ onItemClick }) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Drag a question to add it to your form
      </Typography>
      
      <Droppable droppableId="questionBank" isDropDisabled={true}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ mt: 2 }}
          >
            {QUESTION_BANK.map((question, index) => (
              <Draggable 
                key={question.id} 
                draggableId={`bank-question-${question.id}`} 
                index={index}
              >
                {(provided, snapshot) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bank-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    elevation={snapshot.isDragging ? 3 : 1}
                    sx={{ 
                      mb: 2,
                      p: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={onItemClick}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {question.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type: {question.type}
                    </Typography>
                  </Paper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  )
}

export default QuestionBank