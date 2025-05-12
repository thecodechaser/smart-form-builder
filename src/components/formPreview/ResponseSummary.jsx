import { Box, Typography, Paper } from '@mui/material';

const ResponseSummary = ({ questions, responses }) => {
  const renderQuestion = (question, level = 0) => {
    const indent = level * 2;
    const response = responses[question.id];
    if (!response) return null;

    const getAnswerText = () => {
      if (question.type === 'subjective') {
        return response;
      }

      const selectedOptions = question.options.filter((opt) =>
        question.type === 'multi-select'
          ? response.includes(opt.id)
          : response === opt.id
      );

      return selectedOptions.map((opt) => opt.text).join(', ');
    };

    const followUps = [];

    if (question.options) {
      question.options.forEach((opt) => {
        const shouldShowFollowUp =
          (question.type === 'objective' && response === opt.id) ||
          (question.type === 'multi-select' && response.includes(opt.id));
        if (shouldShowFollowUp && opt.followUpId && level < 2) {
          const followUpQ = questions.find((q) => q.id === opt.followUpId);
          if (followUpQ) {
            followUps.push(renderQuestion(followUpQ, level + 1));
          }
        }
      });
    }

    return (
      <Box key={question.id} sx={{ ml: indent, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {question.text}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Answer: {getAnswerText()}
        </Typography>
        {followUps}
      </Box>
    );
  };

  const getTopLevelQuestions = () => {
    const followUps = new Set();
    questions.forEach((q) => {
      q.options?.forEach((o) => {
        if (o.followUpId) followUps.add(o.followUpId);
      });
    });
    return questions.filter((q) => !followUps.has(q.id));
  };

  const topLevelQuestions = getTopLevelQuestions();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Responses
      </Typography>
      {topLevelQuestions.map((q) => renderQuestion(q))}
    </Paper>
  );
};

export default ResponseSummary;
