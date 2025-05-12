import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  Box,
} from '@mui/material';

const QuestionItem = ({
  question,
  questions,
  responses,
  onChange,
  index,
  level = 0,
}) => {
  const response = responses[question.id] || '';
  const renderFollowUp = (optId) => {
    
    const getFollowUp = (id) => {
      const option = question.options?.find((o) => o.id === id);
      return option?.followUpId
        ? questions.find((q) => q.id === option.followUpId) || null
        : null;
    };

    const shouldShow = (id) => {
      if (question.type === 'objective') return response === id;
      if (question.type === 'multi-select') return response.includes(id);
      return false;
    };

    const followUp = getFollowUp(optId);
    if (!followUp || level >= 1 || !shouldShow(optId)) return null;

    return (
      <QuestionItem
        key={followUp.id}
        question={followUp}
        questions={questions}
        responses={responses}
        onChange={onChange}
        level={level + 1}
      />
    );
  };

  const indent = level * 3;

  return (
    <Box sx={{ pl: indent }}>
      {typeof index === 'number' ? (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {index + 1}. {question.text}
        </Typography>
      ) : (
        <Typography sx={{ mb: 2 }}>{question.text}</Typography>
      )}

      {question.type === 'objective' && (
        <RadioGroup
          value={response}
          onChange={(e) => onChange(question.id, e.target.value, 'objective')}
        >
          {question.options.map((opt) => (
            <Box key={opt.id} sx={{ ml: 2 }}>
              <FormControlLabel
                value={opt.id}
                control={<Radio />}
                label={opt.text}
              />
              {renderFollowUp(opt.id)}
            </Box>
          ))}
        </RadioGroup>
      )}

      {question.type === 'multi-select' && (
        <FormGroup>
          {question.options.map((opt) => (
            <Box key={opt.id} sx={{ ml: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(response || []).includes(opt.id)}
                    onChange={() =>
                      onChange(question.id, opt.id, 'multi-select')
                    }
                  />
                }
                label={opt.text}
              />
              {renderFollowUp(opt.id)}
            </Box>
          ))}
        </FormGroup>
      )}

      {question.type === 'subjective' && (
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          placeholder="Your answer"
          value={response}
          onChange={(e) => onChange(question.id, e.target.value, 'subjective')}
        />
      )}
    </Box>
  );
};

export default QuestionItem;
