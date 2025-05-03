import React from 'react';
import { Box, Paper, Typography, List, ListItem, Button, Divider } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder';

const OptionBank: React.FC = () => {
  const { optionBank, selectedQuestionId, createNewOptionFromBank } = useFormBuilder();

  const handleAddOption = (bankIndex: number, optionIndex: number) => {
    if (selectedQuestionId) {
      createNewOptionFromBank(
        selectedQuestionId, 
        optionBank[bankIndex][optionIndex]
      );
    }
  };

  const optionTypes = [
    'Yes/No',
    'Rating Scale',
    'Numeric Scale',
    'Feedback Options'
  ];

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {optionBank.map((options, bankIndex) => (
        <React.Fragment key={`bank-${bankIndex}`}>
          <Typography 
            variant="subtitle2" 
            sx={{ mb: 1, mt: bankIndex > 0 ? 3 : 0 }}
          >
            {optionTypes[bankIndex]}
          </Typography>
          
          <Droppable 
            droppableId={`optionBank-${bankIndex}`} 
            isDropDisabled={true}
          >
            {(provided) => (
              <List 
                disablePadding
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {options.map((option, optionIndex) => {
                  // Create a unique index across all option banks
                  const combinedIndex = bankIndex * 10 + optionIndex;
                  
                  return (
                    <Draggable
                      key={option.id}
                      draggableId={option.id}
                      index={combinedIndex}
                      isDragDisabled={!selectedQuestionId}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          disablePadding
                          sx={{ mb: 1 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              width: '100%',
                              bgcolor: !selectedQuestionId 
                                ? 'action.disabledBackground' 
                                : snapshot.isDragging
                                  ? 'primary.light'
                                  : 'background.paper',
                              color: !selectedQuestionId 
                                ? 'action.disabled' 
                                : snapshot.isDragging 
                                  ? 'white' 
                                  : 'inherit',
                              boxShadow: snapshot.isDragging ? 2 : 'none',
                              opacity: !selectedQuestionId ? 0.7 : 1,
                              '&:hover': {
                                bgcolor: !selectedQuestionId 
                                  ? 'action.disabledBackground' 
                                  : 'primary.light',
                                color: !selectedQuestionId 
                                  ? 'action.disabled' 
                                  : 'white',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2">
                                {option.text}
                              </Typography>
                              <Button
                                size="small"
                                disabled={!selectedQuestionId}
                                sx={{
                                  minWidth: 'auto',
                                  p: 0.5,
                                  color: 'inherit',
                                }}
                                onClick={() => handleAddOption(bankIndex, optionIndex)}
                              >
                                <Plus size={16} />
                              </Button>
                            </Box>
                          </Paper>
                        </ListItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
          
          {bankIndex < optionBank.length - 1 && (
            <Divider sx={{ my: 2 }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default OptionBank;