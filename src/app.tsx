import { createRoot } from 'react-dom/client';
import TodayTodos from './TodayTodos';
import WeekGoal from './WeekGoal';
import 'antd/dist/antd.css';
import './index.less';
import { createContext, useState } from 'react';

export const StateContext = createContext(0);

const App = () => {
  const [count, setCount] = useState(0);

  const todoCheck = () => setCount((count) => count + 1);

  return (
    <StateContext.Provider value={count}>
      <WeekGoal />
      <TodayTodos todoCheck={todoCheck} />
    </StateContext.Provider>
  );
};

const initApp = () => {
  const container = document.getElementById('grace');
  const root = createRoot(container);
  root.render(<App />);
};

export default initApp;
