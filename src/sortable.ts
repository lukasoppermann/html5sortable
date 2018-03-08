export default class{

  public isSortable: boolean = false
  private _options: object
  private _defaultOptions: object = {
    copy: true
  }

  constructor(sortableContainer: Element, options: object = {}) {
    // check if valid sortable
    if (sortableContainer instanceof Element) {
      throw new Error('The sortableContainer must be a valid element.')
    }
    // merge options
    this._options = Object.assign(this._defaultOptions, options)
    // set to true if initialization worked
    this.isSortable = true
  }

  public serialize () {
    return 'serialize'
  }

  public get options () {
    return this._options
  }

  public set options (options: object = {}) {
    this._options = Object.assign(this._options, options)
  }

  public getOption (option: string) {
    // check if option is valid
    if (!this._options.hasOwnProperty(option)) {
      throw new Error('Invalid option specified.')
    }
    // return specific option
    return this._options[option]
  }

  public setOption (option: string, value: any) {
    // check if option is valid
    if (!this._options.hasOwnProperty(option)) {
      throw new Error('Invalid option specified.')
    }
    // return specific option
    return this._options[option] = value
  }
}
