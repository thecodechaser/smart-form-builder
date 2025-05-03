import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { moveItem } from './store/formBuilderSlice';
import theme from './theme';
import FormBuilderLayout from './components/layout/FormBuilderLayout';

function App() {
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }

    dispatch(moveItem({
      sourceId: source.droppableId,
      sourceIndex: source.index,
      destinationId: destination.droppableId,
      destinationIndex: destination.index,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DragDropContext onDragEnd={handleDragEnd}>
        <FormBuilderLayout />
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;