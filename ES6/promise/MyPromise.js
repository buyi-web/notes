
const MyPromiss = (() => {

    const PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
    promiseStatus = Symbol('promiseStatus'),
    promiseValue = Symbol('promiseValue');

    return class {
        constructor (executor) {
            this[promiseStatus] = PENDING;
            this[promiseValue] = undefined;

            const resolve = (data) => {
                this[promiseStatus] = RESOLVED;
                this[promiseValue] = data;

            }
            const reject = (err) => {
                this[promiseStatus] = REJECTED;
            }
            executor(resolve, reject)
        }

        then(thenHandle, catchHandle)  {
            return new MyPromise((resolve, reject)  => {
                const result = thenHandle(this[promiseValue]);
                resolve(result);
            })
        }

        catch() {

        }
    }
})