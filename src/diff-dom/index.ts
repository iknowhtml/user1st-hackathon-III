import { addHashTreeToHistory, getHashTreeHistory } from './hash-history';
import { getUpsertedNodes, getDomHashTree } from './hash-node';
import { getDeletedNodeHtmlStrings, getDeletedNodes } from './utils';

const diffDom = async () => {
  const domHashTree = await getDomHashTree();
  console.info('DOM Hash Tree Data Structure:', domHashTree);

  const pageHashHistory = getHashTreeHistory();

  if (pageHashHistory.length > 0) {
    const [, previousDomHashTree] = pageHashHistory[0];
    const [insertedNodes, updatedNodes] = getUpsertedNodes(
      domHashTree,
      previousDomHashTree,
      document.body
    );

    console.info('Inserted Nodes:', insertedNodes);
    console.info('Updated Nodes:', updatedNodes);

    const deletedNodeHtmls = getDeletedNodeHtmlStrings(domHashTree, previousDomHashTree);
    console.info('Deleted Nodes:', deletedNodeHtmls);
  }

  // addHashTreeToHistory(domHashTree, pageHashHistory);
};

diffDom();
