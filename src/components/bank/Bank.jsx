import {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material'
import { setSidebarContent } from '../../store/formBuilderSlice'
import QuestionBank from './QuestionBank'
import OptionBank from './OptionBank'

const Bank = ({ onItemClick }) => {
  const dispatch = useDispatch()
  const { sidebarContent } = useSelector(state => state.formBuilder)
  const [sidebar, setSideBar] = useState('questions');

  const handleTabChange = (event, newValue) => {
    dispatch(setSidebarContent(newValue))
    setSideBar(newValue)
  }

  useEffect(() => {   
    setSideBar(sidebar === 'options' ? 'questions' : 'options')
    setTimeout(() => {
      setSideBar(sidebar)
    }, 1);
   }
  , [])

  useEffect(() => {
    setSideBar(sidebarContent)
  }
  , [sidebarContent])
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Question & Option Bank
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Tabs 
        value={sidebar} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ mb: 2 }}
      >
        <Tab label="Questions" value="questions" />
        <Tab label="Options" value="options" />
      </Tabs>
      
      {sidebar === 'questions' ? (
        <QuestionBank onItemClick={onItemClick} />
      ) : (
        <OptionBank onItemClick={onItemClick} />
      )}
    </Box>
  )
}

export default Bank