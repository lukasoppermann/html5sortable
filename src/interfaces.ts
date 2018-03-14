/* eslint-disable */
// There are many linting problems otherwise b/c isSortable, h5s, Element are 'undefined'

export class CustomElement extends Element {
    isSortable: boolean = false
    h5s: any = null
    constructor () {
      super()
    }
}
