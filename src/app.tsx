import { createRoot } from 'react-dom/client';
import TodayTodos from './TodayTodos';
import 'antd/dist/antd.css';
import './index.css';

// const CurWeekGoal = () => {
//   useLayoutEffect(() => {
//     getCurWeekGoals();
//   }, []);
//   return (
//     <div className="cur-week-goal">
//       <div className="title">
//         <span>本周计划</span>
//         <Button type="primary" size="small">
//           打开 Notion
//         </Button>
//         <Button size="small">编辑</Button>
//       </div>
//     </div>
//   );
// };

const App = () => {
  return (
    <div>
      {/* <CurWeekGoal /> */}
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
