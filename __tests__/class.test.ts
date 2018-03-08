import Sortable from '../src/sortable'

describe('Testing es6 class', () => {
  test('fake', () => {
    expect(1).toEqual(1)
  })


  test('Class is sortable', () => {
    let s = new Sortable('test')
    console.log(s.isSortable)
  })

  test('Class method serialize', () => {
    let sortable = new Sortable('test')
    console.log(sortable.serialize())
    console.log(sortable.options)
  })

})
