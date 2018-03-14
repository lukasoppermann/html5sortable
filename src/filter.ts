/* eslint-env browser */
/**
 * Filter only wanted nodes
 * @param {NodeList|HTMLCollection|Array} nodes
 * @param {String} selector
 * @returns {Node[]|Element[]}
 */
export default (nodes: NodeList|HTMLCollection|Array, selector: string): Array<Element> => {
  if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection || nodes instanceof Array)) {
    throw new Error('You must provide a nodeList/HTMLCollection/Array of elements to be filtered.')
  }
  if (typeof selector !== 'string') {
    return Array.from(nodes)
  }
  return Array.from(nodes).filter((item) => {
    /*
    Type changed when converted into an array, eslint warning as the matches method
    does not exist on type Node. Best/worst fix is likely to create a custom
    nodelist with custom nodes
    */
    return item.nodeType === 1 && item.matches(selector)
  })
}
