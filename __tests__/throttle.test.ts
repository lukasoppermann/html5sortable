/* global describe,test,expect */
/* eslint-env jest */
import throttle from '../src/throttle'

describe('Testing throttle', () => {
  test('throttle should not allow functions to be called multiple times within the timeframe', () => {
    let value = 0
    const fn = throttle(() => {
      value++
    })
    // call function twice immeditatly
    fn()
    fn()
    // assert
    expect(value).toBe(1)
  })

  test('throttle should allow functions to be called multiple times after the timeframe', () => {
    let value = 0
    const fn = throttle(() => {
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

  test('throttle should fail if no functin is provided', () => {
    // assert
    expect(() => { throttle('test', 10) }).toThrowError('You must provide a function as the first argument for throttle.')
  })

  test('throttle should fail if threshold is not a number', () => {
    // assert
    expect(() => { throttle(() => { }, '10') }).toThrowError('You must provide a number as the second argument for throttle.')
  })
})
