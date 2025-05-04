import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { addOptionGroup } from '../../../store/formBuilderSlice';

const AddOption = ({ question, optionDialog, setOptionDialog }) => {
  const dispatch = useDispatch();
  const [optionsInput, setOptionsInput] = useState('');
  const [editQuestionType, setEditQuestionType] = useState(question.type);

  const handleOptionDialogClose = () => {
    setOptionsInput('');
    setEditQuestionType(editQuestionType);
    setOptionDialog(false);
  };

  const handleOptionsInputChange = (e) => {
    setOptionsInput(e.target.value);
  };

  const handleIsMultiSelectChange = (e) => {
    setEditQuestionType(
      editQuestionType === 'objective' ? 'multi-select' : 'objective'
    );
  };

  const handleOptionSubmit = () => {
    const isMultiSelect = editQuestionType === 'multi-select';
    if (optionsInput.trim()) {
      const options = optionsInput.split('\n').filter((opt) => opt.trim());
      if (options.length > 0) {
        dispatch(
          addOptionGroup({
            questionId: question.id,
            options,
            isMultiSelect,
          })
        );
        handleOptionDialogClose();
      }
    }
  };

  return (
    <Dialog open={optionDialog} onClose={handleOptionDialogClose}>
      <DialogTitle>Add Options</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter each option on a new line
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Options"
          fullWidth
          variant="outlined"
          multiline
          rows={5}
          value={optionsInput}
          onChange={handleOptionsInputChange}
          placeholder="Option 1&#10;Option 2&#10;Option 3"
        />
        {question.type === 'objective' ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={editQuestionType === 'multi-select'}
                onChange={handleIsMultiSelectChange}
              />
            }
            label="Change question type to multi-select"
            sx={{ mt: 2 }}
          />
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                checked={editQuestionType === 'objective'}
                onChange={handleIsMultiSelectChange}
              />
            }
            label="Change question type to objective"
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOptionDialogClose}>Cancel</Button>
        <Button
          onClick={handleOptionSubmit}
          variant="contained"
          color="primary"
        >
          Add Options
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOption;
