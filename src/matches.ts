/**
 * Tests if an element matches a given selector. Comparable to jQuery's $(el).is('.my-class')
 * @param {el} DOM element
 * @param {selector} selector test against the element
 * @returns {boolean}
 */
/* istanbul ignore next */
export default function (el, selector) {
  return (el.matches || el.msMatchesSelector).call(el, selector)
}
