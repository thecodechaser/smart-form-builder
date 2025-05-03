import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Divider } from '@mui/material';
import QuestionBank from './QuestionBank';
import OptionBank from './OptionBank';
import { useFormBuilder } from '../../hooks/useFormBuilder';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bank-tabpanel-${index}`}
      aria-labelledby={`bank-tab-${index}`}
      {...other}
      style={{ height: '100%', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `bank-tab-${index}`,
    'aria-controls': `bank-tabpanel-${index}`,
  };
};

const BankSidebar: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { selectedQuestionId } = useFormBuilder();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="bank tabs"
          variant="fullWidth"
        >
          <Tab label="Questions" {...a11yProps(0)} />
          <Tab label="Options" {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel value={tabValue} index={0}>
          <Paper 
            variant="outlined" 
            sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}
          >
            <Typography variant="body2" color="text.secondary">
              Drag and drop questions to the form builder or click to add them.
            </Typography>
          </Paper>
          <QuestionBank />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper 
            variant="outlined" 
            sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedQuestionId 
                ? 'Drag and drop options to your selected question or click to add them.'
                : 'Select a question first to add options to it.'}
            </Typography>
          </Paper>
          <OptionBank />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default BankSidebar;