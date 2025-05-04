import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { removeOptionGroup } from '../../../store/formBuilderSlice';
import OptionPlaceholder from './OptionPlaceholder';
import OptionValues from './OptionValues';
import EditIcon from '@mui/icons-material/Edit';
import AddOrEditOption from './AddOrEditOption';

const OptionItem = ({ question, followUpOption }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleRemoveOption = () => {
    dispatch(
      removeOptionGroup({
        questionId: question.id,
      })
    );
  };

  return (
    <>
      {question.type !== 'subjective' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Options:{' '}
            {question.options.length > 0 && (
              <>
                <IconButton size="small" onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveOption()}
                >
                  Remove Option
                </Button>
              </>
            )}
          </Typography>

          {question.options.length === 0 ? (
            <OptionPlaceholder question={question} />
          ) : (
            <OptionValues question={question} followUpOption={followUpOption} />
          )}
        </Box>
      )}

      {question.type === 'subjective' && (
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Text answer will appear here"
            disabled
            multiline
            rows={3}
          />
        </Box>
      )}

      <AddOrEditOption
        editMode={editMode}
        question={question}
        editOptions={question.options}
        optionDialog={editMode}
        setOptionDialog={setEditMode}
      />
    </>
  );
};

export default OptionItem;
