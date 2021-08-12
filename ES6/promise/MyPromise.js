
const MyPromise = (() => {

    const PENDING = 'pending',
    RESOLVED = 'fulfilled',
    REJECTED = 'rejected',
    thenable = Symbol('thenable'),
    catchable = Symbol('catchable'),
    promiseType = Symbol('promiseType')
    promiseStatus = Symbol('promiseStatus'),
    promiseValue = Symbol('promiseValue'),
    settled = Symbol('settled'), //已决阶段的通用函数
    changeStatus = Symbol('changeStatus'); //改变promise状态

    return class {
        constructor (executor) {
            this[promiseStatus] = PENDING;
            this[promiseValue] = undefined;
            this[promiseType] = 'MyPromise'
            this[thenable] = [];
            this[catchable] = [];

            const resolve = (data) => {
                this[changeStatus](RESOLVED, data, this[thenable])
            }
            const reject = (data) => {
                this[changeStatus](REJECTED, data, this[catchable])
            }

            try {
                executor(resolve, reject)
            } catch (error) {
                this[changeStatus](REJECTED, error); //捕获错误，有错误推向reject
            }
        }

        then(thenHandle, catchHandle)  {
            return new MyPromise((resolve, reject) => {
                console.log('new ');
                this[settled] (data => {
                    try{
                        if(typeof thenHandle === 'function') {
                            const result = thenHandle(data)
                            if(result instanceof MyPromise) { // 返回的result是一个promise对象的处理
                                result.then(data => resolve(data), error => reject(error))
                            }else {
                                resolve(result)
                            }
                        }else { // then参数不是函数的处理

                        }
                    } catch (error) {
                        reject(error)
                    }
                }, RESOLVED, this[thenable])

                if(catchHandle != undefined) {
                    this[settled](data => {
                        try {
                            if (typeof catchHandle === 'function') {
                                var result = catchHandle(data);
                                reject(result);
                            }else { // catch参数不是函数的处理
    
                            }
                        } catch (error) {
                            reject(error)
                        }
                    }, REJECTED, this[catchable])
                }
            })
        }

        catch(catchHandle) {
            return new MyPromise((resolve, reject) => {
                this[settled](data => {
                    try {
                        if (typeof catchHandle === 'function') {
                            var result = catchHandle(data);
                            reject(result);
                        }else { // catch参数不是函数的处理
                            console.log(typeof catchHandle);
                        }
                    } catch (error) {
                        reject(error)
                    }
                }, REJECTED, this[catchable])
            })
        }

        /**
         * 改变当前Promise的状态
         * @param {*} status 
         * @param {*} value 
         * @param {*} queue 执行的作业队列
         */
        [changeStatus] (status, value, queue) {
            if (this[promiseStatus] !== PENDING) {
                //状态无法变更
                return;
            }
            this[promiseStatus] = status
            this[promiseValue] = value
            //状态改变时，执行相应队列中的函数
            if(queue == null || queue.length == 0) {
                return 
            }
            queue.forEach(handle => handle(this[promiseValue]))
        }

        [settled](handle, status, queue) {
            if(typeof handle !== 'function') {
                return 
            }
            if(this[promiseStatus] === status){
                setTimeout(() => {
                    handle(this[promiseValue])
                }, 0)
            }else {
                queue.push(handle)
            }
        }

        static resolve(data){
            if(data instanceof MyPromise){
                return data;
            }
            return new MyPromise(resolve=>{
                resolve(data)
            })
        }

        static reject(data){
            return new MyPromise(reject=>{
                reject(data);
            })
        }
        
        static all(proms){
            return new MyPromise((resolve, reject) => {
                const results = proms.map(p => {
                    const resultSattus = {
                        result: undefined,
                        isFulfilled: false
                    }
                    p.then(data => {
                        resultSattus.result = data,
                        resultSattus.isFulfilled = true

                        //每个promsie执行时都要判断是否还有未完成的promsie
                        const unFulfilled = results.filter(r => !r.isFulfilled)
                        if(unFulfilled.length === 0){
                            resolve(results)
                        }
                    })
                    return resultSattus;
                }, err => {
                    reject(err)
                })
            })
        }

        static race(proms) {
            return new Promise((resolve, reject) => {
                proms.forEach(p => {
                    p.then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    })
                })
            })
        }
    }
})()

