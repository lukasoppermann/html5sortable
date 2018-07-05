/* global describe,test,expect,beforeEach,CustomEvent */
import enableHoverClass from '../../src/hoverClass'
import store from '../../src/store'
import {mockInnerHTML} from '../helpers'

describe('Testing mouseenter and mouseleave events for hoverClass', () => {
  let ul, li, liSecond
  // setup html
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.querySelector('.sortable')
    li = ul.querySelector('li')
    liSecond = ul.querySelector('.li-second')
    // setup data
    store(ul).config = {
      hoverClass: 'hover-class',
      items: 'li',
      throttleTime: 0
    }
    // enable module
    enableHoverClass(ul, true)
  })

  test('should not add class on hover event when disabled', () => {
    // disable hover class
    enableHoverClass(ul, false)
    store(ul).setConfig('hoverClass', null)
    // get inital class list length
    let classListLength = li.classList.length
    // trigger mouseenter event
    li.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: li
    }))
    // assert that class list lenght did not change
    expect(li.classList.length).toBe(classListLength)
  })

  test('should not add class on hover event hoverClass is null', () => {
    // disable hover class
    enableHoverClass(ul, false)
    store(ul).setConfig('hoverClass', null)
    enableHoverClass(ul, true)
    // get inital class list length
    let classListLength = li.classList.length
    // trigger mouseenter event
    li.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: li
    }))
    // assert that class list lenght did not change
    expect(li.classList.length).toBe(classListLength)
  })

  test('should correctly add class on hover event, and remove on hover other element', () => {
    expect(li.classList.contains('hover-class')).toBe(false)
    // trigger mouse event
    li.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: li
    }))
    // assert that class was added
    expect(li.classList.contains('hover-class')).toBe(true)

    // trigger mouseleave events
    liSecond.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: liSecond
    }))
    // assert that class was removed
    expect(liSecond.classList.contains('hover-class')).toBe(true)
    expect(li.classList.contains('hover-class')).toBe(false)
  })

  test('should remove class when leaving sortable', () => {
    // trigger mouse event
    li.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: li
    }))
    // assert that class was added
    expect(li.classList.contains('hover-class')).toBe(true)
    // trigger mouseleave events
    ul.dispatchEvent(new MouseEvent('mouseleave', {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      target: ul
    }))
    // assert that class was removed
    expect(li.classList.contains('hover-class')).toBe(false)
  })

  test('should not fire when button is pressed', () => {
    // trigger mouse event
    li.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      buttons: 1,
      target: li
    }))
    // assert that class was added
    expect(li.classList.contains('hover-class')).toBe(false)
  })

})
