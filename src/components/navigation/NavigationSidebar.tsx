import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography, Divider } from '@mui/material';
import { HelpCircle as CircleHelp } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder';

const NavigationSidebar: React.FC = () => {
  const { questions, selectedQuestionId, selectQuestion } = useFormBuilder();
  
  // Filter out follow-up questions for the main navigation
  const mainQuestions = questions.filter(q => !q.isFollowUp);

  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
      {mainQuestions.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CircleHelp size={40} color="#9e9e9e" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No questions added yet. Add questions from the bank or create new ones.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {mainQuestions.map((question, index) => (
            <React.Fragment key={question.id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedQuestionId === question.id}
                  onClick={() => selectQuestion(question.id)}
                  sx={{
                    transition: 'background-color 0.2s',
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: selectedQuestionId === question.id ? 'white' : 'primary.main',
                        color: selectedQuestionId === question.id ? 'primary.main' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: selectedQuestionId === question.id ? 'bold' : 'normal',
                        }}
                      >
                        {question.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              
              {/* Show indicators for follow-up questions */}
              {questions.some(q => q.parentQuestionId === question.id) && (
                <Box sx={{ pl: 4, pr: 2, py: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Has follow-up questions
                  </Typography>
                </Box>
              )}
              
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NavigationSidebar;