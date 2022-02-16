import { HashNode } from '../types';
import { hashString } from 'utils';

export const getDomHashTree = () => createHashNode(document.body);

export const createHashNode = async (node: Node): Promise<HashNode> => {
  const { childNodes } = node;
  const isBranchNode = childNodes.length > 0;

  const children = isBranchNode
    ? await Promise.all([...childNodes].map((node) => createHashNode(node)))
    : null;

  const value =
    node instanceof Element ? node.outerHTML.replace(node.innerHTML, '') : node.textContent ?? '';

  const childrenHash = await hashString(
    children === null
      ? value
      : `${value}${children.reduce((accumulator, { hash }) => `${accumulator}${hash}`, '')}`
  );

  return {
    hash: childrenHash,
    value,
    children,
  };
};
