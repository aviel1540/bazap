import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './components/Projects/projcetSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export default store;