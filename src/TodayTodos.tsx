import { useLayoutEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { getTodayTodos } from './notion';
import { STORAGE_KEY, getCraftStorage, setCraftStorage } from './craft';
import { Checkbox, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as dayjs from 'dayjs';

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

  const getTodos = () => {
    getTodayTodos().then(
      (res) => {
        let today;
        const todos = res.results.map((page: any) => {
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

        setCraftStorage(STORAGE_KEY.TODAY_TODO, { date: dayjs().date(), today, todos });
        setToday(today);
        setTodos(todos);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  useLayoutEffect(() => {
    getCraftStorage(STORAGE_KEY.TODAY_TODO).then((value) => {
      if (typeof value === 'object') {
        const { date, today, todos } = value;
        // 如果请求过当天的 todos，直接展示
        if (date === dayjs().date()) {
          setToday(today);
          setTodos(todos);
          setLoading(false);
        }
      }
      // 后台更新当天的 todos
      getTodos();
    });
  }, []);

  return (
    <div className="today-todos">
      <div className="header">
        <div className="title">今日 Todo</div>
        <div className="today" style={{ backgroundColor: today?.color }}>
          {today?.name}
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

export default TodayTodos;
