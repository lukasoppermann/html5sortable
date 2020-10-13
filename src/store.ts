/* eslint-env browser */
/* eslint-disable no-use-before-define */
export const stores: Map<HTMLElement, Store> = new Map()
/* eslint-enable no-use-before-define */
/**
 * Stores data & configurations per Sortable
 * @param {Object} config
 */
export class Store implements Store {
  private _config: Map<string, any> = new Map() // eslint-disable-line no-undef
  private _placeholder?: HTMLElement = undefined // eslint-disable-line no-undef
  private _data: Map<string, any> = new Map() // eslint-disable-line no-undef
  /**
   * set the configuration of a class instance
   * @method config
   * @param {object} config object of configurations
   */
  set config (config: configuration) {
    if (typeof config !== 'object') {
      throw new Error('You must provide a valid configuration object to the config setter.')
    }
    // combine config with default
    const mergedConfig = Object.assign({}, config)
    // add config to map
    this._config = new Map(Object.entries(mergedConfig))
  }
  /**
   * get the configuration map of a class instance
   * @method config
   * @return {object}
   */

  get config (): configuration {
    // transform Map to object
    const config = {}
    this._config.forEach((value, key) => {
      config[key] = value
    })
    // return object
    return config
  }

  /**
   * set individual configuration of a class instance
   * @method setConfig
   * @param  key valid configuration key
   * @param  value any value
   * @return void
   */
  setConfig (key: string, value: any): void {
    if (!this._config.has(key)) {
      throw new Error(`Trying to set invalid configuration item: ${key}`)
    }
    // set config
    this._config.set(key, value)
  }

  /**
   * get an individual configuration of a class instance
   * @method getConfig
   * @param  key valid configuration key
   * @return any configuration value
   */
  getConfig (key: string): any {
    if (!this._config.has(key)) {
      throw new Error(`Invalid configuration item requested: ${key}`)
    }
    return this._config.get(key)
  }

  /**
   * get the placeholder for a class instance
   * @method placeholder
   * @return {HTMLElement|null}
   */
  get placeholder (): HTMLElement {
    return this._placeholder
  }

  /**
   * set the placeholder for a class instance
   * @method placeholder
   * @param {HTMLElement} placeholder
   * @return {void}
   */
  set placeholder (placeholder: HTMLElement): void {
    if (!(placeholder instanceof HTMLElement) && placeholder !== null) {
      throw new Error('A placeholder must be an html element or null.')
    }
    this._placeholder = placeholder
  }

  /**
   * set an data entry
   * @method setData
   * @param {string} key
   * @param {any} value
   * @return {void}
   */
  setData (key: string, value: Function): void {
    if (typeof key !== 'string') {
      throw new Error('The key must be a string.')
    }
    this._data.set(key, value)
  }

  /**
   * get an data entry
   * @method getData
   * @param {string} key an existing key
   * @return {any}
   */
  getData (key: string): any {
    if (typeof key !== 'string') {
      throw new Error('The key must be a string.')
    }
    return this._data.get(key)
  }

  /**
   * delete an data entry
   * @method deleteData
   * @param {string} key an existing key
   * @return {boolean}
   */
  deleteData (key: string): boolean {
    if (typeof key !== 'string') {
      throw new Error('The key must be a string.')
    }
    return this._data.delete(key)
  }
}
/**
 * @param {HTMLElement} sortableElement
 * @returns {Class: Store}
 */
export default (sortableElement: HTMLElement): Store => {
  // if sortableElement is wrong type
  if (!(sortableElement instanceof HTMLElement)) {
    throw new Error('Please provide a sortable to the store function.')
  }
  // create new instance if not avilable
  if (!stores.has(sortableElement)) {
    stores.set(sortableElement, new Store())
  }
  // return instance
  return stores.get(sortableElement)
}
