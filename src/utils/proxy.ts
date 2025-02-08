export const reflectHandler = {
  get: (target: any, prop: string, receiver: unknown) => {
    if (prop in target) {
      return Reflect.get(target, prop, receiver) // 使用 Reflect.get 访问目标对象的属性
    } else {
      // 如果属性不存在，可以自定义返回值，例如返回 undefined 或默认值
      console.log(`Property ${prop} does not exist`)
      return undefined // 或者返回其他默认值
    }
  }
}
