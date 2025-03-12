# 表达式解析器(TS版)

本项目由TypeScript编写的表达式解析器，支持四则运算、函数调用、变量引用等功能的解析。访问[在线演示](http://play-expression-parser.yefu24324.com)查看效果。

## 项目结构

```plaintext
./     
├─libs
│  └─expression-parser-ts          // 表达式解析器
│
└─src                              // 在线演示前端
```


## 安装

要安装本项目，请确保您已安装Node.js和pnpm。然后在项目根目录下运行以下命令：

```bash
pnpm install
```

## 本地开发

在本地开发时，您可以使用以下命令启动开发服务器：

```bash
pnpm start
```

## 发布部署

要构建项目以进行生产部署，请运行：

```bash
pnpm build
```

构建完成后，您可以使用以下命令启动生产服务器：

```bash
pnpm serve
```

## 运行测试

运行该命令可以对表达式解析的测试用例进行一次测试。详细可以查看libs/expression-parser-ts/src目录下所有的.test.ts后缀文件

```bash
pnpm test
```
