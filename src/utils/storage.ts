const storage = {
  setStorage(key: string, value: Object) {
    let res = ''
    if (typeof value == 'object') {
        res = JSON.stringify(value)
    } else {

    }
    window.localStorage.setItem(key, res);
  },
  getStorage(key: string) {
      let values = window.localStorage.getItem(key);
      let res: any
      try {
          values && (res = JSON.parse(values))
      } catch {
          res = values
      }
      return res
  },
  delStorage(key: string) {
      if (window)
          window.localStorage.removeItem(key)
  },
}

export default storage