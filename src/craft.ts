export enum STORAGE_KEY {
  CUR_WEEK_GOALS = 10001,
  TODAY_TODO,
  NOTION_LINK,
}

export const getCraftStorage = (key: STORAGE_KEY) => {
  return craft.storageApi.get(key.toString()).then((res) => {
    if (res.status === 'success') {
      try {
        const data = JSON.parse(res?.data);
        return data;
      } catch (_) {
        return res?.data;
      }
    } else {
      return null;
    }
  });
};

export const setCraftStorage = (key: STORAGE_KEY, value: any) => {
  let storageValue;
  if (typeof value === 'object') {
    storageValue = JSON.stringify(value);
  } else {
    storageValue = String(value);
  }
  return craft.storageApi.put(key.toString(), storageValue);
};
