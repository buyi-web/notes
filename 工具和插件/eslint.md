# ESLint

ESLint 是一款插件化的 JavaScript 代码静态检查工具，其核心是通过对代码解析得到的 AST（Abstract Syntax Tree，抽象语法树）进行模式匹配，来分析代码达到检查代码质量和风格问题的能力。

```js
// 全局安装
npm install -g eslint

// cd到项目根目录下
// 强制初始化package.json
npm init -force

// 初始化ESLint
eslint --init
```
## 配置

ESLint支持 eslint.js ， eslintrc.yaml ， eslintrc.json 类型的配置文件。

例如eslint.js 配置文件：

```js
module.exports = {
        env: {
                // 环境
                browser: true,
                es2021: true,
        },
        extends: [
                // 拓展
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
        ],
        parser: '@typescript-eslint/parser', // 解析器，本解析器支持Ts
        parserOptions: {
                // 解析器配置选项
                ecmaVersion: 12, // 指定es版本
                sourceType: 'module', // 代码支持es6，使用module
        },
        plugins: [
                // 插件
                '@typescript-eslint',
        ],
        rules: {
                // 规则
        },
};
```

配置项
- parser - 解析器
- parserOptions - 解析器选项
- env 和 globals - 环境和全局变量
- rules - 规则
  - off或0，关闭规则
  - warn或1，开启规则
  - error或2，开启规则，并会出错阻止代码运行
- plugins - 插件
- extends - 拓展

**注释**

下面这行注释表示在当前文件中禁用 console 关键字

```/* eslint no-console: "error" */```

**配置优先级**
规则是使用离要检测的文件最近的 .eslintrc文件作为最高优先级。

1. 行内配置
2. 命令行选项
3. 项目级配置
4. IDE环境配置