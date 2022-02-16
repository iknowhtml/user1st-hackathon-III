import { PAGE_HASH_HISTORY_KEY } from './consts';
import { HashNode } from '../hash-node';
import { PageHashHistory } from './types';

export const addHashTreeToHistory = (domHashTree: HashNode, pageHashHistory: PageHashHistory) => {
  const timestamp = new Date().getTime();
  pageHashHistory.unshift([timestamp, domHashTree]);
  localStorage.setItem(PAGE_HASH_HISTORY_KEY, JSON.stringify(pageHashHistory));
};

export const getHashTreeHistory = () =>
  JSON.parse(localStorage.getItem(PAGE_HASH_HISTORY_KEY) ?? '[]');
