import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';
import {
  loadFormData,
  handleDragEnd,
  setSidebarContent,
} from './store/formBuilderSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFormData());
    dispatch(setSidebarContent('questions'));
  }, [dispatch]);

  const onDragEnd = (result) => {
    dispatch(handleDragEnd({ result }));
  };

  return (
    <Box className="app-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Layout />
      </DragDropContext>
    </Box>
  );
}

export default App;
