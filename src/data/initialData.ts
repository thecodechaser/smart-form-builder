import { Question, Option } from '../store/formBuilderSlice';

// Initial Question Bank
export const initialQuestionBank: Question[] = [
  {
    id: 'qbank-1',
    text: 'How was your initial interaction with the team at Xane AI?',
    type: 'objective',
    options: [],
  },
  {
    id: 'qbank-2',
    text: 'Would you recommend your friends to interview at Xane AI, based on your experience so far?',
    type: 'objective',
    options: [],
  },
  {
    id: 'qbank-3',
    text: 'Was the interviewer courteous and patient?',
    type: 'objective',
    options: [],
  },
  {
    id: 'qbank-4',
    text: 'Were the questions asked by the interviewer relevant to the role?',
    type: 'objective',
    options: [],
  },
  {
    id: 'qbank-5',
    text: 'Based on your initial impression, how would you rate the overall experience on a scale of 1 to 5?',
    type: 'objective',
    options: [],
  },
  {
    id: 'qbank-6',
    text: 'What would you advise the interviewer?',
    type: 'subjective',
    options: [],
  },
  {
    id: 'qbank-7',
    text: 'Which aspects of the interview process did you find most valuable?',
    type: 'multi-select',
    options: [],
  },
  {
    id: 'qbank-8',
    text: 'Please share any additional feedback you have about the interview process.',
    type: 'subjective',
    options: [],
  },
];

// Option Banks
const yesNoOptions: Option[] = [
  { id: 'obank-1-1', text: 'Yes' },
  { id: 'obank-1-2', text: 'No' },
];

const ratingOptions: Option[] = [
  { id: 'obank-2-1', text: 'Great' },
  { id: 'obank-2-2', text: 'Average' },
  { id: 'obank-2-3', text: 'Poor' },
];

const scaleOptions: Option[] = [
  { id: 'obank-3-1', text: '5' },
  { id: 'obank-3-2', text: '4' },
  { id: 'obank-3-3', text: '3' },
  { id: 'obank-3-4', text: '2' },
  { id: 'obank-3-5', text: '1' },
];

const feedbackOptions: Option[] = [
  { id: 'obank-4-1', text: 'Keep it up' },
  { id: 'obank-4-2', text: 'Get a life, loser' },
];

export const initialOptionBank: Option[][] = [
  yesNoOptions,
  ratingOptions,
  scaleOptions,
  feedbackOptions,
];