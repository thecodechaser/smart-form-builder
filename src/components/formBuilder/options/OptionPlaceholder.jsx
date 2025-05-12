import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import AddOrEditOption from './AddOrEditOption';
import AddIcon from '@mui/icons-material/Add';

const OptionPlaceholder = ({ question }) => {
  const [optionDialog, setOptionDialog] = useState(false);

  const handleAddOptions = () => {
    setOptionDialog(true);
  };

  return (
    <>
      <Droppable droppableId={`option-question-${question.id}`}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="drag-placeholder"
            onClick={handleAddOptions}
            sx={{
              height: '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: 'primary.light',
              borderRadius: 2,
              bgcolor: 'rgba(25, 118, 210, 0.05)',
            }}
          >
            <AddIcon sx={{ fontSize: 20, color: 'primary.main', mb: 1 }} />
            <Typography color="primary">
              Click here or drag option groups from the bank
            </Typography>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <AddOrEditOption
        question={question}
        optionDialog={optionDialog}
        setOptionDialog={setOptionDialog}
      />
    </>
  );
};

export default OptionPlaceholder;
