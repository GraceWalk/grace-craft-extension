import { Button, Collapse, Input, message, Progress, Tooltip } from 'antd';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import * as dayjs from 'dayjs';
import { BG_COLOR_MAP, getCurWeekGoals } from './notion';
import notionPng from '../notion.png';
import { CheckCircleOutlined } from '@ant-design/icons';
import { getCraftStorage, setCraftStorage, STORAGE_KEY } from './craft';
import { StateContext } from './app';

const TurnToNotion = () => {
  const [link, setLink] = useState<string>('');

  const updateLink = (newLink: string) => {
    setCraftStorage(STORAGE_KEY.NOTION_LINK, newLink);
  };

  useLayoutEffect(() => {
    getCraftStorage(STORAGE_KEY.NOTION_LINK).then((link) => link && setLink(link));
  }, []);

  return (
    <Tooltip
      placement="bottom"
      title={
        <div
          style={{ display: 'flex' }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Input
            id="link-input"
            style={{ marginRight: 4, backgroundColor: 'transparent', color: '#fff' }}
            size="small"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Button
            onClick={() => {
              updateLink(link);
            }}
            size="small"
            icon={<CheckCircleOutlined />}
          ></Button>
        </div>
      }
      mouseEnterDelay={1}
    >
      <div
        className="open-notion"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          const input = document.createElement('input');
          document.body.appendChild(input);
          input.setAttribute('value', link);
          input.select();
          if (document.execCommand('copy')) {
            document.execCommand('copy');
          }
          document.body.removeChild(input);
        }}
      >
        <img src={notionPng} />
      </div>
    </Tooltip>
  );
};

const WeekGoal = () => {
  const count = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendLoading, setBackendLoading] = useState<boolean>(false);
  const [goals, setGoals] = useState<any>([]);

  const getWeekGoals = () => {
    setBackendLoading(true);
    getCurWeekGoals().then(
      (res) => {
        const goals = res.results.map((page: any) => {
          const { properties } = page;
          const { 名称: name, 子任务数: subTaskNum, 子任务完成数: checkedSubTaskNum, 标签: tag } = properties;

          return {
            name: name.title[0].plain_text,
            subTaskNum: subTaskNum.rollup?.number,
            checkedSubTaskNum: checkedSubTaskNum.rollup?.number,
            tag: {
              name: tag.select?.name,
              color: tag.select?.color,
            },
          };
        });
        setGoals(goals);
        setCraftStorage(STORAGE_KEY.CUR_WEEK_GOALS, {
          weekDate: dayjs().startOf('week').format('YYYY-MM-DD'),
          goals,
        });
        setLoading(false);
        setBackendLoading(false);
      },
      () => {
        setLoading(false);
        setBackendLoading(false);
        message.error('周计划更新失败');
      }
    );
  };

  useLayoutEffect(() => {
    getCraftStorage(STORAGE_KEY.CUR_WEEK_GOALS).then((value) => {
      if (typeof value === 'object' && value !== null) {
        const { weekDate, goals } = value;
        // 如果请求过当天的 todos，直接展示
        if (weekDate === dayjs().startOf('week').format('YYYY-MM-DD')) {
          setGoals(goals);
          setLoading(false);
        }
      }
      // 后台更新本周目标
      getWeekGoals();
    });
  }, [count]);

  return (
    <>
      <Collapse ghost={true} className="week-goal" defaultActiveKey={['1']} expandIcon={() => <></>} expandIconPosition="end">
        <Collapse.Panel
          key="1"
          header={
            <div className="header">
              <span className="title">
                <span className={`icon ${backendLoading ? 'loading' : ''}`}>👾</span> 本周计划
              </span>
              <TurnToNotion />
            </div>
          }
        >
          <div className="goal-container">
            {goals.map((goal) => {
              return (
                <div className="goal">
                  <Progress
                    type="circle"
                    strokeLinecap="round"
                    trailColor="#828389"
                    strokeWidth={10}
                    percent={((goal?.checkedSubTaskNum / goal?.subTaskNum) * 100) ^ 0}
                    format={(p) => p}
                    status="active"
                    width={40}
                  />
                  <div className="right">
                    <div className="title">{goal?.name}</div>
                    <div className="detail">
                      {goal?.tag?.name && (
                        <div className="type" style={{ backgroundColor: BG_COLOR_MAP[goal?.tag?.color], color: goal?.tag?.color }}>
                          {goal?.tag?.name}
                        </div>
                      )}
                      <div className="task-num">
                        完成: {goal?.checkedSubTaskNum} / {goal?.subTaskNum}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default WeekGoal;
