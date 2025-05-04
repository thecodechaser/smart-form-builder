import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { QUESTION_BANK, OPTION_BANK } from '../data/bankData';

const LOCAL_STORAGE_KEY = 'formBuilderData';

const initialState = {
  questions: [],
  activeQuestion: null,
  activeOptionGroup: null,
  mode: 'edit',
  sidebarContent: 'questions',
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return initialState;
  }
};

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    loadFormData: (state) => {
      const savedState = loadFromLocalStorage();
      return { ...state, ...savedState };
    },
    addQuestion: (state, action) => {
      const {
        questionText,
        questionType = 'objective',
        bankId,
      } = action.payload;
      let newQuestion;

      if (bankId) {
        const bankQuestion = QUESTION_BANK.find((q) => q.id === bankId);
        newQuestion = {
          ...bankQuestion,
          id: uuidv4(),
          options: [],
          followUpQ: false,
        };
      } else {
        newQuestion = {
          id: uuidv4(),
          text: questionText,
          type: questionType,
          options: [],
          followUpQ: false,
        };
      }

      state.questions.push(newQuestion);
      state.activeQuestion = newQuestion.id;
      state.sidebarContent = 'options';
      saveToLocalStorage(state);
    },
    updateQuestion: (state, action) => {
      const { questionId, questionText, questionType } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        question.text = questionText;
        if (questionType) question.type = questionType;
      }
      state.sidebarContent = 'options';
      saveToLocalStorage(state);
    },
    deleteQuestion: (state, action) => {
      const { id } = action.payload;
      const question = state.questions.find((q) => q.id === id);

      if (question) {
        const options = question.options;
        if (options.length > 0) {
          const followUpIds = options
            .map((option) => option.followUpId)
            .filter((id) => id !== null);
          const idsToRemove = [...followUpIds, question.id];
          state.questions = state.questions.filter(
            (q) => !idsToRemove.includes(q.id)
          );
        } else {
          state.questions = state.questions.filter((q) => q.id !== id);
        }
      }
      state.sidebarContent = 'questions';
      saveToLocalStorage(state);
    },
    setActiveQuestion: (state, action) => {
      state.activeQuestion = action.payload;
      state.activeOptionGroup = null;
      state.sidebarContent = 'questions';
    },
    addOptionGroup: (state, action) => {
      const { questionId, bankId, options, isMultiSelect } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (question) {
        let newOptions = [];

        if (bankId) {
          const bankOptions = OPTION_BANK.find((og) => og.id === bankId);
          newOptions = bankOptions.options.map((option) => ({
            id: uuidv4(),
            text: option,
            followUpId: null,
          }));
        } else if (options) {
          newOptions = options.map((option) => ({
            id: uuidv4(),
            text: option,
            followUpId: null,
          }));
        }

        question.options = newOptions;
        if (isMultiSelect !== undefined) {
          question.type = isMultiSelect ? 'multi-select' : 'objective';
        }
        state.sidebarContent = 'questions';
        state.activeOptionGroup = questionId;
      }
      saveToLocalStorage(state);
    },
    // updateOptionGroup: (state, action) => {
    //   const { questionId, options, isMultiSelect } = action.payload;
    //   const question = state.questions.find((q) => q.id === questionId);

    //   if (question && options) {
    //     const newOptions = options.map((option) => ({
    //       id: uuidv4(),
    //       text: option,
    //       followUpId: null,
    //     }));
    //     question.options = newOptions;
    //   }

    //   if (isMultiSelect !== undefined) {
    //     question.type = isMultiSelect ? 'multi-select' : 'objective';
    //   }
    //   state.sidebarContent = 'questions';
    //   state.activeOptionGroup = questionId;
    //   saveToLocalStorage(state);
    // },

    updateOptionGroup: (state, action) => {
      const { questionId, options, isMultiSelect } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (question && options) {
        const existingOptions = question.options || [];

        const parsedOptions = options.map((optionStr) => {
          const [text, id] = optionStr.split('<=>');
          return { text, id: id || null };
        });

        const updatedOptions = [];

        parsedOptions.forEach(({ text, id }) => {
          if (id) {
            const existing = existingOptions.find((opt) => opt.id === id);
            if (existing) {
              existing.text = text;
              updatedOptions.push(existing);
            } else {
              updatedOptions.push({
                id: uuidv4(),
                text,
                followUpId: null,
              });
            }
          } else {
            updatedOptions.push({
              id: uuidv4(),
              text,
              followUpId: null,
            });
          }
        });

        question.options = updatedOptions;
      }

      if (isMultiSelect !== undefined) {
        question.type = isMultiSelect ? 'multi-select' : 'objective';
      }

      state.sidebarContent = 'questions';
      state.activeOptionGroup = questionId;
      saveToLocalStorage(state);
    },
    removeOptionGroup: (state, action) => {
      const { questionId } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (question) question.options = [];
      state.sidebarContent = 'options';
      saveToLocalStorage(state);
    },
    addFollowUpQuestion: (state, action) => {
      const {
        questionId,
        optionId,
        questionText,
        questionType = 'objective',
      } = action.payload;

      const followUpQuestion = {
        id: uuidv4(),
        text: questionText,
        type: questionType,
        options: [],
        followUpQ: true,
      };

      state.questions.push(followUpQuestion);

      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          option.followUpId = followUpQuestion.id;
        }
      }

      state.activeQuestion = followUpQuestion.id;
      state.sidebarContent = 'options';
      saveToLocalStorage(state);
    },
    removeFollowUp: (state, action) => {
      const { questionId, optionId } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (question) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          const followUpId = option.followUpId;
          option.followUpId = null;

          if (followUpId) {
            let isReferenced = false;
            state.questions.forEach((q) => {
              q.options.forEach((o) => {
                if (o.followUpId === followUpId) {
                  isReferenced = true;
                }
              });
            });

            if (!isReferenced) {
              state.questions = state.questions.filter(
                (q) => q.id !== followUpId
              );
            }
          }
        }
      }
      state.sidebarContent = 'questions';
      saveToLocalStorage(state);
    },
    toggleMode: (state, action) => {
      if (action.payload) state.mode = action.payload;
      else state.mode = state.mode === 'edit' ? 'preview' : 'edit';
    },
    setSidebarContent: (state, action) => {
      state.sidebarContent = action.payload;
    },
    handleDragEnd: (state, action) => {
      const { result } = action.payload;

      if (
        !result ||
        !result.destination ||
        !result.source ||
        !result.draggableId
      )
        return;

      const { source, destination, draggableId } = result;

      if (
        source.droppableId === 'questionBank' &&
        destination.droppableId.startsWith('formBuilder')
      ) {
        const bankId = draggableId.replace('bank-question-', '');
        const bankQuestion = QUESTION_BANK.find((q) => q.id === bankId);

        if (bankQuestion) {
          const newQuestion = {
            id: uuidv4(),
            text: bankQuestion.text,
            type: bankQuestion.type,
            options: [],
            followUpQ: destination.droppableId.startsWith(
              'formBuilder-followUp'
            ),
          };

          state.questions.push(newQuestion);
          state.activeQuestion = newQuestion.id;
          state.sidebarContent = 'options';

          if (destination.droppableId.startsWith('formBuilder-followUp')) {
            const parts = destination.droppableId.split('<=>');

            const questionId = parts[0].replace('formBuilder-followUp-', '');
            const optionId = parts[1];

            const question = state.questions.find((q) => q.id === questionId);
            if (question) {
              const option = question.options.find((o) => o.id === optionId);
              if (option) {
                option.followUpId = newQuestion.id;
              }
            }
          }
        }
      }

      if (
        source.droppableId === 'optionBank' &&
        destination.droppableId.startsWith('question-')
      ) {
        const questionId = destination.droppableId.replace('question-', '');
        const bankId = draggableId.replace('bank-option-', '');
        const question = state.questions.find((q) => q.id === questionId);

        if (question && bankId) {
          const bankOptions = OPTION_BANK.find((og) => og.id === bankId);

          if (bankOptions) {
            question.options = bankOptions.options.map((option) => ({
              id: uuidv4(),
              text: option,
              followUpId: null,
            }));

            state.sidebarContent = 'questions';
            state.activeOptionGroup = questionId;
          }
        }
      }

      saveToLocalStorage(state);
    },
  },
});

export const {
  loadFormData,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setActiveQuestion,
  addOptionGroup,
  addFollowUpQuestion,
  removeFollowUp,
  toggleMode,
  setSidebarContent,
  handleDragEnd,
  removeOptionGroup,
  updateOptionGroup,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
