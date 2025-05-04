import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { setActiveQuestion, toggleMode } from '../../store/formBuilderSlice';

const LeftSidebar = ({ onItemClick }) => {
  const dispatch = useDispatch();
  const { questions, activeQuestion } = useSelector(
    (state) => state.formBuilder
  );

  const handleQuestionClick = (id) => {
    dispatch(setActiveQuestion(id));
    dispatch(toggleMode('edit'));
    if (onItemClick) onItemClick();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Navigation
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 2, pt: 1 }}>
        {questions.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Add questions to your form to see them here
          </Typography>
        ) : (
          <List>
            {questions
              .filter((question) => !question.followUpQ)
              .map((question, index) => (
                <ListItem
                  key={question.id}
                  className={`navigation-item ${activeQuestion === question.id ? 'active' : ''}`}
                  onClick={() => handleQuestionClick(question.id)}
                  sx={{
                    bgcolor:
                      activeQuestion === question.id
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography noWrap sx={{ maxWidth: '180px' }}>
                        {question.text}
                      </Typography>
                    }
                    secondary={
                      question.type.charAt(0).toUpperCase() +
                      question.type.slice(1)
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default LeftSidebar;
