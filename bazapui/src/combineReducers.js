import { combineReducers } from 'redux';
import modalProjectSlice from './components/Projects/projcetSlice';

export default combineReducers({
    projectModal :modalProjectSlice,
});