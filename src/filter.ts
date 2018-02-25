import _matches from './matches'
/**
 * Filter only wanted nodes
 * @param {Array|NodeList} nodes
 * @param {Array/string} wanted
 * @returns {Array}
 */
export default function (nodes, wanted) {
  if (!wanted) {
    return Array.prototype.slice.call(nodes)
  }
  var result = []
  for (var i = 0; i < nodes.length; ++i) {
    if (typeof wanted === 'string' && _matches(nodes[i], wanted)) {
      result.push(nodes[i])
    }
    if (wanted.indexOf(nodes[i]) !== -1) {
      result.push(nodes[i])
    }
  }
  return result
}
