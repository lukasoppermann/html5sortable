/* global describe,test,expect,jest */
/* eslint-env jest */
import debounce from '../src/debounce'
jest.useFakeTimers()

describe('Testing debounce', () => {
  test('debounce a function', () => {
    // setup
    const callback = jest.fn()
    const testdebounce = debounce(callback, 100)
    // execute
    testdebounce()
    expect(callback).not.toBeCalled()
    jest.advanceTimersByTime(50)
    testdebounce()
    jest.advanceTimersByTime(50)
    expect(callback).not.toBeCalled()
    // should not be called
    // Fast-forward until all timers have been executed
    jest.advanceTimersByTime(50)
    // Callback should have been called!
    expect(callback).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('debounce a function time 0', () => {
    // setup
    const callback = jest.fn()
    const testdebounce = debounce(callback)
    testdebounce()
    jest.advanceTimersByTime(0)
    expect(callback).toBeCalled()
  })
})
