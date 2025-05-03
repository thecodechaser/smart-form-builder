import { configureStore } from '@reduxjs/toolkit'
import formBuilderReducer from './formBuilderSlice'

const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
})

export default store