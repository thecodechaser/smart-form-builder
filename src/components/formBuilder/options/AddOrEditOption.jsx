import { useState, useEffect } from 'react';
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
  Box,
} from '@mui/material';
import {
  addOptionGroup,
  updateOptionGroup,
} from '../../../store/formBuilderSlice';

const AddOrEditOption = ({
  editMode = false,
  editOptions,
  question,
  optionDialog,
  setOptionDialog,
}) => {
  const dispatch = useDispatch();
  const [optionsInput, setOptionsInput] = useState('');
  const [editQuestionType, setEditQuestionType] = useState(question.type);

  useEffect(() => {
    if (editMode && editOptions) {
      setOptionsInput(editOptions.map((opt) => opt.text).join('\n'));
    }
  }, [editMode, editOptions]);

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
      const rawOptions = optionsInput
        .split('\n')
        .map((opt) => opt.trim())
        .filter((opt) => opt);

      const options = rawOptions.map((text, idx) => {
        const id = editOptions?.[idx]?.id;
        return id ? `${text}<=>${id}` : text;
      });

      if (options.length > 0) {
        if (editMode) {
          dispatch(
            updateOptionGroup({
              questionId: question.id,
              options,
              isMultiSelect,
            })
          );
        } else {
          dispatch(
            addOptionGroup({
              questionId: question.id,
              options,
              isMultiSelect,
            })
          );
        }
        handleOptionDialogClose();
      }
    }
  };

  return (
    <Dialog open={optionDialog} onClose={handleOptionDialogClose}>
      <DialogTitle>{`${editMode ? 'Update' : 'Add'} Options`}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Enter each option on a new line
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Question Type: {question.type}
          </Typography>
        </Box>

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
            label="Change question type to single choice"
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
          {`${editMode ? 'Save' : 'Add'} Options`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditOption;
