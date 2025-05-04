import { Box, Typography, Paper } from '@mui/material'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { OPTION_BANK } from '../../data/bankData'

const OptionBank = ({ onItemClick }) => {
  return (
    <Box>
      <Droppable droppableId="optionBank" isDropDisabled={true}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
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

export default OptionBank