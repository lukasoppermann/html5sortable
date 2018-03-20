export default interface Store {
  placeholder: HTMLElement
  config: object
  getConfig(key: string)
  setConfig(key: string, value: any)
}
