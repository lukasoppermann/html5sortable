export default interface Store {
  placeholder: Element
  config: object
  getConfig(key: string)
  setConfig(key: string, value: any)
}
