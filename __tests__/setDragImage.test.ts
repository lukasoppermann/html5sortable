/* global describe,test,expect,jest,Event */
import setDragImage from '../src/setDragImage'
import { mockInnerHTML } from './helpers'

describe('Testing setDragImage', () => {
  // setup test html
  document.body.innerHTML = mockInnerHTML
  // mock element
  const element = document.querySelector('.li-first')
  element.getClientRects = () => {
    return [{
      left: 10,
      right: 7,
      top: 7,
      bottom: 10
    }]
  }
  // create MockEvent
  class DragEvent extends Event {
  /* eslint-disable constructor-super */
    constructor (name, data = null) {
      super(name)
      this.pageX = 100 // eslint-disable-line no-this-before-super
      this.pageY = 200 // eslint-disable-line no-this-before-super
      this.dataTransfer = { // eslint-disable-line no-this-before-super
        effectAllowed: 'fake',
        setData: (data) => {
          this.data = data // eslint-disable-line no-this-before-super
        },
        setDragImage: (element, posX, posY) => {
          this.dragItem = { // eslint-disable-line no-this-before-super
            element: element,
            posX: posX,
            posY: posY
          }
        }
      }
    }

    /* eslint-enable constructor-super */
    get () {
      return this
    }

    get target ():any {
      return {
        id: 1
      }
    }
  }

  test('No event provided', () => {
    expect(() => { setDragImage(null, null, null) }).toThrowError('setDragImage requires a DragEvent as the first argument.')
  })

  test('No element provided', () => {
    // setup
    const event = new DragEvent('dragstart')
    // assert
    expect(() => { setDragImage(event, null, null) }).toThrowError('setDragImage requires the dragged element as the second argument.')
  })

  test('Event does not support Drag', () => {
    // setup
    const event = new DragEvent('dragstart')
    // remove setDragImage to simulate no support
    delete event.dataTransfer.setDragImage
    // execute
    setDragImage(event, document.querySelector('.li-first'), null)
    // assert
    expect(event.dataTransfer.effectAllowed).not.toEqual('copyMove')
  })

  test('Event supports Drag', () => {
    const event = new DragEvent('dragstart')
    // execute
    setDragImage(event, element)
    // assert
    expect(event.dataTransfer.effectAllowed).toEqual('copyMove')
    expect(event.data).toEqual('text/plain')
    expect(event.dragItem.element).toEqual(element)
    expect(event.dragItem.posX).toEqual(90)
    expect(event.dragItem.posY).toEqual(193)
  })

  test('Invalid customDragImage function', () => {
    const event = new DragEvent('dragstart')
    // execute & assert
    expect(() => { setDragImage(event, element, () => { return { element: element } }) }).toThrowError('The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].')
    expect(() => { setDragImage(event, element, () => { return { element: element, posX: 10 } }) }).toThrowError('The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].')
    expect(() => { setDragImage(event, element, () => { return { element: element, posY: 10, posX: 'hello' } }) }).toThrowError('The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].')
  })

  test('Valid customDragImage Function', () => {
    const event = new DragEvent('dragstart')
    const mockCustomDragImageFn = jest.fn().mockName('mockCustomDragImageFn').mockReturnValue({
      element: element,
      posX: 111,
      posY: 222
    })
    // execute
    setDragImage(event, element, mockCustomDragImageFn)
    // assert
    expect(event.dataTransfer.effectAllowed).toEqual('copyMove')
    expect(event.data).toEqual('text/plain')
    // custom function to be called once
    expect(mockCustomDragImageFn.mock.calls.length).toBe(1)
    // first argument in call
    expect(mockCustomDragImageFn.mock.calls[0][0]).toBe(element)
    // second argument in call
    expect(mockCustomDragImageFn.mock.calls[0][1]).toEqual({
      left: 10,
      right: 7,
      top: 7,
      bottom: 10
    })
    // third argument in call
    expect(mockCustomDragImageFn.mock.calls[0][2]).toBe(event)
  })
})
