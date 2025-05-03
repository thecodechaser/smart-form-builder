import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { QUESTION_BANK, OPTION_BANK } from '../data/bankData'

const LOCAL_STORAGE_KEY = 'formBuilderData'

const initialState = {
  questions: [],
  activeQuestion: null,
  activeOptionGroup: null,
  mode: 'edit', // 'edit' or 'preview'
  sidebarContent: 'questions', // 'questions' or 'options'
}

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (serializedState === null) {
      return initialState
    }
    return JSON.parse(serializedState)
  } catch (e) {
    console.error('Error loading from localStorage:', e)
    return initialState
  }
}

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState)
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    loadFormData: (state) => {
      const savedState = loadFromLocalStorage()
      return { ...state, ...savedState }
    },
    addQuestion: (state, action) => {
      const { questionText, questionType = 'objective', bankId } = action.payload
      let newQuestion

      if (bankId) {
        // Clone from question bank
        const bankQuestion = QUESTION_BANK.find(q => q.id === bankId)
        newQuestion = {
          ...bankQuestion,
          id: uuidv4(),
          options: [],
          followUpQ: false
        }
      } else {
        // Create new question
        newQuestion = {
          id: uuidv4(),
          text: questionText,
          type: questionType,
          options: [],
          followUpQ: false
        }
      }

      state.questions.push(newQuestion)
      state.activeQuestion = newQuestion.id
      state.sidebarContent = 'options'
      saveToLocalStorage(state)
    },
    updateQuestion: (state, action) => {
      const { id, text, type } = action.payload
      const question = state.questions.find(q => q.id === id)
      if (question) {
        question.text = text
        if (type) question.type = type
      }
      saveToLocalStorage(state)
    },
    deleteQuestion: (state, action) => {
      const { id } = action.payload
      state.questions = state.questions.filter(q => q.id !== id)
      
      // Also delete any follow-up questions that were connected to this question
      state.questions.forEach(question => {
        question.options = question.options.map(option => ({
          ...option,
          followUpId: option.followUpId === id ? null : option.followUpId
        }))
      })
      
      if (state.activeQuestion === id) {
        state.activeQuestion = state.questions.length > 0 ? state.questions[0].id : null
      }
      saveToLocalStorage(state)
    },
    setActiveQuestion: (state, action) => {
      state.activeQuestion = action.payload
      state.activeOptionGroup = null
      state.sidebarContent = 'questions'
    },
    addOptionGroup: (state, action) => {
      const { questionId, bankId, options, isMultiSelect } = action.payload
      const question = state.questions.find(q => q.id === questionId)
      
      if (question) {
        let newOptions = []
        
        if (bankId) {
          // Clone from options bank
          const bankOptions = OPTION_BANK.find(og => og.id === bankId)
          newOptions = bankOptions.options.map(option => ({
            id: uuidv4(),
            text: option,
            followUpId: null
          }))
        } else if (options) {
          // Create new options
          newOptions = options.map(option => ({
            id: uuidv4(),
            text: option,
            followUpId: null
          }))
        }
        
        question.options = newOptions
        if (isMultiSelect !== undefined) {
          question.type = isMultiSelect ? 'multi-select' : 'objective'
        }
        
        state.activeOptionGroup = questionId
      }
      saveToLocalStorage(state)
    },
    updateOption: (state, action) => {
      const { questionId, optionId, text } = action.payload
      const question = state.questions.find(q => q.id === questionId)
      
      if (question) {
        const option = question.options.find(o => o.id === optionId)
        if (option) {
          option.text = text
        }
      }
      saveToLocalStorage(state)
    },
    addFollowUpQuestion: (state, action) => {
      const { questionId, optionId, questionText, questionType = 'objective' } = action.payload
      
      // Create new follow-up question
      const followUpQuestion = {
        id: uuidv4(),
        text: questionText,
        type: questionType,
        options: [],
        followUpQ: true
      }
      
      // Add to questions list
      state.questions.push(followUpQuestion)
      
      // Link option to follow-up
      const question = state.questions.find(q => q.id === questionId)
      if (question) {
        const option = question.options.find(o => o.id === optionId)
        if (option) {
          option.followUpId = followUpQuestion.id
        }
      }
      
      // Set new question as active
      state.activeQuestion = followUpQuestion.id
      state.sidebarContent = 'options'
      saveToLocalStorage(state)
    },
    removeFollowUp: (state, action) => {
      const { questionId, optionId } = action.payload
      const question = state.questions.find(q => q.id === questionId)
      
      if (question) {
        const option = question.options.find(o => o.id === optionId)
        if (option) {
          const followUpId = option.followUpId
          option.followUpId = null
          
          // Also delete the follow-up question if it exists and no other options reference it
          if (followUpId) {
            let isReferenced = false
            state.questions.forEach(q => {
              q.options.forEach(o => {
                if (o.followUpId === followUpId) {
                  isReferenced = true
                }
              })
            })
            
            if (!isReferenced) {
              state.questions = state.questions.filter(q => q.id !== followUpId)
            }
          }
        }
      }
      saveToLocalStorage(state)
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'edit' ? 'preview' : 'edit'
    },
    setSidebarContent: (state, action) => {
      state.sidebarContent = action.payload
    },
    handleDragEnd: (state, action) => {
      const { result } = action.payload
      
      if (!result || !result.destination || !result.source || !result.draggableId) return
      
      const { source, destination, draggableId } = result
      
      // Handle dropping question from bank to form builder

      if (source.droppableId === 'questionBank' && destination.droppableId.startsWith('formBuilder')) {
        const bankId = draggableId.replace('bank-question-', '')
        const bankQuestion = QUESTION_BANK.find(q => q.id === bankId)
        
        if (bankQuestion) {
          const newQuestion = {
            id: uuidv4(),
            text: bankQuestion.text,
            type: bankQuestion.type,
            options: [],
            followUpQ: destination.droppableId.startsWith('formBuilder-followUp')
          }
          
          state.questions.push(newQuestion)
          state.activeQuestion = newQuestion.id
          state.sidebarContent = 'options'

          if(destination.droppableId.startsWith('formBuilder-followUp')) {
            const parts = destination.droppableId.split('<=>') // ['formBuilder', 'followUp', questionId, optionId]

            const questionId = parts[0].replace('formBuilder-followUp-', '')
            const optionId = parts[1]

            const question = state.questions.find(q => q.id === questionId)
            if (question) {
              const option = question.options.find(o => o.id === optionId)
              if (option) {
                option.followUpId = newQuestion.id
              }
            }
          }
        }
      }
      
      // Handle dropping option group from bank to question
      if (source.droppableId === 'optionBank' && destination.droppableId.startsWith('question-')) {
        const questionId = destination.droppableId.replace('question-', '')
        const bankId = draggableId.replace('bank-option-', '')
        const question = state.questions.find(q => q.id === questionId)
        
        if (question && bankId) {
          const bankOptions = OPTION_BANK.find(og => og.id === bankId)
          
          if (bankOptions) {
            question.options = bankOptions.options.map(option => ({
              id: uuidv4(),
              text: option,
              followUpId: null
            }))
            
            state.activeOptionGroup = questionId
          }
        }
      }
      
      saveToLocalStorage(state)
    }
  }
})

export const { 
  loadFormData, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion, 
  setActiveQuestion,
  addOptionGroup, 
  updateOption, 
  addFollowUpQuestion, 
  removeFollowUp, 
  toggleMode, 
  setSidebarContent,
  handleDragEnd
} = formBuilderSlice.actions

export default formBuilderSlice.reducer