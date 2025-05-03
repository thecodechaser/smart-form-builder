import React from 'react';
import { Box, Paper, Typography, List, ListItem, Button } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder';

const QuestionBank: React.FC = () => {
  const { questionBank, createNewQuestionFromBank } = useFormBuilder();

  const handleAddQuestion = (index: number) => {
    createNewQuestionFromBank(questionBank[index]);
  };

  return (
    <Droppable droppableId="questionBank" isDropDisabled={true}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ height: '100%', overflow: 'auto' }}
        >
          <List disablePadding>
            {questionBank.map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <ListItem
                    disablePadding
                    sx={{ mb: 2 }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        width: '100%',
                        bgcolor: snapshot.isDragging
                          ? 'primary.light'
                          : 'background.paper',
                        color: snapshot.isDragging ? 'white' : 'inherit',
                        boxShadow: snapshot.isDragging
                          ? 3
                          : 'none',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'white',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            mr: 1,
                            flexGrow: 1,
                          }}
                        >
                          {question.text}
                        </Typography>
                        <Button
                          size="small"
                          sx={{
                            minWidth: 'auto',
                            p: 0.5,
                            color: 'inherit',
                          }}
                          onClick={() => handleAddQuestion(index)}
                        >
                          <Plus size={18} />
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: snapshot.isDragging
                              ? 'white'
                              : 'primary.main',
                            color: snapshot.isDragging
                              ? 'primary.main'
                              : 'white',
                          }}
                        >
                          {question.type}
                        </Typography>
                      </Box>
                    </Paper>
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        </Box>
      )}
    </Droppable>
  );
};

export default QuestionBank;