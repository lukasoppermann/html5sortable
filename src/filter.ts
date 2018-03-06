/* global HTMLCollection, NodeList */
/**
 * Filter only wanted nodes
 * @param {NodeList|HTMLCollection} nodes
 * @param {String} selector
 * @returns {Array}
 */
export default (nodes: NodeList|HTMLCollection, selector: string): Array<Element> => {
  if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection)) {
    throw new Error('You must provide a nodeList/HTMLCollection of elements to be filtered.')
  }
  if (typeof selector !== 'string') {
    return Array.from(nodes)
  }

  return Array.from(nodes).filter((item) => item.nodeType === 1 && item.matches(selector))
}
