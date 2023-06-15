import React, { createContext, useContext, useState } from 'react';
interface MyContextInterface {
  data: string;
  setData: (value: string) => void;
}
const MyContext = createContext<MyContextInterface | undefined>(undefined);
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};
export const MyContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [data, setData] = useState('');

  const value: MyContextInterface = {
    data,
    setData,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
