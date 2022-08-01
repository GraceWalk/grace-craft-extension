export enum STORAGE_KEY {
  CUR_WEEK_GOALS = 10001,
  TODAY_TODO,
}

export const getCraftStorage = (key: STORAGE_KEY) => {
  return craft.storageApi.get(key.toString()).then((res) => JSON.parse(res.data));
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
