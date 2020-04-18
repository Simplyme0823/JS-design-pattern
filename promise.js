const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function myPromise(executor) {
    this.data
    this.status = PENDING
    this.cache = []

    const resolve = value => {
        if (this.status !== PENDING) return
        this.status = RESOLVED
        this.data = value
        setTimeout(() => {
            this.cache.forEach(item => {
                item.onFulfilled(value)
            })
        });
    }

    const reject = reason => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.data = reason
        setTimeout(() => {
            this.cache.forEach(item => {
                item.onRejected(reason)
            })
        });
    }

    try {
        executor(resolve, reject)
    } catch (err) {
        reject(err)
    }

}

myPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected == 'function' ? onRejected : reason => { throw reason }

    return new myPromise((resolve, reject) => {
        const handle = (callback) => {
            try {
                const result = callback(this.data)
                if (result instanceof myPromise) {
                    result.then(resolve, reject)
                } else {
                    resolve(result)
                }
            } catch (err) {
                reject(err)
            }
        }

        if (this.status == PENDING) {
            this.cache.push({
                onFulfilled() { handle(onFulfilled) },
                //onRejected: handle(onRejected) 这么写是错误的 应是传入函数而不是传入值
                onRejected() { handle(onRejected) }
            })
        } else if (this.status == RESOLVED) {
            setTimeout(() => {
                handle(onFulfilled)
            });
        } else if (this.status == REJECTED) {
            handle(onRejected)
        }
    })
}

myPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

myPromise.resolve = function (value) {
    return new myPromise((resolve, reject) => {
        if (value instanceof myPromise) {
            value.then(resolve, reject)
        } else {
            resolve(value)
        }
    })
}

myPromise.reject = function (reason) {
    return new myPromise((resolve, reject) => {
        reject(reason)
    })
}

myPromise.all = function (promiseArr) {
    let resolvedCount = 0
    const result = new Array(promiseArr.length)
    return new myPromise((resolve, reject) => {
        promiseArr.forEach((promise, index) => {
            myPromise.resolve(promise).then(
                value => {
                    resolvedCount++
                    result[index] = value
                    if (resolvedCount == promiseArr.length) {
                        resolve(result)
                    }
                },
                err => reject(err)
            )
        })
    })
}

myPromise.race = function (promiseArr) {
    return new myPromise((resolve, reject) => {
        promiseArr.forEach(promise => {
            myPromise.resolve(promise).then(resolve, reject)
        })
    })
}

myPromise.delayResolve = function (value, time) {
    return new myPromise((resolve, reject) => {
        setTimeout(() => {
            if(value instanceof myPromise){
                value.then(resolve)
            }else{
                resolve(value)
            }
        }, time);
    })
}

myPromise.delayReject = function(reason, time){
    return new myPromise((resolve, reject)=>{
        setTimeout(() => {
            reject(reason)
        }, time);
    })
}

const p = new myPromise(resolve => {
    resolve(5)
})
myPromise.all([1, p, 2, 3]).then(res => {
    console.log(res)
})
myPromise.race([1, p, 2, 3]).then(res => {
    console.log(res)
})


const p1 = new myPromise((resolve, reject) => {
    reject(2)
})
p1.then(res => {
    console.log(res)
}).catch(reason => {
    console.log(reason)
})

myPromise.delayResolve(100,5000).then(res=>{
    console.log(res)
})

myPromise.delayReject(101, 6000).catch(reason=>console.log(reason))