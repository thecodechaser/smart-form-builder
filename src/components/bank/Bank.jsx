import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material';
import { setSidebarContent } from '../../store/formBuilderSlice';
import QuestionBank from './QuestionBank';
import OptionBank from './OptionBank';
import { useEffect } from 'react';

const Bank = ({ onItemClick }) => {
  const dispatch = useDispatch();
  const { sidebarContent } = useSelector((state) => state.formBuilder);

  const handleTabChange = (event, newValue) => {
    dispatch(setSidebarContent(newValue));
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
        <Typography variant="subtitle2">
          {`Drag ${sidebarContent === 'questions' ? 'a question' : 'an option group'} to add it ${sidebarContent === 'questions' ? 'the form' : 'to a question'}`}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, pt: 1 }}>
        {sidebarContent === 'questions' ? (
          <QuestionBank onItemClick={onItemClick} />
        ) : (
          <OptionBank onItemClick={onItemClick} />
        )}
      </Box>
    </Box>
  );
};

export default Bank;
