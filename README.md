## Node 版本

> v20.10.0

全局安装 `yarn`

```bash
npm i -g yarn
```

## 安装依赖

```
yarn install
```

## 本地开发启动

```bash
# 启动本地开发
yarn dev

# 启动本地线上环境
yarn dev:prod

# 启动本地mock服务
yarn start:mock
```

## 打包部署

### 打包线上测试环境

```bash
yarn build:dev
```

### 打包到生产环境

```bash
# 执行打包命令
yarn build
```

打包成功目录是`dist`，把`dist`下的静态资源部署即可

> 配置 Nginx 接口代理

```bash
server {
  # 监听端口
  listen 8000;
  # 监听地址
  server_name 127.0.0.1;

  # 静态资源
  location / {
    # 静态资源位置
    root /usr/share/nginx/html;
    # 设置默认页
    index index.html;
    # 重要：访问页面404重定向到index.html
    try_files $uri $uri/ /index.html;
  }

  # baseURL接口转发
  location ~ /api/ {
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  X-Forwarded-Proto https;
    proxy_set_header  X-Forwarded-For $remote_addr;
    proxy_set_header  X-Forwarded-Host $remote_addr;
    # 代理到后台接口服务
    proxy_pass http://api.mcp.lan;
  }
}
```

**关于分支说明**

- 开发提交分支 `dev`
- 正式环境分支 `main`（发版需合并`dev`到`main`）

## 提交代码规范

> 使用.husky 来规范提交代码

**按 git commit 提交规范，否则限制代码提交**

- feat：新功能
- fix：修复 bug
- docs：仅仅修改了文档，比如 README、CHANGELOG 等
- style：不影响代码含义的改动，比如去掉空格、改变缩进、增删分号等
- refactor：既不新增功能，也不是修复 bug 的代码改动
- perf：提高代码性能的改动
- test：添加或修改代码的测试
- build：构建系统或外部依赖项的更改
- ci：持续集成的配置文件和脚本的修改
- chore：不修改 src 或 test 的其他修改，比如构建过程或辅助工具的变动

**使用 cz 更方便**

```bash
# 执行触发lint-staged执行lint规范检查
yarn cz
```

## 安装 vscode 插件，规范化代码

> 项目中配置了对应的 lint 插件，结合 vscode 插件保存代码格式化

- Prettier - Code formatter
- i18n Ally
- ESLint
- stylelint
- EditorConfig for VS Code
- Tailwind CSS IntelliSense
- Tailwind Docs
- px to rem & rpx & vw (cssrem)
