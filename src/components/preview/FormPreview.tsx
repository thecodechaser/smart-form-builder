import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField, Radio, RadioGroup, FormControlLabel, Checkbox, FormGroup, Divider } from '@mui/material';
import { ArrowLeft, ArrowRight, Check, Edit } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { Question } from '../../store/formBuilderSlice';

const FormPreview: React.FC = () => {
  const { questions, togglePreview } = useFormBuilder();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter out follow-up questions for top-level navigation
  const mainQuestions = questions.filter(q => !q.isFollowUp);
  
  const currentQuestion = mainQuestions[currentQuestionIndex];
  
  // Function to find the appropriate follow-up question based on the selected option
  const findFollowUpQuestion = (question: Question, selectedOptionId: string): Question | null => {
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    if (selectedOption?.followUpQuestionId) {
      return questions.find(q => q.id === selectedOption.followUpQuestionId) || null;
    }
    return null;
  };

  // Recursively build a list of questions to display (including follow-ups)
  const buildQuestionSequence = (
    startingQuestion: Question, 
    currentAnswers: Record<string, string | string[]>
  ): Question[] => {
    const result: Question[] = [startingQuestion];
    
    if (startingQuestion.type === 'objective' && startingQuestion.id in currentAnswers) {
      const selectedOptionId = currentAnswers[startingQuestion.id] as string;
      const followUp = findFollowUpQuestion(startingQuestion, selectedOptionId);
      
      if (followUp) {
        result.push(...buildQuestionSequence(followUp, currentAnswers));
      }
    }
    
    return result;
  };

  const questionsToShow = currentQuestion 
    ? buildQuestionSequence(currentQuestion, answers) 
    : [];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < mainQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleObjectiveAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleMultiSelectAnswerChange = (questionId: string, value: string) => {
    const currentAnswers = answers[questionId] as string[] || [];
    let updatedAnswers: string[];
    
    if (currentAnswers.includes(value)) {
      updatedAnswers = currentAnswers.filter(v => v !== value);
    } else {
      updatedAnswers = [...currentAnswers, value];
    }
    
    setAnswers({
      ...answers,
      [questionId]: updatedAnswers,
    });
  };

  const handleSubjectiveAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleBackToEdit = () => {
    togglePreview();
  };

  const renderQuestion = (question: Question, isFollowUp = false) => {
    return (
      <Box 
        key={question.id} 
        sx={{ 
          mt: isFollowUp ? 3 : 0,
          ml: isFollowUp ? 3 : 0,
          borderLeft: isFollowUp ? 2 : 0,
          borderColor: 'secondary.main',
          pl: isFollowUp ? 2 : 0,
        }}
      >
        <Typography 
          variant={isFollowUp ? "h6" : "h5"} 
          gutterBottom
          color={isFollowUp ? "secondary.main" : "inherit"}
        >
          {question.text}
        </Typography>

        {question.type === 'objective' && (
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleObjectiveAnswerChange(question.id, e.target.value)}
          >
            {question.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
              />
            ))}
          </RadioGroup>
        )}

        {question.type === 'multi-select' && (
          <FormGroup>
            {question.options.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={(answers[question.id] as string[] || []).includes(option.id)}
                    onChange={() => handleMultiSelectAnswerChange(question.id, option.id)}
                  />
                }
                label={option.text}
              />
            ))}
          </FormGroup>
        )}

        {question.type === 'subjective' && (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your answer here..."
            value={answers[question.id] || ''}
            onChange={(e) => handleSubjectiveAnswerChange(question.id, e.target.value)}
            sx={{ mt: 1 }}
          />
        )}
      </Box>
    );
  };

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ color: 'success.main', mb: 2 }}>
            <Check size={60} strokeWidth={1} />
          </Box>
          <Typography variant="h4" gutterBottom>
            Form Submitted
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for completing the form!
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={handleBackToEdit}
          >
            Back to Editor
          </Button>
        </Paper>
      </Box>
    );
  }

  if (mainQuestions.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Preview
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your form is empty. Please add questions to preview your form.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={handleBackToEdit}
          >
            Back to Editor
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5">
            Form Preview
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Edit />}
            onClick={handleBackToEdit}
          >
            Back to Editor
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {mainQuestions.length}
          </Typography>
          <Box 
            sx={{ 
              height: 6, 
              bgcolor: 'grey.200', 
              borderRadius: 3, 
              mt: 1, 
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                height: '100%', 
                width: `${((currentQuestionIndex + 1) / mainQuestions.length) * 100}%`,
                bgcolor: 'primary.main',
                borderRadius: 3,
                transition: 'width 0.3s',
              }}
            />
          </Box>
        </Box>

        <Box>
          {questionsToShow.map((q, index) => renderQuestion(q, index > 0))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            variant="contained"
            endIcon={<ArrowRight />}
            onClick={handleNext}
          >
            {currentQuestionIndex < mainQuestions.length - 1 ? 'Next' : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormPreview;