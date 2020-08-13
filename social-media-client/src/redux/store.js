import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import userReducer from './reducers/userReducer.js';
import dataReducer from './reducers/dataReducer.js';
import uiReducer from './reducers/uiReducer.js';
import thunk from 'redux-thunk';

const initialState = [];
const middleware = [thunk];

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
});

const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;