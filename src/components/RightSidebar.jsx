import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Tabs, Tab, Divider, Paper } from '@mui/material'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { setSidebarContent } from '../store/formBuilderSlice'
import { QUESTION_BANK, OPTION_BANK } from '../data/bankData'

const RightSidebar = ({ onItemClick }) => {
  const dispatch = useDispatch()
  const { sidebarContent } = useSelector(state => state.formBuilder)
  
  const handleTabChange = (event, newValue) => {
    dispatch(setSidebarContent(newValue))
  }
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Question & Option Bank
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Tabs 
        value={sidebarContent} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ mb: 2 }}
      >
        <Tab label="Questions" value="questions" />
        <Tab label="Options" value="options" />
      </Tabs>
      
      {sidebarContent === 'questions' ? (
        <QuestionBank onItemClick={onItemClick} />
      ) : (
        <OptionBank onItemClick={onItemClick} />
      )}
    </Box>
  )
}

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

const OptionBank = ({ onItemClick }) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Drag an option group to add it to a question
      </Typography>
      
      <Droppable droppableId="optionBank" isDropDisabled={true}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ mt: 2 }}
          >
            {OPTION_BANK.map((optionGroup, index) => (
              <Draggable 
                key={optionGroup.id} 
                draggableId={`bank-option-${optionGroup.id}`} 
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
                      {optionGroup.name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {optionGroup.options.map((option, i) => (
                        <Typography 
                          key={i} 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'inline-block', 
                            mr: 1,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 0.5
                          }}
                        >
                          {option}
                        </Typography>
                      ))}
                    </Box>
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

export default RightSidebar