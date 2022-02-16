import { ComponentDataSelectors, HashToComponentRecord } from './types';
import { getHashToComponent, invertHashToComponent } from './utils';

import '../diff-dom';

const SOCK_COMPONENT_SELECTOR = '#gallery > div div[class]:not(.name):not(.price)';

const SOCK_COMPONENT_DATA_SELECTORS: ComponentDataSelectors = [
  ['img', ['src']],
  ['div.name', ['textContent']],
  ['div.price', ['textContent']],
];

const SOCK_HASH_KEY = 'sock_hash';

const SOCK_IDENTIFYING_TEXT = 'miku';

const getSockHash = (hashToComponent: HashToComponentRecord) => {
  const socks = [...document.querySelectorAll(SOCK_COMPONENT_SELECTOR)];
  const componentToHash = invertHashToComponent(hashToComponent);
  const sock = socks.find((sock) => sock.innerHTML.toLowerCase().includes(SOCK_IDENTIFYING_TEXT));
  if (sock === undefined) {
    throw Error(`Sock with identifying text '${SOCK_IDENTIFYING_TEXT}' could not be found`);
  }
  const sockHash = componentToHash.get(sock);

  if (sockHash === undefined) {
    throw Error(`Sock hash with identifying text '${SOCK_IDENTIFYING_TEXT}' could not be found.`);
  }

  localStorage.setItem(SOCK_HASH_KEY, sockHash);

  return sockHash;
};

export const identifySock = async () => {
  const hashToComponent = await getHashToComponent(
    SOCK_COMPONENT_SELECTOR,
    SOCK_COMPONENT_DATA_SELECTORS
  );
  console.info('Component Hashes:', hashToComponent);
  // gets sock hash from local storage. If hash isn't in local storage, retrieve it and store it in local storage
  const sockHash = localStorage.getItem(SOCK_HASH_KEY) ?? getSockHash(hashToComponent);
  // get sock element from hash to component record. If sock isn't in record, then it means data selectors changed, and the value needs to be updated in local storage
  const sock = hashToComponent[sockHash] ?? hashToComponent[getSockHash(hashToComponent)];

  console.info('Sock:', sock);

  sock.setAttribute('style', 'border: solid red 3px;');
};
