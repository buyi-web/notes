
function deepClone(obj) {
    if(obj instanceof Array) {
        return cloneArray(obj)
    }else if(obj instanceof Object){
        return cloneObject(obj)
    }else{
        return obj
    }
}

function cloneArray(arr) {
    var result = new Array(arr.length);
    arr.forEach((item, i) => result[i] = deepClone(item))
    return result;
}

function cloneObject(obj) {
    var result = {};
    var props = Object.getOwnPropertyNames(obj)
    props.forEach(prop => result[prop] = deepClone(obj[prop]))
    return result
}