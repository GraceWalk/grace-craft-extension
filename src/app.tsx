import { createRoot } from 'react-dom/client';
import TodayTodos from './TodayTodos';
import WeekGoal from './WeekGoal';
import 'antd/dist/antd.css';
import './index.less';

const App = () => {
  return (
    <div>
      <WeekGoal />
      <TodayTodos />
    </div>
  );
};

const initApp = () => {
  const container = document.getElementById('grace');
  const root = createRoot(container);
  root.render(<App />);
};

export default initApp;
