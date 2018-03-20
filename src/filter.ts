/* eslint-env browser */
/**
 * Filter only wanted nodes
 * @param {NodeList|HTMLCollection|Array} nodes
 * @param {String} selector
 * @returns {Array}
 */
export default (nodes: NodeList|HTMLCollection|Array<HTMLElement>, selector: string): Array<HTMLElement> => {
  if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection || nodes instanceof Array)) {
    throw new Error('You must provide a nodeList/HTMLCollection/Array of elements to be filtered.')
  }
  let elArray:Element[] = Array.from(nodes)
  if (typeof selector !== 'string') {
    return elArray
  }

  return elArray.filter((item) => item.nodeType === 1 && item.matches(selector))
}
