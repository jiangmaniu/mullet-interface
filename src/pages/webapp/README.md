## 迁移 APP 代码兼容注意

- 把 `style` 标签替换为 `className`
- `cn`工具函数，web 不支持传对象 `cn('text-primary',{})` 复制代码过来需要把`{}`去掉转成 `className` 或者`<div style={style} />`
- `APP`端默认 `flex-column`，`pc` 端默认 `flex-row`，`h5` 兼容处理需要加上 `flex-col`
- 拷贝过来的代码没有特殊需求，还是用 `View`,`Text` 标签写法，从 `weapp/components/Base` 导入即可

## 响应式切换 PC 和移动端适配入口地址

- 处理逻辑在 `src/hooks/useSwitchPcOrMobile.ts`
- `src/webapp/navigator`中`handleJumpMobile`
