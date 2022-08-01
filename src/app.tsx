import { createRoot } from "react-dom/client";
import { Client } from "@notionhq/client";
// api key 需要自行申请
import { PROXY_URL, NOTION_KEY, NOTION_DATABASE_WEEK_TODO_ID } from "../api";

const getFetchUrl = (url) =>
  PROXY_URL + url.substring(url.indexOf("/api.notion.com"));

const notion = new Client({
  auth: NOTION_KEY,
  fetch: async (url, init) => fetch(getFetchUrl(url), init),
});

async function getDataBase() {
  const res = await notion.databases.query({
    database_id: NOTION_DATABASE_WEEK_TODO_ID,
  });
}

const App = () => {
  return <>Hello Craft Extension</>;
};

const initApp = () => {
  getDataBase();
  const container = document.getElementById("grace");
  const root = createRoot(container);
  root.render(<App />);
};

export default initApp;
