import React, { createContext, useContext, useReducer, useEffect } from 'react';
import  {withRouter} from 'react-router-dom';

const StorageContext = createContext(null);

// globle value of state
const initialState = {
  user:{}
};

//reducers to change state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      if (action.payload) {
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload)
        );
      }
      return {
        ...state,
        user: action.payload,
      };
    case 'RESET_USER':
      return {
        ...state,
        user: {},
      };
    default:
      return state;
  }
};

//context hooks to access data from everywhere
export const useStorage = () => useContext(StorageContext);

// provider for context
const StorageProvider = ({ children, history }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      dispatch({
        type: 'SET_USER',
        payload: JSON.parse(user),
      });
    }else{
      history.push('/login')
    }
  }, [history]);

  return (
    <StorageContext.Provider value={{...state, dispatch}}>
      {children}
    </StorageContext.Provider>
  );
};
export default withRouter(StorageProvider);