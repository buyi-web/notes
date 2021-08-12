// 合并两个模块
//  ./src/a.js
//  ./src/index.js

(function(modules) {
    var cachedModule = {}; // 用户缓存模块导出的结果

    //__webpack_require__函数相当于是运行一个模块，得到模块导出结果
    function __webpack_require__(moduleId) {

        if(cachedModule[moduleId]){
            return cachedModule[moduleId]
        }

        var module = {
            exports: {}
        }
        var func = modules(moduleId); //得到该模块对应的函数
        func(module, module.exports, __webpack_require__); // 运行模块
        var result = module.exports; // 得到模块导出的结果
        cachedModule[moduleId] = result; //缓存结果
        return result;
    }

    //执行入口模块
    return __webpack_require__("./src/index.js");

})({ // 该对象保存了所有的模块，以及模块对应的代码
    "./src/a.js": function (module, exports) {
        // 使用eval主要是为了方便调试，eval中的代码会在单独的环境中执行
        eval("console.log(\"module a\")\nmodule.exports = \"aaa\";\n //# sourceURL=webpack:///./src/a.js")
    },
    "./src/index.js": function (module, exports, __webpack_require) {
        eval("console.log(\"index module\")\nvar a = __webpack_require(\"./src/a.js\")\nconsole.log(a)\n //# sourceURL=webpack:///./src/index.js")
    }
})