/**
 * 删除对象中字段为空的字段
 * @param {*} object
 * @returns
 */
export function deleteEmptyProperty(object: any) {
  for (let i in object) {
    let value = object[i]
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          delete object[i]
          continue
        }
      }
      deleteEmptyProperty(value)
      if (isEmpty(value)) {
        delete object[i]
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        delete object[i]
      }
    }
  }
  return object
}

function isEmpty(object: any) {
  for (let name in object) {
    return false
  }
  return true
}
