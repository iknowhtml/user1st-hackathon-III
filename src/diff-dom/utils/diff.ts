import { HashNode } from '../hash-node';

const wasNodeInserted = (current: HashNode, previous: HashNode) =>
  current !== undefined && previous === undefined;

const wasNodeUpdated = (current: HashNode, previous: HashNode) => current.value !== previous.value;

const isNewLinesSpacesOnly = (str: string) => /^[\\n]*[\s]*$/.test(str);

export const getUpsertedNodes = (
  current: HashNode,
  previous: HashNode,
  currentNode: Node,
  insertedNodes: Node[] = [],
  updatedNodes: Node[] = []
) => {
  if (currentNode.textContent !== null && !isNewLinesSpacesOnly(currentNode.textContent)) {
    if (wasNodeInserted(current, previous)) {
      insertedNodes.push(currentNode);
    } else if (wasNodeUpdated(current, previous)) {
      updatedNodes.push(currentNode);
    }
  }
  if (
    !current.children ||
    !previous?.children ||
    currentNode.childNodes === null ||
    current.hash === previous.hash
  ) {
    return [insertedNodes, updatedNodes];
  }
  for (let i = 0; i < current.children.length; i++) {
    getUpsertedNodes(
      current.children[i],
      previous.children[i],
      currentNode.childNodes[i],
      insertedNodes,
      updatedNodes
    );
  }
  return [insertedNodes, updatedNodes];
};

const wasNodeDeleted = (current: HashNode, previous: HashNode) =>
  (current === undefined || isNewLinesSpacesOnly(current.value)) && previous !== undefined;

const getDeletedHashNodes = (
  current: HashNode,
  previous: HashNode,
  deletedHashNodes: HashNode[] = []
) => {
  if (wasNodeDeleted(current, previous)) {
    if (!isNewLinesSpacesOnly(previous.value)) {
      deletedHashNodes.push(previous);
    }
  }

  if (previous.children === null || !current?.children) {
    return deletedHashNodes;
  }

  for (let i = 0; i < previous.children.length; i++) {
    getDeletedHashNodes(current.children[i], previous.children[i], deletedHashNodes);
  }

  return deletedHashNodes;
};

const reconstructHtml = ({ value, children }: HashNode): string => {
  if (children === null) {
    return value;
  }
  return value.replace(/(<)(?=\/)/, `${children.map(reconstructHtml).join('')}$1`);
};

const createDomNode = (html: string) => {
  const placeholder = document.createElement('div');
  placeholder.innerHTML = html;
  const node = placeholder.firstElementChild;
  return node;
};

export const getDeletedNodeHtmlStrings = (current: HashNode, previous: HashNode) => {
  const deletedHashNodes = getDeletedHashNodes(current, previous);
  const deletedNodeHtml = deletedHashNodes.map(reconstructHtml);
  return deletedNodeHtml;
};

export const getDeletedNodes = (current: HashNode, previous: HashNode) => {
  const deletedNodes = getDeletedNodeHtmlStrings(current, previous).map(createDomNode);
  return deletedNodes;
};
