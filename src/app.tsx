import { createRoot } from 'react-dom/client';
import { useLayoutEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { getCurWeekGoals, getTodayTodos } from './notion';
import { Button, Checkbox, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CurWeekGoal = () => {
  useLayoutEffect(() => {
    getCurWeekGoals();
  }, []);
  return (
    <div className="cur-week-goal">
      <div className="title">
        <span>本周计划</span>
        <Button type="primary" size="small">
          打开 Notion
        </Button>
        <Button size="small">编辑</Button>
      </div>
    </div>
  );
};

const TodayTodos = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<{
    name: string;
    color: string;
  }>({
    name: '',
    color: '',
  });
  const [todos, setTodos] = useState<any>([]);

  useLayoutEffect(() => {
    getTodayTodos().then(
      (res) => {
        let today;
        const todayTodos = res.results.map((page: any) => {
          const { properties } = page;
          const { Name, 优先级: priority, 周几: whichDay, 完成: complete, 类型: type } = properties;

          if (!today) {
            today = {
              name: whichDay.select.name,
              color: whichDay.select.color,
            };
          }

          return {
            name: Name.title[0].plain_text,
            priority: {
              name: priority.select.name,
              color: priority.select.color,
            },
            type: {
              name: type.select.name,
              color: type.select.color,
            },
            complete: complete.chechbox,
          };
        });
        setToday(today);
        setTodos(todayTodos);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  return (
    <div className="today-todos">
      <div className="header">
        <div className="title">今日 Todo</div>
        <div className="today" style={{ backgroundColor: today.color }}>
          {today.name}
        </div>
      </div>
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        {todos.map((todo, i) => {
          return (
            <div className="todo" key={i}>
              <div className="left-bar" style={{ backgroundColor: todo.priority.color }} />
              <div className="todo-content">
                <div className="todo-name">{todo.name}</div>
                <div className="detail">
                  <Checkbox defaultChecked={todo.complete} />
                  <div className="detail-card" style={{ borderBottomColor: todo.type.color }}>
                    <span>{todo.type.name}</span>
                  </div>
                  <div className="detail-card" style={{ borderBottomColor: todo.priority.color }}>
                    <span>{todo.priority.name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Spin>
    </div>
  );
};

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
