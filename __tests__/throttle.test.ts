/* global describe,test,expect */
/* eslint-env jest */
import _throttle from '../src/throttle'

describe('Testing throttle', () => {
  test('throttle should not allow functions to be called multiple times within the timeframe', () => {
    let value = 0
    let fn = _throttle(() => {
      value++
    }, 100)
    // call function twice immeditatly
    fn()
    fn()
    // assert
    expect(value).toBe(1)
  })
  
  test('throttle should allow functions to be called multiple times after the timeframe', () => {
    let value = 0
    let fn = _throttle(() => {
      value++
    }, 10)
    // call function twice immeditatly
    global.Date.now = jest.fn(() => 1490760656000)
    fn()
    global.Date.now = jest.fn(() => 1490760657000)
    fn()
    // assert
    expect(value).toBe(2)
  })
})
