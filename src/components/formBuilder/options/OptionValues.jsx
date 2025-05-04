import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeFollowUp } from '../../../store/formBuilderSlice';
import FollowUpQuestion from '../questions/FollowUpQuestion';

const OptionValues = ({ question, followUpOption }) => {
  const dispatch = useDispatch();
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleAddFollowUp = (optionId) => {
    setSelectedOptionId(optionId);
  };

  const handleRemoveFollowUp = (optionId) => {
    dispatch(
      removeFollowUp({
        questionId: question.id,
        optionId,
      })
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {question.type === 'objective' ? (
        <RadioGroup>
          {question.options.map((option) => (
            <Box key={option.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  disabled
                />

                {!followUpOption && (
                  <Box sx={{ ml: 'auto', display: 'flex' }}>
                    {option.followUpId ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFollowUp(option.id)}
                      >
                        Remove Follow-up
                      </Button>
                    ) : selectedOptionId == option.id ? (
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<RemoveIcon />}
                        onClick={() => setSelectedOptionId(null)}
                      >
                        Close Follow-up
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddFollowUp(option.id)}
                      >
                        Add Follow-up
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              {(option.id === selectedOptionId || option.followUpId) && (
                <FollowUpQuestion question={question} option={option} />
              )}
            </Box>
          ))}
        </RadioGroup>
      ) : (
        <FormGroup>
          {question.options.map((option) => (
            <Box key={option.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={option.text}
                  disabled
                />

                {!followUpOption && (
                  <Box sx={{ ml: 'auto', display: 'flex' }}>
                    {option.followUpId ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFollowUp(option.id)}
                      >
                        Remove Follow-up
                      </Button>
                    ) : selectedOptionId == option.id ? (
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<RemoveIcon />}
                        onClick={() => setSelectedOptionId(null)}
                      >
                        Close Follow-up
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddFollowUp(option.id)}
                      >
                        Add Follow-up
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              {(option.id === selectedOptionId || option.followUpId) && (
                <FollowUpQuestion question={question} option={option} />
              )}
            </Box>
          ))}
        </FormGroup>
      )}
    </Box>
  );
};

export default OptionValues;
