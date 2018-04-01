interface Store {
  placeholder: HTMLElement
  config: object
  getConfig(key: string): any
  setConfig(key: string, value: any): void
  getData(key: string): any
  setData(key: string, value: any): void
  deleteData(key: string): void
}
