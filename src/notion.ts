import * as dayjs from 'dayjs';
import { Client } from '@notionhq/client';
// api key 需要自行申请
import { PROXY_URL, NOTION_KEY, NOTION_DATABASE_WEEK_TODO_ID, NOTION_DATABASE_WEEK_GOAL_ID } from '../api';

export const getFetchUrl = (url) => PROXY_URL + url.substring(url.indexOf('/api.notion.com'));

export const notion = new Client({
  auth: NOTION_KEY,
  fetch: async (url, init) => {
    init.headers['Notion-Version'] = '2022-02-22';
    return fetch(getFetchUrl(url), init);
  },
});

export function getCurWeekGoals() {
  return notion.databases.query({
    database_id: NOTION_DATABASE_WEEK_GOAL_ID,
  });
}

export function getTodayTodos() {
  return notion.databases.query({
    database_id: NOTION_DATABASE_WEEK_TODO_ID,
    filter: {
      and: [
        {
          property: '日期',
          date: {
            equals: dayjs().format('YYYY-MM-DD'),
          },
        },
      ],
    },
  });
}
