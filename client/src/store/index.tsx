import { useState, useEffect, useContext, createContext } from 'react';

import { getUser } from '../utils/API';

interface StoreProviderProps {
  children: React.ReactNode;
}

interface StateValue {
  loading: boolean;
  user: any;
}

interface ContextValue {
  state: StateValue;
  setState: React.Dispatch<React.SetStateAction<StateValue>>;
}

const StoreContext = createContext<ContextValue | undefined>(undefined);

const initialState = {
  loading: true,
  user: null
}

export function StoreProvider(props: StoreProviderProps) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Retrieve the user's data if they have a valid cookie/JWT
    // If they don't have a cookie, data.user will be null
    getUser()
      .then(res => {
        setState({
          ...state,
          loading: false,
          user: res.data.user
        })
      })

  }, []);

  return (
    <StoreContext.Provider value={{
      state: state,
      setState: setState
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)