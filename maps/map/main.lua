
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        local value = nil
        if (select("#", ...) > 0) then value = module(...) else value = module(file) end
        ____moduleCache[file] = { value = value }
        return value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function(...) 
local function __TS__ArrayAt(self, relativeIndex)
    local absoluteIndex = relativeIndex < 0 and #self + relativeIndex or relativeIndex
    if absoluteIndex >= 0 and absoluteIndex < #self then
        return self[absoluteIndex + 1]
    end
    return nil
end

local function __TS__ArrayIsArray(value)
    return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end

local function __TS__ArrayConcat(self, ...)
    local items = {...}
    local result = {}
    local len = 0
    for i = 1, #self do
        len = len + 1
        result[len] = self[i]
    end
    for i = 1, #items do
        local item = items[i]
        if __TS__ArrayIsArray(item) then
            for j = 1, #item do
                len = len + 1
                result[len] = item[j]
            end
        else
            len = len + 1
            result[len] = item
        end
    end
    return result
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__ArrayEntries(array)
    local key = 0
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = array[key + 1] == nil, value = {key, array[key + 1]}}
            key = key + 1
            return result
        end
    }
end

local function __TS__ArrayEvery(self, callbackfn, thisArg)
    for i = 1, #self do
        if not callbackfn(thisArg, self[i], i - 1, self) then
            return false
        end
    end
    return true
end

local function __TS__ArrayFill(self, value, start, ____end)
    local relativeStart = start or 0
    local relativeEnd = ____end or #self
    if relativeStart < 0 then
        relativeStart = relativeStart + #self
    end
    if relativeEnd < 0 then
        relativeEnd = relativeEnd + #self
    end
    do
        local i = relativeStart
        while i < relativeEnd do
            self[i + 1] = value
            i = i + 1
        end
    end
    return self
end

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

local function __TS__ArrayFind(self, predicate, thisArg)
    for i = 1, #self do
        local elem = self[i]
        if predicate(thisArg, elem, i - 1, self) then
            return elem
        end
    end
    return nil
end

local function __TS__ArrayFindIndex(self, callbackFn, thisArg)
    for i = 1, #self do
        if callbackFn(thisArg, self[i], i - 1, self) then
            return i - 1
        end
    end
    return -1
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local __TS__ArrayFrom
do
    local function arrayLikeStep(self, index)
        index = index + 1
        if index > self.length then
            return
        end
        return index, self[index]
    end
    local function arrayLikeIterator(arr)
        if type(arr.length) == "number" then
            return arrayLikeStep, arr, 0
        end
        return __TS__Iterator(arr)
    end
    function __TS__ArrayFrom(arrayLike, mapFn, thisArg)
        local result = {}
        if mapFn == nil then
            for ____, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = v
            end
        else
            local i = 0
            for ____, v in arrayLikeIterator(arrayLike) do
                local ____mapFn_3 = mapFn
                local ____thisArg_1 = thisArg
                local ____v_2 = v
                local ____i_0 = i
                i = ____i_0 + 1
                result[#result + 1] = ____mapFn_3(____thisArg_1, ____v_2, ____i_0)
            end
        end
        return result
    end
end

local function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k + 1, len do
        if self[i] == searchElement then
            return true
        end
    end
    return false
end

local function __TS__ArrayIndexOf(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    if len == 0 then
        return -1
    end
    if fromIndex >= len then
        return -1
    end
    if fromIndex < 0 then
        fromIndex = len + fromIndex
        if fromIndex < 0 then
            fromIndex = 0
        end
    end
    for i = fromIndex + 1, len do
        if self[i] == searchElement then
            return i - 1
        end
    end
    return -1
end

local function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local parts = {}
    for i = 1, #self do
        parts[i] = tostring(self[i])
    end
    return table.concat(parts, separator)
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayPush(self, ...)
    local items = {...}
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__ArrayReduce(self, callbackFn, ...)
    local len = #self
    local k = 0
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, len do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReduceRight(self, callbackFn, ...)
    local len = #self
    local k = len - 1
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, 1, -1 do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReverse(self)
    local i = 1
    local j = #self
    while i < j do
        local temp = self[j]
        self[j] = self[i]
        self[i] = temp
        i = i + 1
        j = j - 1
    end
    return self
end

local function __TS__ArrayUnshift(self, ...)
    local items = {...}
    local numItemsToInsert = #items
    if numItemsToInsert == 0 then
        return #self
    end
    for i = #self, 1, -1 do
        self[i + numItemsToInsert] = self[i]
    end
    for i = 1, numItemsToInsert do
        self[i] = items[i]
    end
    return #self
end

local function __TS__ArraySort(self, compareFn)
    if compareFn ~= nil then
        table.sort(
            self,
            function(a, b) return compareFn(nil, a, b) < 0 end
        )
    else
        table.sort(self)
    end
    return self
end

local function __TS__ArraySlice(self, first, last)
    local len = #self
    first = first or 0
    if first < 0 then
        first = len + first
        if first < 0 then
            first = 0
        end
    else
        if first > len then
            first = len
        end
    end
    last = last or len
    if last < 0 then
        last = len + last
        if last < 0 then
            last = 0
        end
    else
        if last > len then
            last = len
        end
    end
    local out = {}
    first = first + 1
    last = last + 1
    local n = 1
    while first < last do
        out[n] = self[first]
        first = first + 1
        n = n + 1
    end
    return out
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
end

local function __TS__ArraySplice(self, ...)
    local args = {...}
    local len = #self
    local actualArgumentCount = __TS__CountVarargs(...)
    local start = args[1]
    local deleteCount = args[2]
    if start < 0 then
        start = len + start
        if start < 0 then
            start = 0
        end
    elseif start > len then
        start = len
    end
    local itemCount = actualArgumentCount - 2
    if itemCount < 0 then
        itemCount = 0
    end
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - start
    else
        actualDeleteCount = deleteCount or 0
        if actualDeleteCount < 0 then
            actualDeleteCount = 0
        end
        if actualDeleteCount > len - start then
            actualDeleteCount = len - start
        end
    end
    local out = {}
    for k = 1, actualDeleteCount do
        local from = start + k
        if self[from] ~= nil then
            out[k] = self[from]
        end
    end
    if itemCount < actualDeleteCount then
        for k = start + 1, len - actualDeleteCount do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
        for k = len - actualDeleteCount + itemCount + 1, len do
            self[k] = nil
        end
    elseif itemCount > actualDeleteCount then
        for k = len - actualDeleteCount, start + 1, -1 do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
    end
    local j = start + 1
    for i = 3, actualArgumentCount do
        self[j] = args[i]
        j = j + 1
    end
    for k = #self, len - actualDeleteCount + itemCount + 1, -1 do
        self[k] = nil
    end
    return out
end

local function __TS__ArrayToObject(self)
    local object = {}
    for i = 1, #self do
        object[i - 1] = self[i]
    end
    return object
end

local function __TS__ArrayFlat(self, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = self[i]
        if depth > 0 and __TS__ArrayIsArray(value) then
            local toAdd
            if depth == 1 then
                toAdd = value
            else
                toAdd = __TS__ArrayFlat(value, depth - 1)
            end
            for j = 1, #toAdd do
                local val = toAdd[j]
                len = len + 1
                result[len] = val
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArrayFlatMap(self, callback, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = callback(thisArg, self[i], i - 1, self)
        if __TS__ArrayIsArray(value) then
            for j = 1, #value do
                len = len + 1
                result[len] = value[j]
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArraySetLength(self, length)
    if length < 0 or length ~= length or length == math.huge or math.floor(length) ~= length then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    for i = length + 1, #self do
        self[i] = nil
    end
    return length
end

local __TS__Unpack = table.unpack or unpack

local function __TS__ArrayToReversed(self)
    local copy = {__TS__Unpack(self)}
    __TS__ArrayReverse(copy)
    return copy
end

local function __TS__ArrayToSorted(self, compareFn)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySort(copy, compareFn)
    return copy
end

local function __TS__ArrayToSpliced(self, start, deleteCount, ...)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySplice(copy, start, deleteCount, ...)
    return copy
end

local function __TS__ArrayWith(self, index, value)
    local copy = {__TS__Unpack(self)}
    copy[index + 1] = value
    return copy
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Promise
do
    local function makeDeferredPromiseFactory()
        local resolve
        local reject
        local function executor(____, res, rej)
            resolve = res
            reject = rej
        end
        return function()
            local promise = __TS__New(__TS__Promise, executor)
            return promise, resolve, reject
        end
    end
    local makeDeferredPromise = makeDeferredPromiseFactory()
    local function isPromiseLike(value)
        return __TS__InstanceOf(value, __TS__Promise)
    end
    local function doNothing(self)
    end
    local ____pcall = _G.pcall
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        self.finallyCallbacks = {}
        local success, ____error = ____pcall(
            executor,
            nil,
            function(____, v) return self:resolve(v) end,
            function(____, err) return self:reject(err) end
        )
        if not success then
            self:reject(____error)
        end
    end
    function __TS__Promise.resolve(value)
        if __TS__InstanceOf(value, __TS__Promise) then
            return value
        end
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 1
        promise.value = value
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local promise, resolve, reject = makeDeferredPromise()
        self:addCallbacks(
            onFulfilled and self:createPromiseResolvingCallback(onFulfilled, resolve, reject) or resolve,
            onRejected and self:createPromiseResolvingCallback(onRejected, resolve, reject) or reject
        )
        return promise
    end
    function __TS__Promise.prototype.addCallbacks(self, fulfilledCallback, rejectedCallback)
        if self.state == 1 then
            return fulfilledCallback(nil, self.value)
        end
        if self.state == 2 then
            return rejectedCallback(nil, self.rejectionReason)
        end
        local ____self_fulfilledCallbacks_0 = self.fulfilledCallbacks
        ____self_fulfilledCallbacks_0[#____self_fulfilledCallbacks_0 + 1] = fulfilledCallback
        local ____self_rejectedCallbacks_1 = self.rejectedCallbacks
        ____self_rejectedCallbacks_1[#____self_rejectedCallbacks_1 + 1] = rejectedCallback
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if onFinally then
            local ____self_finallyCallbacks_2 = self.finallyCallbacks
            ____self_finallyCallbacks_2[#____self_finallyCallbacks_2 + 1] = onFinally
            if self.state ~= 0 then
                onFinally(nil)
            end
        end
        return self
    end
    function __TS__Promise.prototype.resolve(self, value)
        if isPromiseLike(value) then
            return value:addCallbacks(
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
        end
        if self.state == 0 then
            self.state = 1
            self.value = value
            return self:invokeCallbacks(self.fulfilledCallbacks, value)
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            return self:invokeCallbacks(self.rejectedCallbacks, reason)
        end
    end
    function __TS__Promise.prototype.invokeCallbacks(self, callbacks, value)
        local callbacksLength = #callbacks
        local finallyCallbacks = self.finallyCallbacks
        local finallyCallbacksLength = #finallyCallbacks
        if callbacksLength ~= 0 then
            for i = 1, callbacksLength - 1 do
                callbacks[i](callbacks, value)
            end
            if finallyCallbacksLength == 0 then
                return callbacks[callbacksLength](callbacks, value)
            end
            callbacks[callbacksLength](callbacks, value)
        end
        if finallyCallbacksLength ~= 0 then
            for i = 1, finallyCallbacksLength - 1 do
                finallyCallbacks[i](finallyCallbacks)
            end
            return finallyCallbacks[finallyCallbacksLength](finallyCallbacks)
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            local success, resultOrError = ____pcall(f, nil, value)
            if not success then
                return reject(nil, resultOrError)
            end
            return self:handleCallbackValue(resultOrError, resolve, reject)
        end
    end
    function __TS__Promise.prototype.handleCallbackValue(self, value, resolve, reject)
        if isPromiseLike(value) then
            local nextpromise = value
            if nextpromise.state == 1 then
                return resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                return reject(nil, nextpromise.rejectionReason)
            else
                return nextpromise:addCallbacks(resolve, reject)
            end
        else
            return resolve(nil, value)
        end
    end
end

local __TS__AsyncAwaiter, __TS__Await
do
    local ____coroutine = _G.coroutine or ({})
    local cocreate = ____coroutine.create
    local coresume = ____coroutine.resume
    local costatus = ____coroutine.status
    local coyield = ____coroutine.yield
    function __TS__AsyncAwaiter(generator)
        return __TS__New(
            __TS__Promise,
            function(____, resolve, reject)
                local fulfilled, step, resolved, asyncCoroutine
                function fulfilled(self, value)
                    local success, resultOrError = coresume(asyncCoroutine, value)
                    if success then
                        return step(resultOrError)
                    end
                    return reject(nil, resultOrError)
                end
                function step(result)
                    if resolved then
                        return
                    end
                    if costatus(asyncCoroutine) == "dead" then
                        return resolve(nil, result)
                    end
                    return __TS__Promise.resolve(result):addCallbacks(fulfilled, reject)
                end
                resolved = false
                asyncCoroutine = cocreate(generator)
                local success, resultOrError = coresume(
                    asyncCoroutine,
                    function(____, v)
                        resolved = true
                        return __TS__Promise.resolve(v):addCallbacks(resolve, reject)
                    end
                )
                if success then
                    return step(resultOrError)
                else
                    return reject(nil, resultOrError)
                end
            end
        )
    end
    function __TS__Await(thing)
        return coyield(thing)
    end
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local function __TS__Decorate(self, originalValue, decorators, context)
    local result = originalValue
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local ____decorator_result_0 = decorator(self, result, context)
                if ____decorator_result_0 == nil then
                    ____decorator_result_0 = result
                end
                result = ____decorator_result_0
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__DecorateLegacy(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local oldResult = result
                if key == nil then
                    result = decorator(nil, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(nil, target, key, descriptor) or descriptor
                    local isSimpleValue = desc.configurable == true and desc.writable == true and not desc.get and not desc.set
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(nil, target, key, desc)
                else
                    result = decorator(nil, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(nil, target, key, paramIndex) end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(__TS__StringAccess(iterable, index))
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

local function __TS__FunctionBind(fn, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        __TS__ArrayUnshift(
            args,
            __TS__Unpack(boundArgs)
        )
        return fn(__TS__Unpack(args))
    end
end

local __TS__Generator
do
    local function generatorIterator(self)
        return self
    end
    local function generatorNext(self, ...)
        local co = self.____coroutine
        if coroutine.status(co) == "dead" then
            return {done = true}
        end
        local status, value = coroutine.resume(co, ...)
        if not status then
            error(value, 0)
        end
        return {
            value = value,
            done = coroutine.status(co) == "dead"
        }
    end
    function __TS__Generator(fn)
        return function(...)
            local args = {...}
            local argsLength = __TS__CountVarargs(...)
            return {
                ____coroutine = coroutine.create(function() return fn(__TS__Unpack(args, 1, argsLength)) end),
                [Symbol.iterator] = generatorIterator,
                next = generatorNext
            }
        end
    end
end

local function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return valueType == "table" or valueType == "function"
end

local function __TS__LuaIteratorSpread(self, state, firstKey)
    local results = {}
    local key, value = self(state, firstKey)
    while key do
        results[#results + 1] = {key, value}
        key, value = self(state, key)
    end
    return __TS__Unpack(results)
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end

local function __TS__MapGroupBy(items, keySelector)
    local result = __TS__New(Map)
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result:has(key) then
            local ____temp_0 = result:get(key)
            ____temp_0[#____temp_0 + 1] = item
        else
            result:set(key, {item})
        end
        i = i + 1
    end
    return result
end

local __TS__Match = string.match

local __TS__MathAtan2 = math.atan2 or math.atan

local __TS__MathModf = math.modf

local function __TS__NumberIsNaN(value)
    return value ~= value
end

local function __TS__MathSign(val)
    if __TS__NumberIsNaN(val) or val == 0 then
        return val
    end
    if val < 0 then
        return -1
    end
    return 1
end

local function __TS__NumberIsFinite(value)
    return type(value) == "number" and value == value and value ~= math.huge and value ~= -math.huge
end

local function __TS__MathTrunc(val)
    if not __TS__NumberIsFinite(val) or val == 0 then
        return val
    end
    return val > 0 and math.floor(val) or math.ceil(val)
end

local function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return value and 1 or 0
    else
        return 0 / 0
    end
end

local function __TS__NumberIsInteger(value)
    return __TS__NumberIsFinite(value) and math.floor(value) == value
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch ~= nil then
                base = 16
                numberString = (__TS__Match(hexMatch, "-")) and "-" .. __TS__StringSubstring(numberString, #hexMatch) or __TS__StringSubstring(numberString, #hexMatch)
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local allowedDigits = base <= 10 and __TS__StringSubstring(parseIntBasePattern, 0, base) or __TS__StringSubstring(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber((__TS__Match(numberString, pattern)), base)
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end

local function __TS__ParseFloat(numberString)
    local infinityMatch = __TS__Match(numberString, "^%s*(-?Infinity)")
    if infinityMatch ~= nil then
        return __TS__StringAccess(infinityMatch, 0) == "-" and -math.huge or math.huge
    end
    local number = tonumber((__TS__Match(numberString, "^%s*(-?%d+%.?%d*)")))
    return number or 0 / 0
end

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end

local function __TS__NumberToFixed(self, fractionDigits)
    if math.abs(self) >= 1e+21 or self ~= self then
        return tostring(self)
    end
    local f = math.floor(fractionDigits or 0)
    if f < 0 or f > 99 then
        error("toFixed() digits argument must be between 0 and 99", 0)
    end
    return string.format(
        ("%." .. tostring(f)) .. "f",
        self
    )
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = type(key) == "number" and key + 1 or key
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_4 = desc.set
        local ____desc_get_5 = desc.get
        local ____desc_configurable_0 = desc.configurable
        if ____desc_configurable_0 == nil then
            ____desc_configurable_0 = valueExists
        end
        local ____desc_enumerable_1 = desc.enumerable
        if ____desc_enumerable_1 == nil then
            ____desc_enumerable_1 = valueExists
        end
        local ____desc_writable_2 = desc.writable
        if ____desc_writable_2 == nil then
            ____desc_writable_2 = valueExists
        end
        local ____temp_3
        if desc.value ~= nil then
            ____temp_3 = desc.value
        else
            ____temp_3 = value
        end
        descriptor = {
            set = ____desc_set_4,
            get = ____desc_get_5,
            configurable = ____desc_configurable_0,
            enumerable = ____desc_enumerable_1,
            writable = ____desc_writable_2,
            value = ____temp_3
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

local function __TS__ObjectEntries(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = {key, obj[key]}
    end
    return result
end

local function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

local function __TS__ObjectGroupBy(items, keySelector)
    local result = {}
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result[key] ~= nil then
            local ____result_key_0 = result[key]
            ____result_key_0[#____result_key_0 + 1] = item
        else
            result[key] = {item}
        end
        i = i + 1
    end
    return result
end

local function __TS__ObjectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

local function __TS__ObjectValues(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = obj[key]
    end
    return result
end

local function __TS__PromiseAll(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = item.value
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = item
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = data
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        reject(nil, reason)
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAllSettled(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = {status = "fulfilled", value = item.value}
            elseif item.state == 2 then
                results[i + 1] = {status = "rejected", reason = item.rejectionReason}
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = {status = "fulfilled", value = item}
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = {status = "fulfilled", value = data}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        results[index + 1] = {status = "rejected", reason = reason}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAny(iterable)
    local rejections = {}
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                rejections[#rejections + 1] = item.rejectionReason
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    if #pending == 0 then
        return __TS__Promise.reject("No promises to resolve with .any()")
    end
    local numResolved = 0
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, data)
                        resolve(nil, data)
                    end,
                    function(____, reason)
                        rejections[#rejections + 1] = reason
                        numResolved = numResolved + 1
                        if numResolved == #pending then
                            reject(nil, {name = "AggregateError", message = "All Promises rejected", errors = rejections})
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseRace(iterable)
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, value) return resolve(nil, value) end,
                    function(____, reason) return reject(nil, reason) end
                )
            end
        end
    )
end

local Set
do
    Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.union(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:add(item)
        end
        return result
    end
    function Set.prototype.intersection(self, other)
        local result = __TS__New(Set)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.difference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:delete(item)
        end
        return result
    end
    function Set.prototype.symmetricDifference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            if self:has(item) then
                result:delete(item)
            else
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.isSubsetOf(self, other)
        for ____, item in __TS__Iterator(self) do
            if not other:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isSupersetOf(self, other)
        for ____, item in __TS__Iterator(other) do
            if not self:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isDisjointFrom(self, other)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                return false
            end
        end
        return true
    end
    Set[Symbol.species] = Set
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local _unpack = unpack or table.unpack
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
end

local WeakMap
do
    WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
end

local WeakSet
do
    WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
end

local function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        local originalTraceback = debug.traceback
        _G.__TS__originalTraceback = originalTraceback
        debug.traceback = function(thread, message, level)
            local trace
            if thread == nil and message == nil and level == nil then
                trace = originalTraceback()
            elseif __TS__StringIncludes(_VERSION, "Lua 5.0") then
                trace = originalTraceback((("[Level " .. tostring(level)) .. "] ") .. tostring(message))
            else
                trace = originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local function replacer(____, file, srcFile, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (srcFile .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            local result = string.gsub(
                trace,
                "(%S+)%.lua:(%d+)",
                function(file, line) return replacer(nil, file .. ".lua", file .. ".ts", line) end
            )
            local function stringReplacer(____, file, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local chunkName = (__TS__Match(file, "%[string \"([^\"]+)\"%]"))
                    local sourceName = string.gsub(chunkName, ".lua$", ".ts")
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (sourceName .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            result = string.gsub(
                result,
                "(%[string \"[^\"]+\"%]):(%d+)",
                function(file, line) return stringReplacer(nil, file, line) end
            )
            return result
        end
    end
end

local function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        for i = 0, #iterable - 1 do
            arr[i + 1] = __TS__StringAccess(iterable, i)
        end
    else
        local len = 0
        for ____, item in __TS__Iterator(iterable) do
            len = len + 1
            arr[len] = item
        end
    end
    return __TS__Unpack(arr)
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end

local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return self .. string.sub(
        fillString,
        1,
        math.floor(maxLength)
    )
end

local function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return string.sub(
        fillString,
        1,
        math.floor(maxLength)
    ) .. self
end

local __TS__StringReplace
do
    local sub = string.sub
    function __TS__StringReplace(source, searchValue, replaceValue)
        local startPos, endPos = string.find(source, searchValue, nil, true)
        if not startPos then
            return source
        end
        local before = sub(source, 1, startPos - 1)
        local replacement = type(replaceValue) == "string" and replaceValue or replaceValue(nil, searchValue, startPos - 1, source)
        local after = sub(source, endPos + 1)
        return (before .. replacement) .. after
    end
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local __TS__StringReplaceAll
do
    local sub = string.sub
    local find = string.find
    function __TS__StringReplaceAll(source, searchValue, replaceValue)
        if type(replaceValue) == "string" then
            local concat = table.concat(
                __TS__StringSplit(source, searchValue),
                replaceValue
            )
            if #searchValue == 0 then
                return (replaceValue .. concat) .. replaceValue
            end
            return concat
        end
        local parts = {}
        local partsIndex = 1
        if #searchValue == 0 then
            parts[1] = replaceValue(nil, "", 0, source)
            partsIndex = 2
            for i = 1, #source do
                parts[partsIndex] = sub(source, i, i)
                parts[partsIndex + 1] = replaceValue(nil, "", i, source)
                partsIndex = partsIndex + 2
            end
        else
            local currentPos = 1
            while true do
                local startPos, endPos = find(source, searchValue, currentPos, true)
                if not startPos then
                    break
                end
                parts[partsIndex] = sub(source, currentPos, startPos - 1)
                parts[partsIndex + 1] = replaceValue(nil, searchValue, startPos - 1, source)
                partsIndex = partsIndex + 2
                currentPos = endPos + 1
            end
            parts[partsIndex] = sub(source, currentPos)
        end
        return table.concat(parts)
    end
end

local function __TS__StringSlice(self, start, ____end)
    if start == nil or start ~= start then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

local function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

local __TS__SymbolRegistryFor, __TS__SymbolRegistryKeyFor
do
    local symbolRegistry = {}
    function __TS__SymbolRegistryFor(key)
        if not symbolRegistry[key] then
            symbolRegistry[key] = __TS__Symbol(key)
        end
        return symbolRegistry[key]
    end
    function __TS__SymbolRegistryKeyFor(sym)
        for key in pairs(symbolRegistry) do
            if symbolRegistry[key] == sym then
                return key
            end
        end
        return nil
    end
end

local function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

local function __TS__Using(self, cb, ...)
    local args = {...}
    local thrownError
    local ok, result = xpcall(
        function() return cb(__TS__Unpack(args)) end,
        function(err)
            thrownError = err
            return thrownError
        end
    )
    local argArray = {__TS__Unpack(args)}
    do
        local i = #argArray - 1
        while i >= 0 do
            local ____self_0 = argArray[i + 1]
            ____self_0[Symbol.dispose](____self_0)
            i = i - 1
        end
    end
    if not ok then
        error(thrownError, 0)
    end
    return result
end

local function __TS__UsingAsync(self, cb, ...)
    local args = {...}
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local thrownError
        local ok, result = xpcall(
            function() return cb(
                nil,
                __TS__Unpack(args)
            ) end,
            function(err)
                thrownError = err
                return thrownError
            end
        )
        local argArray = {__TS__Unpack(args)}
        do
            local i = #argArray - 1
            while i >= 0 do
                if argArray[i + 1][Symbol.dispose] ~= nil then
                    local ____self_0 = argArray[i + 1]
                    ____self_0[Symbol.dispose](____self_0)
                end
                if argArray[i + 1][Symbol.asyncDispose] ~= nil then
                    local ____self_1 = argArray[i + 1]
                    __TS__Await(____self_1[Symbol.asyncDispose](____self_1))
                end
                i = i - 1
            end
        end
        if not ok then
            error(thrownError, 0)
        end
        return ____awaiter_resolve(nil, result)
    end)
end

return {
  __TS__ArrayAt = __TS__ArrayAt,
  __TS__ArrayConcat = __TS__ArrayConcat,
  __TS__ArrayEntries = __TS__ArrayEntries,
  __TS__ArrayEvery = __TS__ArrayEvery,
  __TS__ArrayFill = __TS__ArrayFill,
  __TS__ArrayFilter = __TS__ArrayFilter,
  __TS__ArrayForEach = __TS__ArrayForEach,
  __TS__ArrayFind = __TS__ArrayFind,
  __TS__ArrayFindIndex = __TS__ArrayFindIndex,
  __TS__ArrayFrom = __TS__ArrayFrom,
  __TS__ArrayIncludes = __TS__ArrayIncludes,
  __TS__ArrayIndexOf = __TS__ArrayIndexOf,
  __TS__ArrayIsArray = __TS__ArrayIsArray,
  __TS__ArrayJoin = __TS__ArrayJoin,
  __TS__ArrayMap = __TS__ArrayMap,
  __TS__ArrayPush = __TS__ArrayPush,
  __TS__ArrayPushArray = __TS__ArrayPushArray,
  __TS__ArrayReduce = __TS__ArrayReduce,
  __TS__ArrayReduceRight = __TS__ArrayReduceRight,
  __TS__ArrayReverse = __TS__ArrayReverse,
  __TS__ArrayUnshift = __TS__ArrayUnshift,
  __TS__ArraySort = __TS__ArraySort,
  __TS__ArraySlice = __TS__ArraySlice,
  __TS__ArraySome = __TS__ArraySome,
  __TS__ArraySplice = __TS__ArraySplice,
  __TS__ArrayToObject = __TS__ArrayToObject,
  __TS__ArrayFlat = __TS__ArrayFlat,
  __TS__ArrayFlatMap = __TS__ArrayFlatMap,
  __TS__ArraySetLength = __TS__ArraySetLength,
  __TS__ArrayToReversed = __TS__ArrayToReversed,
  __TS__ArrayToSorted = __TS__ArrayToSorted,
  __TS__ArrayToSpliced = __TS__ArrayToSpliced,
  __TS__ArrayWith = __TS__ArrayWith,
  __TS__AsyncAwaiter = __TS__AsyncAwaiter,
  __TS__Await = __TS__Await,
  __TS__Class = __TS__Class,
  __TS__ClassExtends = __TS__ClassExtends,
  __TS__CloneDescriptor = __TS__CloneDescriptor,
  __TS__CountVarargs = __TS__CountVarargs,
  __TS__Decorate = __TS__Decorate,
  __TS__DecorateLegacy = __TS__DecorateLegacy,
  __TS__DecorateParam = __TS__DecorateParam,
  __TS__Delete = __TS__Delete,
  __TS__DelegatedYield = __TS__DelegatedYield,
  __TS__DescriptorGet = __TS__DescriptorGet,
  __TS__DescriptorSet = __TS__DescriptorSet,
  Error = Error,
  RangeError = RangeError,
  ReferenceError = ReferenceError,
  SyntaxError = SyntaxError,
  TypeError = TypeError,
  URIError = URIError,
  __TS__FunctionBind = __TS__FunctionBind,
  __TS__Generator = __TS__Generator,
  __TS__InstanceOf = __TS__InstanceOf,
  __TS__InstanceOfObject = __TS__InstanceOfObject,
  __TS__Iterator = __TS__Iterator,
  __TS__LuaIteratorSpread = __TS__LuaIteratorSpread,
  Map = Map,
  __TS__MapGroupBy = __TS__MapGroupBy,
  __TS__Match = __TS__Match,
  __TS__MathAtan2 = __TS__MathAtan2,
  __TS__MathModf = __TS__MathModf,
  __TS__MathSign = __TS__MathSign,
  __TS__MathTrunc = __TS__MathTrunc,
  __TS__New = __TS__New,
  __TS__Number = __TS__Number,
  __TS__NumberIsFinite = __TS__NumberIsFinite,
  __TS__NumberIsInteger = __TS__NumberIsInteger,
  __TS__NumberIsNaN = __TS__NumberIsNaN,
  __TS__ParseInt = __TS__ParseInt,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__NumberToString = __TS__NumberToString,
  __TS__NumberToFixed = __TS__NumberToFixed,
  __TS__ObjectAssign = __TS__ObjectAssign,
  __TS__ObjectDefineProperty = __TS__ObjectDefineProperty,
  __TS__ObjectEntries = __TS__ObjectEntries,
  __TS__ObjectFromEntries = __TS__ObjectFromEntries,
  __TS__ObjectGetOwnPropertyDescriptor = __TS__ObjectGetOwnPropertyDescriptor,
  __TS__ObjectGetOwnPropertyDescriptors = __TS__ObjectGetOwnPropertyDescriptors,
  __TS__ObjectGroupBy = __TS__ObjectGroupBy,
  __TS__ObjectKeys = __TS__ObjectKeys,
  __TS__ObjectRest = __TS__ObjectRest,
  __TS__ObjectValues = __TS__ObjectValues,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__ParseInt = __TS__ParseInt,
  __TS__Promise = __TS__Promise,
  __TS__PromiseAll = __TS__PromiseAll,
  __TS__PromiseAllSettled = __TS__PromiseAllSettled,
  __TS__PromiseAny = __TS__PromiseAny,
  __TS__PromiseRace = __TS__PromiseRace,
  Set = Set,
  __TS__SetDescriptor = __TS__SetDescriptor,
  __TS__SparseArrayNew = __TS__SparseArrayNew,
  __TS__SparseArrayPush = __TS__SparseArrayPush,
  __TS__SparseArraySpread = __TS__SparseArraySpread,
  WeakMap = WeakMap,
  WeakSet = WeakSet,
  __TS__SourceMapTraceBack = __TS__SourceMapTraceBack,
  __TS__Spread = __TS__Spread,
  __TS__StringAccess = __TS__StringAccess,
  __TS__StringCharAt = __TS__StringCharAt,
  __TS__StringCharCodeAt = __TS__StringCharCodeAt,
  __TS__StringEndsWith = __TS__StringEndsWith,
  __TS__StringIncludes = __TS__StringIncludes,
  __TS__StringPadEnd = __TS__StringPadEnd,
  __TS__StringPadStart = __TS__StringPadStart,
  __TS__StringReplace = __TS__StringReplace,
  __TS__StringReplaceAll = __TS__StringReplaceAll,
  __TS__StringSlice = __TS__StringSlice,
  __TS__StringSplit = __TS__StringSplit,
  __TS__StringStartsWith = __TS__StringStartsWith,
  __TS__StringSubstr = __TS__StringSubstr,
  __TS__StringSubstring = __TS__StringSubstring,
  __TS__StringTrim = __TS__StringTrim,
  __TS__StringTrimEnd = __TS__StringTrimEnd,
  __TS__StringTrimStart = __TS__StringTrimStart,
  __TS__Symbol = __TS__Symbol,
  Symbol = Symbol,
  __TS__SymbolRegistryFor = __TS__SymbolRegistryFor,
  __TS__SymbolRegistryKeyFor = __TS__SymbolRegistryKeyFor,
  __TS__TypeOf = __TS__TypeOf,
  __TS__Unpack = __TS__Unpack,
  __TS__Using = __TS__Using,
  __TS__UsingAsync = __TS__UsingAsync
}
 end,
["lua_modules.wc3ts-1.27a.handles.handle"] = function(...) 
local ____lualib = require("lualib_bundle")
local WeakMap = ____lualib.WeakMap
local __TS__New = ____lualib.__TS__New
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
---
-- @noSelfInFile
local map = __TS__New(WeakMap)
____exports.Handle = __TS__Class()
local Handle = ____exports.Handle
Handle.name = "Handle"
function Handle.prototype.____constructor(self, handle)
    self.handle = handle == nil and ____exports.Handle.initHandle or handle
    map:set(self.handle, self)
end
function Handle.initFromHandle(self)
    return ____exports.Handle.initHandle ~= nil
end
function Handle.getObject(self, handle)
    local obj = map:get(handle)
    if obj ~= nil then
        return obj
    end
    ____exports.Handle.initHandle = handle
    local newObj = __TS__New(self)
    ____exports.Handle.initHandle = nil
    return newObj
end
__TS__SetDescriptor(
    Handle.prototype,
    "id",
    {get = function(self)
        return GetHandleId(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.force"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____player = require("lua_modules.wc3ts-1.27a.handles.player")
local MapPlayer = ____player.MapPlayer
____exports.Force = __TS__Class()
local Force = ____exports.Force
Force.name = "Force"
__TS__ClassExtends(Force, Handle)
function Force.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateForce()
    if handle == nil then
        Error(nil, "w3ts failed to create force handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Force.create(self)
    local handle = CreateForce()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Force.prototype.addPlayer(self, whichPlayer)
    ForceAddPlayer(self.handle, whichPlayer.handle)
end
function Force.prototype.clear(self)
    ForceClear(self.handle)
end
function Force.prototype.destroy(self)
    DestroyForce(self.handle)
end
function Force.prototype.enumAllies(self, whichPlayer, filter)
    ForceEnumAllies(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumEnemies(self, whichPlayer, filter)
    ForceEnumEnemies(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumPlayers(self, filter)
    ForceEnumPlayers(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumPlayersCounted(self, filter, countLimit)
    ForceEnumPlayersCounted(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
Force.prototype["for"] = function(self, callback)
    ForForce(self.handle, callback)
end
function Force.prototype.getPlayers(self)
    local players = {}
    ForForce(
        self.handle,
        function()
            local pl = MapPlayer:fromEnum()
            if pl then
                players[#players + 1] = pl
            end
        end
    )
    return players
end
function Force.prototype.hasPlayer(self, whichPlayer)
    return IsPlayerInForce(whichPlayer.handle, self.handle)
end
function Force.prototype.removePlayer(self, whichPlayer)
    ForceRemovePlayer(self.handle, whichPlayer.handle)
end
function Force.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.point"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Point = __TS__Class()
local Point = ____exports.Point
Point.name = "Point"
__TS__ClassExtends(Point, Handle)
function Point.prototype.____constructor(self, x, y)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Location(x, y)
    if handle == nil then
        Error(nil, "w3ts failed to create player handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Point.create(self, x, y)
    local handle = Location(x, y)
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Point.prototype.destroy(self)
    RemoveLocation(self.handle)
end
function Point.prototype.setPosition(self, x, y)
    MoveLocation(self.handle, x, y)
end
function Point.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Point.prototype,
    "x",
    {
        get = function(self)
            return GetLocationX(self.handle)
        end,
        set = function(self, value)
            MoveLocation(self.handle, value, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Point.prototype,
    "y",
    {
        get = function(self)
            return GetLocationY(self.handle)
        end,
        set = function(self, value)
            MoveLocation(self.handle, self.x, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Point.prototype,
    "z",
    {get = function(self)
        return GetLocationZ(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.player"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.MapPlayer = __TS__Class()
local MapPlayer = ____exports.MapPlayer
MapPlayer.name = "MapPlayer"
__TS__ClassExtends(MapPlayer, Handle)
function MapPlayer.prototype.____constructor(self, index)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Player(index)
    if handle == nil then
        Error(nil, "w3ts failed to create player handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function MapPlayer.create(self, index)
    local handle = Player(index)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function MapPlayer.prototype.addTechResearched(self, techId, levels)
    AddPlayerTechResearched(self.handle, techId, levels)
end
function MapPlayer.prototype.cacheHeroData(self)
    CachePlayerHeroData(self.handle)
end
function MapPlayer.prototype.compareAlliance(self, otherPlayer, whichAllianceSetting)
    return GetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting)
end
function MapPlayer.prototype.coordsFogged(self, x, y)
    return IsFoggedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsMasked(self, x, y)
    return IsMaskedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsVisible(self, x, y)
    return IsVisibleToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.cripple(self, toWhichPlayers, flag)
    CripplePlayer(self.handle, toWhichPlayers.handle, flag)
end
function MapPlayer.prototype.getScore(self, whichPlayerScore)
    return GetPlayerScore(self.handle, whichPlayerScore)
end
function MapPlayer.prototype.getState(self, whichPlayerState)
    return GetPlayerState(self.handle, whichPlayerState)
end
function MapPlayer.prototype.getStructureCount(self, includeIncomplete)
    return GetPlayerStructureCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getTaxRate(self, otherPlayer, whichResource)
    return GetPlayerTaxRate(self.handle, otherPlayer, whichResource)
end
function MapPlayer.prototype.getTechCount(self, techId, specificonly)
    return GetPlayerTechCount(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getTechMaxAllowed(self, techId)
    return GetPlayerTechMaxAllowed(self.handle, techId)
end
function MapPlayer.prototype.getTechResearched(self, techId, specificonly)
    return GetPlayerTechResearched(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getUnitCount(self, includeIncomplete)
    return GetPlayerUnitCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getUnitCountByType(self, unitName, includeIncomplete, includeUpgrades)
    return GetPlayerTypedUnitCount(self.handle, unitName, includeIncomplete, includeUpgrades)
end
function MapPlayer.prototype.inForce(self, whichForce)
    return IsPlayerInForce(self.handle, whichForce.handle)
end
function MapPlayer.prototype.isLocal(self)
    return GetLocalPlayer() == self.handle
end
function MapPlayer.prototype.isObserver(self)
    return IsPlayerObserver(self.handle)
end
function MapPlayer.prototype.isPlayerAlly(self, otherPlayer)
    return IsPlayerAlly(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isPlayerEnemy(self, otherPlayer)
    return IsPlayerEnemy(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isRacePrefSet(self, pref)
    return IsPlayerRacePrefSet(self.handle, pref)
end
function MapPlayer.prototype.isSelectable(self)
    return GetPlayerSelectable(self.handle)
end
function MapPlayer.prototype.pointFogged(self, whichPoint)
    return IsLocationFoggedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointMasked(self, whichPoint)
    return IsLocationMaskedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointVisible(self, whichPoint)
    return IsLocationVisibleToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.remove(self, gameResult)
    RemovePlayer(self.handle, gameResult)
end
function MapPlayer.prototype.removeAllGuardPositions(self)
    RemoveAllGuardPositions(self.handle)
end
function MapPlayer.prototype.setAbilityAvailable(self, abilId, avail)
    SetPlayerAbilityAvailable(self.handle, abilId, avail)
end
function MapPlayer.prototype.setAlliance(self, otherPlayer, whichAllianceSetting, value)
    SetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting, value)
end
function MapPlayer.prototype.setOnScoreScreen(self, flag)
    SetPlayerOnScoreScreen(self.handle, flag)
end
function MapPlayer.prototype.setState(self, whichPlayerState, value)
    SetPlayerState(self.handle, whichPlayerState, value)
end
function MapPlayer.prototype.setTaxRate(self, otherPlayer, whichResource, rate)
    SetPlayerTaxRate(self.handle, otherPlayer.handle, whichResource, rate)
end
function MapPlayer.prototype.setTechMaxAllowed(self, techId, maximum)
    SetPlayerTechMaxAllowed(self.handle, techId, maximum)
end
function MapPlayer.prototype.setTechResearched(self, techId, setToLevel)
    SetPlayerTechResearched(self.handle, techId, setToLevel)
end
function MapPlayer.prototype.setUnitsOwner(self, newOwner)
    SetPlayerUnitsOwner(self.handle, newOwner)
end
function MapPlayer.fromEnum(self)
    return ____exports.MapPlayer:fromHandle(GetEnumPlayer())
end
function MapPlayer.fromEvent(self)
    return ____exports.MapPlayer:fromHandle(GetTriggerPlayer())
end
function MapPlayer.fromFilter(self)
    return ____exports.MapPlayer:fromHandle(GetFilterPlayer())
end
function MapPlayer.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function MapPlayer.fromIndex(self, index)
    return self:fromHandle(Player(index))
end
function MapPlayer.fromLocal(self)
    local pl = GetLocalPlayer()
    if pl == nil then
        do
            local i = 0
            while i < 10 do
                DisplayTextToPlayer(
                    Player(0),
                    0,
                    0,
                    "$$$$$$$$$ LOCAL PLAYER IS NULL. TELL ME"
                )
                i = i + 1
            end
        end
    end
    return self:fromHandle(pl)
end
__TS__SetDescriptor(
    MapPlayer.prototype,
    "color",
    {
        get = function(self)
            return GetPlayerColor(self.handle)
        end,
        set = function(self, color)
            SetPlayerColor(self.handle, color)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "controller",
    {get = function(self)
        return GetPlayerController(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicap",
    {
        get = function(self)
            return GetPlayerHandicap(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicap(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicapXp",
    {
        get = function(self)
            return GetPlayerHandicapXP(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicapXP(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "id",
    {get = function(self)
        return GetPlayerId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "name",
    {
        get = function(self)
            return GetPlayerName(self.handle) or ""
        end,
        set = function(self, value)
            SetPlayerName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "race",
    {get = function(self)
        return GetPlayerRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "slotState",
    {get = function(self)
        return GetPlayerSlotState(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocation",
    {get = function(self)
        return GetPlayerStartLocation(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationX",
    {get = function(self)
        return GetStartLocationX(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationY",
    {get = function(self)
        return GetStartLocationY(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationPoint",
    {get = function(self)
        return GetStartLocationLoc(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "team",
    {get = function(self)
        return GetPlayerTeam(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.globals.define"] = function(...) 
local ____exports = {}
____exports.MAP_SPEED_NORMAL = function() return ConvertGameSpeed(2) end
____exports.bj_PI = 3.141592653589793
____exports.bj_E = 2.718281828459045
____exports.bj_CELLWIDTH = 128
____exports.bj_CLIFFHEIGHT = 128
____exports.bj_UNIT_FACING = 270
____exports.bj_RADTODEG = 180 / ____exports.bj_PI
____exports.bj_DEGTORAD = ____exports.bj_PI / 180
____exports.bj_TEXT_DELAY_QUEST = 20
____exports.bj_TEXT_DELAY_QUESTUPDATE = 20
____exports.bj_TEXT_DELAY_QUESTDONE = 20
____exports.bj_TEXT_DELAY_QUESTFAILED = 20
____exports.bj_TEXT_DELAY_QUESTREQUIREMENT = 20
____exports.bj_TEXT_DELAY_MISSIONFAILED = 20
____exports.bj_TEXT_DELAY_ALWAYSHINT = 12
____exports.bj_TEXT_DELAY_HINT = 12
____exports.bj_TEXT_DELAY_SECRET = 10
____exports.bj_TEXT_DELAY_UNITACQUIRED = 15
____exports.bj_TEXT_DELAY_UNITAVAILABLE = 10
____exports.bj_TEXT_DELAY_ITEMACQUIRED = 10
____exports.bj_TEXT_DELAY_WARNING = 12
____exports.bj_QUEUE_DELAY_QUEST = 5
____exports.bj_QUEUE_DELAY_HINT = 5
____exports.bj_QUEUE_DELAY_SECRET = 3
____exports.bj_HANDICAP_EASY = 60
____exports.bj_GAME_STARTED_THRESHOLD = 0.01
____exports.bj_WAIT_FOR_COND_MIN_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_SKIP_THRESHOLD = 2
____exports.bj_MAX_INVENTORY = 6
____exports.bj_MAX_PLAYERS = 12
____exports.bj_PLAYER_NEUTRAL_VICTIM = 13
____exports.bj_PLAYER_NEUTRAL_EXTRA = 14
____exports.bj_MAX_PLAYER_SLOTS = 16
____exports.bj_MAX_SKELETONS = 25
____exports.bj_MAX_STOCK_ITEM_SLOTS = 11
____exports.bj_MAX_STOCK_UNIT_SLOTS = 11
____exports.bj_MAX_ITEM_LEVEL = 10
____exports.bj_TOD_DAWN = 6
____exports.bj_TOD_DUSK = 18
____exports.bj_MELEE_STARTING_TOD = 8
____exports.bj_MELEE_STARTING_GOLD_V0 = 750
____exports.bj_MELEE_STARTING_GOLD_V1 = 500
____exports.bj_MELEE_STARTING_LUMBER_V0 = 200
____exports.bj_MELEE_STARTING_LUMBER_V1 = 150
____exports.bj_MELEE_STARTING_HERO_TOKENS = 1
____exports.bj_MELEE_HERO_LIMIT = 3
____exports.bj_MELEE_HERO_TYPE_LIMIT = 1
____exports.bj_MELEE_MINE_SEARCH_RADIUS = 2000
____exports.bj_MELEE_CLEAR_UNITS_RADIUS = 1500
____exports.bj_MELEE_CRIPPLE_TIMEOUT = 120
____exports.bj_MELEE_CRIPPLE_MSG_DURATION = 20
____exports.bj_MELEE_MAX_TWINKED_HEROES_V0 = 3
____exports.bj_MELEE_MAX_TWINKED_HEROES_V1 = 1
____exports.bj_CREEP_ITEM_DELAY = 0.5
____exports.bj_STOCK_RESTOCK_INITIAL_DELAY = 120
____exports.bj_STOCK_RESTOCK_INTERVAL = 30
____exports.bj_STOCK_MAX_ITERATIONS = 20
____exports.bj_MAX_DEST_IN_REGION_EVENTS = 64
____exports.bj_CAMERA_MIN_FARZ = 100
____exports.bj_CAMERA_DEFAULT_DISTANCE = 1650
____exports.bj_CAMERA_DEFAULT_FARZ = 5000
____exports.bj_CAMERA_DEFAULT_AOA = 304
____exports.bj_CAMERA_DEFAULT_FOV = 70
____exports.bj_CAMERA_DEFAULT_ROLL = 0
____exports.bj_CAMERA_DEFAULT_ROTATION = 90
____exports.bj_RESCUE_PING_TIME = 2
____exports.bj_NOTHING_SOUND_DURATION = 5
____exports.bj_TRANSMISSION_PING_TIME = 1
____exports.bj_TRANSMISSION_IND_RED = 255
____exports.bj_TRANSMISSION_IND_BLUE = 255
____exports.bj_TRANSMISSION_IND_GREEN = 255
____exports.bj_TRANSMISSION_IND_ALPHA = 255
____exports.bj_TRANSMISSION_PORT_HANGTIME = 1.5
____exports.bj_CINEMODE_INTERFACEFADE = 0.5
____exports.bj_CINEMODE_GAMESPEED = ____exports.MAP_SPEED_NORMAL
____exports.bj_CINEMODE_VOLUME_UNITMOVEMENT = 0.4
____exports.bj_CINEMODE_VOLUME_UNITSOUNDS = 0
____exports.bj_CINEMODE_VOLUME_COMBAT = 0.4
____exports.bj_CINEMODE_VOLUME_SPELLS = 0.4
____exports.bj_CINEMODE_VOLUME_UI = 0
____exports.bj_CINEMODE_VOLUME_MUSIC = 0.55
____exports.bj_CINEMODE_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_CINEMODE_VOLUME_FIRE = 0.6
____exports.bj_SPEECH_VOLUME_UNITMOVEMENT = 0.25
____exports.bj_SPEECH_VOLUME_UNITSOUNDS = 0
____exports.bj_SPEECH_VOLUME_COMBAT = 0.25
____exports.bj_SPEECH_VOLUME_SPELLS = 0.25
____exports.bj_SPEECH_VOLUME_UI = 0
____exports.bj_SPEECH_VOLUME_MUSIC = 0.55
____exports.bj_SPEECH_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_SPEECH_VOLUME_FIRE = 0.6
____exports.bj_SMARTPAN_TRESHOLD_PAN = 500
____exports.bj_SMARTPAN_TRESHOLD_SNAP = 3500
____exports.bj_MAX_QUEUED_TRIGGERS = 100
____exports.bj_QUEUED_TRIGGER_TIMEOUT = 180
____exports.bj_CAMPAIGN_INDEX_T = 0
____exports.bj_CAMPAIGN_INDEX_H = 1
____exports.bj_CAMPAIGN_INDEX_U = 2
____exports.bj_CAMPAIGN_INDEX_O = 3
____exports.bj_CAMPAIGN_INDEX_N = 4
____exports.bj_CAMPAIGN_INDEX_XN = 5
____exports.bj_CAMPAIGN_INDEX_XH = 6
____exports.bj_CAMPAIGN_INDEX_XU = 7
____exports.bj_CAMPAIGN_INDEX_XO = 8
____exports.bj_CAMPAIGN_OFFSET_T = 0
____exports.bj_CAMPAIGN_OFFSET_H = 1
____exports.bj_CAMPAIGN_OFFSET_U = 2
____exports.bj_CAMPAIGN_OFFSET_O = 3
____exports.bj_CAMPAIGN_OFFSET_N = 4
____exports.bj_CAMPAIGN_OFFSET_XN = 0
____exports.bj_CAMPAIGN_OFFSET_XH = 1
____exports.bj_CAMPAIGN_OFFSET_XU = 2
____exports.bj_CAMPAIGN_OFFSET_XO = 3
____exports.bj_MISSION_INDEX_T00 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 0
____exports.bj_MISSION_INDEX_T01 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 1
____exports.bj_MISSION_INDEX_H00 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 0
____exports.bj_MISSION_INDEX_H01 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 1
____exports.bj_MISSION_INDEX_H02 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 2
____exports.bj_MISSION_INDEX_H03 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 3
____exports.bj_MISSION_INDEX_H04 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 4
____exports.bj_MISSION_INDEX_H05 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 5
____exports.bj_MISSION_INDEX_H06 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 6
____exports.bj_MISSION_INDEX_H07 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 7
____exports.bj_MISSION_INDEX_H08 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 8
____exports.bj_MISSION_INDEX_H09 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 9
____exports.bj_MISSION_INDEX_H10 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 10
____exports.bj_MISSION_INDEX_H11 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 11
____exports.bj_MISSION_INDEX_U00 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 0
____exports.bj_MISSION_INDEX_U01 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 1
____exports.bj_MISSION_INDEX_U02 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 2
____exports.bj_MISSION_INDEX_U03 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 3
____exports.bj_MISSION_INDEX_U05 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 4
____exports.bj_MISSION_INDEX_U07 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 5
____exports.bj_MISSION_INDEX_U08 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 6
____exports.bj_MISSION_INDEX_U09 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 7
____exports.bj_MISSION_INDEX_U10 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 8
____exports.bj_MISSION_INDEX_U11 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 9
____exports.bj_MISSION_INDEX_O00 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 0
____exports.bj_MISSION_INDEX_O01 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 1
____exports.bj_MISSION_INDEX_O02 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 2
____exports.bj_MISSION_INDEX_O03 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 3
____exports.bj_MISSION_INDEX_O04 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 4
____exports.bj_MISSION_INDEX_O05 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 5
____exports.bj_MISSION_INDEX_O06 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 6
____exports.bj_MISSION_INDEX_O07 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 7
____exports.bj_MISSION_INDEX_O08 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 8
____exports.bj_MISSION_INDEX_O09 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 9
____exports.bj_MISSION_INDEX_O10 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 10
____exports.bj_MISSION_INDEX_N00 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 0
____exports.bj_MISSION_INDEX_N01 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 1
____exports.bj_MISSION_INDEX_N02 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 2
____exports.bj_MISSION_INDEX_N03 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 3
____exports.bj_MISSION_INDEX_N04 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 4
____exports.bj_MISSION_INDEX_N05 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 5
____exports.bj_MISSION_INDEX_N06 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 6
____exports.bj_MISSION_INDEX_N07 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 7
____exports.bj_MISSION_INDEX_N08 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 8
____exports.bj_MISSION_INDEX_N09 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 9
____exports.bj_MISSION_INDEX_XN00 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 0
____exports.bj_MISSION_INDEX_XN01 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 1
____exports.bj_MISSION_INDEX_XN02 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 2
____exports.bj_MISSION_INDEX_XN03 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 3
____exports.bj_MISSION_INDEX_XN04 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 4
____exports.bj_MISSION_INDEX_XN05 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 5
____exports.bj_MISSION_INDEX_XN06 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 6
____exports.bj_MISSION_INDEX_XN07 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 7
____exports.bj_MISSION_INDEX_XN08 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 8
____exports.bj_MISSION_INDEX_XN09 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 9
____exports.bj_MISSION_INDEX_XN10 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 10
____exports.bj_MISSION_INDEX_XH00 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 0
____exports.bj_MISSION_INDEX_XH01 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 1
____exports.bj_MISSION_INDEX_XH02 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 2
____exports.bj_MISSION_INDEX_XH03 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 3
____exports.bj_MISSION_INDEX_XH04 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 4
____exports.bj_MISSION_INDEX_XH05 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 5
____exports.bj_MISSION_INDEX_XH06 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 6
____exports.bj_MISSION_INDEX_XH07 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 7
____exports.bj_MISSION_INDEX_XH08 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 8
____exports.bj_MISSION_INDEX_XH09 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 9
____exports.bj_MISSION_INDEX_XU00 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 0
____exports.bj_MISSION_INDEX_XU01 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 1
____exports.bj_MISSION_INDEX_XU02 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 2
____exports.bj_MISSION_INDEX_XU03 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 3
____exports.bj_MISSION_INDEX_XU04 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 4
____exports.bj_MISSION_INDEX_XU05 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 5
____exports.bj_MISSION_INDEX_XU06 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 6
____exports.bj_MISSION_INDEX_XU07 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 7
____exports.bj_MISSION_INDEX_XU08 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 8
____exports.bj_MISSION_INDEX_XU09 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 9
____exports.bj_MISSION_INDEX_XU10 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 10
____exports.bj_MISSION_INDEX_XU11 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 11
____exports.bj_MISSION_INDEX_XU12 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 12
____exports.bj_MISSION_INDEX_XU13 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 13
____exports.bj_MISSION_INDEX_XO00 = ____exports.bj_CAMPAIGN_OFFSET_XO * 1000 + 0
____exports.bj_CINEMATICINDEX_TOP = 0
____exports.bj_CINEMATICINDEX_HOP = 1
____exports.bj_CINEMATICINDEX_HED = 2
____exports.bj_CINEMATICINDEX_OOP = 3
____exports.bj_CINEMATICINDEX_OED = 4
____exports.bj_CINEMATICINDEX_UOP = 5
____exports.bj_CINEMATICINDEX_UED = 6
____exports.bj_CINEMATICINDEX_NOP = 7
____exports.bj_CINEMATICINDEX_NED = 8
____exports.bj_CINEMATICINDEX_XOP = 9
____exports.bj_CINEMATICINDEX_XED = 10
____exports.bj_ALLIANCE_UNALLIED = 0
____exports.bj_ALLIANCE_UNALLIED_VISION = 1
____exports.bj_ALLIANCE_ALLIED = 2
____exports.bj_ALLIANCE_ALLIED_VISION = 3
____exports.bj_ALLIANCE_ALLIED_UNITS = 4
____exports.bj_ALLIANCE_ALLIED_ADVUNITS = 5
____exports.bj_ALLIANCE_NEUTRAL = 6
____exports.bj_ALLIANCE_NEUTRAL_VISION = 7
____exports.bj_KEYEVENTTYPE_DEPRESS = 0
____exports.bj_KEYEVENTTYPE_RELEASE = 1
____exports.bj_KEYEVENTKEY_LEFT = 0
____exports.bj_KEYEVENTKEY_RIGHT = 1
____exports.bj_KEYEVENTKEY_DOWN = 2
____exports.bj_KEYEVENTKEY_UP = 3
____exports.bj_TIMETYPE_ADD = 0
____exports.bj_TIMETYPE_SET = 1
____exports.bj_TIMETYPE_SUB = 2
____exports.bj_CAMERABOUNDS_ADJUST_ADD = 0
____exports.bj_CAMERABOUNDS_ADJUST_SUB = 1
____exports.bj_QUESTTYPE_REQ_DISCOVERED = 0
____exports.bj_QUESTTYPE_REQ_UNDISCOVERED = 1
____exports.bj_QUESTTYPE_OPT_DISCOVERED = 2
____exports.bj_QUESTTYPE_OPT_UNDISCOVERED = 3
____exports.bj_QUESTMESSAGE_DISCOVERED = 0
____exports.bj_QUESTMESSAGE_UPDATED = 1
____exports.bj_QUESTMESSAGE_COMPLETED = 2
____exports.bj_QUESTMESSAGE_FAILED = 3
____exports.bj_QUESTMESSAGE_REQUIREMENT = 4
____exports.bj_QUESTMESSAGE_MISSIONFAILED = 5
____exports.bj_QUESTMESSAGE_ALWAYSHINT = 6
____exports.bj_QUESTMESSAGE_HINT = 7
____exports.bj_QUESTMESSAGE_SECRET = 8
____exports.bj_QUESTMESSAGE_UNITACQUIRED = 9
____exports.bj_QUESTMESSAGE_UNITAVAILABLE = 10
____exports.bj_QUESTMESSAGE_ITEMACQUIRED = 11
____exports.bj_QUESTMESSAGE_WARNING = 12
____exports.bj_SORTTYPE_SORTBYVALUE = 0
____exports.bj_SORTTYPE_SORTBYPLAYER = 1
____exports.bj_SORTTYPE_SORTBYLABEL = 2
____exports.bj_CINEFADETYPE_FADEIN = 0
____exports.bj_CINEFADETYPE_FADEOUT = 1
____exports.bj_CINEFADETYPE_FADEOUTIN = 2
____exports.bj_REMOVEBUFFS_POSITIVE = 0
____exports.bj_REMOVEBUFFS_NEGATIVE = 1
____exports.bj_REMOVEBUFFS_ALL = 2
____exports.bj_REMOVEBUFFS_NONTLIFE = 3
____exports.bj_BUFF_POLARITY_POSITIVE = 0
____exports.bj_BUFF_POLARITY_NEGATIVE = 1
____exports.bj_BUFF_POLARITY_EITHER = 2
____exports.bj_BUFF_RESIST_MAGIC = 0
____exports.bj_BUFF_RESIST_PHYSICAL = 1
____exports.bj_BUFF_RESIST_EITHER = 2
____exports.bj_BUFF_RESIST_BOTH = 3
____exports.bj_HEROSTAT_STR = 0
____exports.bj_HEROSTAT_AGI = 1
____exports.bj_HEROSTAT_INT = 2
____exports.bj_MODIFYMETHOD_ADD = 0
____exports.bj_MODIFYMETHOD_SUB = 1
____exports.bj_MODIFYMETHOD_SET = 2
____exports.bj_UNIT_STATE_METHOD_ABSOLUTE = 0
____exports.bj_UNIT_STATE_METHOD_RELATIVE = 1
____exports.bj_UNIT_STATE_METHOD_DEFAULTS = 2
____exports.bj_UNIT_STATE_METHOD_MAXIMUM = 3
____exports.bj_GATEOPERATION_CLOSE = 0
____exports.bj_GATEOPERATION_OPEN = 1
____exports.bj_GATEOPERATION_DESTROY = 2
____exports.bj_GAMECACHE_BOOLEAN = 0
____exports.bj_GAMECACHE_INTEGER = 1
____exports.bj_GAMECACHE_REAL = 2
____exports.bj_GAMECACHE_UNIT = 3
____exports.bj_GAMECACHE_STRING = 4
____exports.bj_ITEM_STATUS_HIDDEN = 0
____exports.bj_ITEM_STATUS_OWNED = 1
____exports.bj_ITEM_STATUS_INVULNERABLE = 2
____exports.bj_ITEM_STATUS_POWERUP = 3
____exports.bj_ITEM_STATUS_SELLABLE = 4
____exports.bj_ITEM_STATUS_PAWNABLE = 5
____exports.bj_ITEMCODE_STATUS_POWERUP = 0
____exports.bj_ITEMCODE_STATUS_SELLABLE = 1
____exports.bj_ITEMCODE_STATUS_PAWNABLE = 2
____exports.bj_MINIMAPPINGSTYLE_SIMPLE = 0
____exports.bj_MINIMAPPINGSTYLE_FLASHY = 1
____exports.bj_MINIMAPPINGSTYLE_ATTACK = 2
____exports.bj_CORPSE_MAX_DEATH_TIME = 8
____exports.bj_CORPSETYPE_FLESH = 0
____exports.bj_CORPSETYPE_BONE = 1
____exports.bj_ELEVATOR_BLOCKER_CODE = "DTep"
____exports.bj_ELEVATOR_CODE01 = "DTrf"
____exports.bj_ELEVATOR_CODE02 = "DTrx"
____exports.bj_ELEVATOR_WALL_TYPE_ALL = 0
____exports.bj_ELEVATOR_WALL_TYPE_EAST = 1
____exports.bj_ELEVATOR_WALL_TYPE_NORTH = 2
____exports.bj_ELEVATOR_WALL_TYPE_SOUTH = 3
____exports.bj_ELEVATOR_WALL_TYPE_WEST = 4
____exports.bj_MELEE_MAX_TWINKED_HEROES = 0
____exports.bj_mapInitialPlayableArea = nil
____exports.bj_mapInitialCameraBounds = nil
____exports.bj_forLoopAIndex = 0
____exports.bj_forLoopBIndex = 0
____exports.bj_forLoopAIndexEnd = 0
____exports.bj_forLoopBIndexEnd = 0
____exports.bj_slotControlReady = false
____exports.bj_gameStartedTimer = nil
____exports.bj_gameStarted = false
____exports.bj_isSinglePlayer = false
____exports.bj_dncSoundsDay = nil
____exports.bj_dncSoundsNight = nil
____exports.bj_dayAmbientSound = nil
____exports.bj_nightAmbientSound = nil
____exports.bj_dncSoundsDawn = nil
____exports.bj_dncSoundsDusk = nil
____exports.bj_dawnSound = nil
____exports.bj_duskSound = nil
____exports.bj_useDawnDuskSounds = true
____exports.bj_dncIsDaytime = false
____exports.bj_rescueSound = nil
____exports.bj_questDiscoveredSound = nil
____exports.bj_questUpdatedSound = nil
____exports.bj_questCompletedSound = nil
____exports.bj_questFailedSound = nil
____exports.bj_questHintSound = nil
____exports.bj_questSecretSound = nil
____exports.bj_questItemAcquiredSound = nil
____exports.bj_questWarningSound = nil
____exports.bj_victoryDialogSound = nil
____exports.bj_defeatDialogSound = nil
____exports.bj_rescueUnitBehavior = nil
____exports.bj_rescueChangeColorUnit = true
____exports.bj_rescueChangeColorBldg = true
____exports.bj_cineSceneEndingTimer = nil
____exports.bj_cineSceneLastSound = nil
____exports.bj_cineSceneBeingSkipped = nil
____exports.bj_cineModePriorSpeed = ____exports.MAP_SPEED_NORMAL
____exports.bj_cineModePriorFogSetting = false
____exports.bj_cineModePriorMaskSetting = false
____exports.bj_cineModeAlreadyIn = false
____exports.bj_cineModePriorDawnDusk = false
____exports.bj_cineModeSavedSeed = 0
____exports.bj_cineFadeFinishTimer = nil
____exports.bj_cineFadeContinueTimer = nil
____exports.bj_cineFadeContinueRed = 0
____exports.bj_cineFadeContinueGreen = 0
____exports.bj_cineFadeContinueBlue = 0
____exports.bj_cineFadeContinueTrans = 0
____exports.bj_cineFadeContinueDuration = 0
____exports.bj_cineFadeContinueTex = ""
____exports.JASS_MAX_ARRAY_SIZE = 8192
____exports.PLAYER_NEUTRAL_PASSIVE = 15
____exports.PLAYER_NEUTRAL_AGGRESSIVE = 12
____exports.PLAYER_COLOR_RED = function() return ConvertPlayerColor(0) end
____exports.PLAYER_COLOR_BLUE = function() return ConvertPlayerColor(1) end
____exports.PLAYER_COLOR_CYAN = function() return ConvertPlayerColor(2) end
____exports.PLAYER_COLOR_PURPLE = function() return ConvertPlayerColor(3) end
____exports.PLAYER_COLOR_YELLOW = function() return ConvertPlayerColor(4) end
____exports.PLAYER_COLOR_ORANGE = function() return ConvertPlayerColor(5) end
____exports.PLAYER_COLOR_GREEN = function() return ConvertPlayerColor(6) end
____exports.PLAYER_COLOR_PINK = function() return ConvertPlayerColor(7) end
____exports.PLAYER_COLOR_LIGHT_GRAY = function() return ConvertPlayerColor(8) end
____exports.PLAYER_COLOR_LIGHT_BLUE = function() return ConvertPlayerColor(9) end
____exports.PLAYER_COLOR_AQUA = function() return ConvertPlayerColor(10) end
____exports.PLAYER_COLOR_BROWN = function() return ConvertPlayerColor(11) end
____exports.PLAYER_COLOR_BLACK = function() return ConvertPlayerColor(12) end
____exports.RACE_HUMAN = function() return ConvertRace(1) end
____exports.RACE_ORC = function() return ConvertRace(2) end
____exports.RACE_UNDEAD = function() return ConvertRace(3) end
____exports.RACE_NIGHTELF = function() return ConvertRace(4) end
____exports.RACE_DEMON = function() return ConvertRace(5) end
____exports.RACE_OTHER = function() return ConvertRace(7) end
____exports.PLAYER_GAME_RESULT_VICTORY = function() return ConvertPlayerGameResult(0) end
____exports.PLAYER_GAME_RESULT_DEFEAT = function() return ConvertPlayerGameResult(1) end
____exports.PLAYER_GAME_RESULT_TIE = function() return ConvertPlayerGameResult(2) end
____exports.PLAYER_GAME_RESULT_NEUTRAL = function() return ConvertPlayerGameResult(3) end
____exports.ALLIANCE_PASSIVE = function() return ConvertAllianceType(0) end
____exports.ALLIANCE_HELP_REQUEST = function() return ConvertAllianceType(1) end
____exports.ALLIANCE_HELP_RESPONSE = function() return ConvertAllianceType(2) end
____exports.ALLIANCE_SHARED_XP = function() return ConvertAllianceType(3) end
____exports.ALLIANCE_SHARED_SPELLS = function() return ConvertAllianceType(4) end
____exports.ALLIANCE_SHARED_VISION = function() return ConvertAllianceType(5) end
____exports.ALLIANCE_SHARED_CONTROL = function() return ConvertAllianceType(6) end
____exports.ALLIANCE_SHARED_ADVANCED_CONTROL = function() return ConvertAllianceType(7) end
____exports.ALLIANCE_RESCUABLE = function() return ConvertAllianceType(8) end
____exports.ALLIANCE_SHARED_VISION_FORCED = function() return ConvertAllianceType(9) end
____exports.VERSION_REIGN_OF_CHAOS = function() return ConvertVersion(0) end
____exports.VERSION_FROZEN_THRONE = function() return ConvertVersion(1) end
____exports.ATTACK_TYPE_NORMAL = function() return ConvertAttackType(0) end
____exports.ATTACK_TYPE_MELEE = function() return ConvertAttackType(1) end
____exports.ATTACK_TYPE_PIERCE = function() return ConvertAttackType(2) end
____exports.ATTACK_TYPE_SIEGE = function() return ConvertAttackType(3) end
____exports.ATTACK_TYPE_MAGIC = function() return ConvertAttackType(4) end
____exports.ATTACK_TYPE_CHAOS = function() return ConvertAttackType(5) end
____exports.ATTACK_TYPE_HERO = function() return ConvertAttackType(6) end
____exports.DAMAGE_TYPE_UNKNOWN = function() return ConvertDamageType(0) end
____exports.DAMAGE_TYPE_NORMAL = function() return ConvertDamageType(4) end
____exports.DAMAGE_TYPE_ENHANCED = function() return ConvertDamageType(5) end
____exports.DAMAGE_TYPE_FIRE = function() return ConvertDamageType(8) end
____exports.DAMAGE_TYPE_COLD = function() return ConvertDamageType(9) end
____exports.DAMAGE_TYPE_LIGHTNING = function() return ConvertDamageType(10) end
____exports.DAMAGE_TYPE_POISON = function() return ConvertDamageType(11) end
____exports.DAMAGE_TYPE_DISEASE = function() return ConvertDamageType(12) end
____exports.DAMAGE_TYPE_DIVINE = function() return ConvertDamageType(13) end
____exports.DAMAGE_TYPE_MAGIC = function() return ConvertDamageType(14) end
____exports.DAMAGE_TYPE_SONIC = function() return ConvertDamageType(15) end
____exports.DAMAGE_TYPE_ACID = function() return ConvertDamageType(16) end
____exports.DAMAGE_TYPE_FORCE = function() return ConvertDamageType(17) end
____exports.DAMAGE_TYPE_DEATH = function() return ConvertDamageType(18) end
____exports.DAMAGE_TYPE_MIND = function() return ConvertDamageType(19) end
____exports.DAMAGE_TYPE_PLANT = function() return ConvertDamageType(20) end
____exports.DAMAGE_TYPE_DEFENSIVE = function() return ConvertDamageType(21) end
____exports.DAMAGE_TYPE_DEMOLITION = function() return ConvertDamageType(22) end
____exports.DAMAGE_TYPE_SLOW_POISON = function() return ConvertDamageType(23) end
____exports.DAMAGE_TYPE_SPIRIT_LINK = function() return ConvertDamageType(24) end
____exports.DAMAGE_TYPE_SHADOW_STRIKE = function() return ConvertDamageType(25) end
____exports.DAMAGE_TYPE_UNIVERSAL = function() return ConvertDamageType(26) end
____exports.WEAPON_TYPE_WHOKNOWS = function() return ConvertWeaponType(0) end
____exports.WEAPON_TYPE_METAL_LIGHT_CHOP = function() return ConvertWeaponType(1) end
____exports.WEAPON_TYPE_METAL_MEDIUM_CHOP = function() return ConvertWeaponType(2) end
____exports.WEAPON_TYPE_METAL_HEAVY_CHOP = function() return ConvertWeaponType(3) end
____exports.WEAPON_TYPE_METAL_LIGHT_SLICE = function() return ConvertWeaponType(4) end
____exports.WEAPON_TYPE_METAL_MEDIUM_SLICE = function() return ConvertWeaponType(5) end
____exports.WEAPON_TYPE_METAL_HEAVY_SLICE = function() return ConvertWeaponType(6) end
____exports.WEAPON_TYPE_METAL_MEDIUM_BASH = function() return ConvertWeaponType(7) end
____exports.WEAPON_TYPE_METAL_HEAVY_BASH = function() return ConvertWeaponType(8) end
____exports.WEAPON_TYPE_METAL_MEDIUM_STAB = function() return ConvertWeaponType(9) end
____exports.WEAPON_TYPE_METAL_HEAVY_STAB = function() return ConvertWeaponType(10) end
____exports.WEAPON_TYPE_WOOD_LIGHT_SLICE = function() return ConvertWeaponType(11) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_SLICE = function() return ConvertWeaponType(12) end
____exports.WEAPON_TYPE_WOOD_HEAVY_SLICE = function() return ConvertWeaponType(13) end
____exports.WEAPON_TYPE_WOOD_LIGHT_BASH = function() return ConvertWeaponType(14) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_BASH = function() return ConvertWeaponType(15) end
____exports.WEAPON_TYPE_WOOD_HEAVY_BASH = function() return ConvertWeaponType(16) end
____exports.WEAPON_TYPE_WOOD_LIGHT_STAB = function() return ConvertWeaponType(17) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_STAB = function() return ConvertWeaponType(18) end
____exports.WEAPON_TYPE_CLAW_LIGHT_SLICE = function() return ConvertWeaponType(19) end
____exports.WEAPON_TYPE_CLAW_MEDIUM_SLICE = function() return ConvertWeaponType(20) end
____exports.WEAPON_TYPE_CLAW_HEAVY_SLICE = function() return ConvertWeaponType(21) end
____exports.WEAPON_TYPE_AXE_MEDIUM_CHOP = function() return ConvertWeaponType(22) end
____exports.WEAPON_TYPE_ROCK_HEAVY_BASH = function() return ConvertWeaponType(23) end
____exports.PATHING_TYPE_ANY = function() return ConvertPathingType(0) end
____exports.PATHING_TYPE_WALKABILITY = function() return ConvertPathingType(1) end
____exports.PATHING_TYPE_FLYABILITY = function() return ConvertPathingType(2) end
____exports.PATHING_TYPE_BUILDABILITY = function() return ConvertPathingType(3) end
____exports.PATHING_TYPE_PEONHARVESTPATHING = function() return ConvertPathingType(4) end
____exports.PATHING_TYPE_BLIGHTPATHING = function() return ConvertPathingType(5) end
____exports.PATHING_TYPE_FLOATABILITY = function() return ConvertPathingType(6) end
____exports.PATHING_TYPE_AMPHIBIOUSPATHING = function() return ConvertPathingType(7) end
____exports.RACE_PREF_HUMAN = function() return ConvertRacePref(1) end
____exports.RACE_PREF_ORC = function() return ConvertRacePref(2) end
____exports.RACE_PREF_NIGHTELF = function() return ConvertRacePref(4) end
____exports.RACE_PREF_UNDEAD = function() return ConvertRacePref(8) end
____exports.RACE_PREF_DEMON = function() return ConvertRacePref(16) end
____exports.RACE_PREF_RANDOM = function() return ConvertRacePref(32) end
____exports.RACE_PREF_USER_SELECTABLE = function() return ConvertRacePref(64) end
____exports.MAP_CONTROL_USER = function() return ConvertMapControl(0) end
____exports.MAP_CONTROL_COMPUTER = function() return ConvertMapControl(1) end
____exports.MAP_CONTROL_RESCUABLE = function() return ConvertMapControl(2) end
____exports.MAP_CONTROL_NEUTRAL = function() return ConvertMapControl(3) end
____exports.MAP_CONTROL_CREEP = function() return ConvertMapControl(4) end
____exports.MAP_CONTROL_NONE = function() return ConvertMapControl(5) end
____exports.GAME_TYPE_MELEE = function() return ConvertGameType(1) end
____exports.GAME_TYPE_FFA = function() return ConvertGameType(2) end
____exports.GAME_TYPE_USE_MAP_SETTINGS = function() return ConvertGameType(4) end
____exports.GAME_TYPE_BLIZ = function() return ConvertGameType(8) end
____exports.GAME_TYPE_ONE_ON_ONE = function() return ConvertGameType(16) end
____exports.GAME_TYPE_TWO_TEAM_PLAY = function() return ConvertGameType(32) end
____exports.GAME_TYPE_THREE_TEAM_PLAY = function() return ConvertGameType(64) end
____exports.GAME_TYPE_FOUR_TEAM_PLAY = function() return ConvertGameType(128) end
____exports.MAP_FOG_HIDE_TERRAIN = function() return ConvertMapFlag(1) end
____exports.MAP_FOG_MAP_EXPLORED = function() return ConvertMapFlag(2) end
____exports.MAP_FOG_ALWAYS_VISIBLE = function() return ConvertMapFlag(4) end
____exports.MAP_USE_HANDICAPS = function() return ConvertMapFlag(8) end
____exports.MAP_OBSERVERS = function() return ConvertMapFlag(16) end
____exports.MAP_OBSERVERS_ON_DEATH = function() return ConvertMapFlag(32) end
____exports.MAP_FIXED_COLORS = function() return ConvertMapFlag(128) end
____exports.MAP_LOCK_RESOURCE_TRADING = function() return ConvertMapFlag(256) end
____exports.MAP_RESOURCE_TRADING_ALLIES_ONLY = function() return ConvertMapFlag(512) end
____exports.MAP_LOCK_ALLIANCE_CHANGES = function() return ConvertMapFlag(1024) end
____exports.MAP_ALLIANCE_CHANGES_HIDDEN = function() return ConvertMapFlag(2048) end
____exports.MAP_CHEATS = function() return ConvertMapFlag(4096) end
____exports.MAP_CHEATS_HIDDEN = function() return ConvertMapFlag(8192) end
____exports.MAP_LOCK_SPEED = function() return ConvertMapFlag(8192 * 2) end
____exports.MAP_LOCK_RANDOM_SEED = function() return ConvertMapFlag(8192 * 4) end
____exports.MAP_SHARED_ADVANCED_CONTROL = function() return ConvertMapFlag(8192 * 8) end
____exports.MAP_RANDOM_HERO = function() return ConvertMapFlag(8192 * 16) end
____exports.MAP_RANDOM_RACES = function() return ConvertMapFlag(8192 * 32) end
____exports.MAP_RELOADED = function() return ConvertMapFlag(8192 * 64) end
____exports.MAP_PLACEMENT_RANDOM = function() return ConvertPlacement(0) end
____exports.MAP_PLACEMENT_FIXED = function() return ConvertPlacement(1) end
____exports.MAP_PLACEMENT_USE_MAP_SETTINGS = function() return ConvertPlacement(2) end
____exports.MAP_PLACEMENT_TEAMS_TOGETHER = function() return ConvertPlacement(3) end
____exports.MAP_LOC_PRIO_LOW = function() return ConvertStartLocPrio(0) end
____exports.MAP_LOC_PRIO_HIGH = function() return ConvertStartLocPrio(1) end
____exports.MAP_LOC_PRIO_NOT = function() return ConvertStartLocPrio(2) end
____exports.MAP_DENSITY_NONE = function() return ConvertMapDensity(0) end
____exports.MAP_DENSITY_LIGHT = function() return ConvertMapDensity(1) end
____exports.MAP_DENSITY_MEDIUM = function() return ConvertMapDensity(2) end
____exports.MAP_DENSITY_HEAVY = function() return ConvertMapDensity(3) end
____exports.MAP_DIFFICULTY_EASY = function() return ConvertGameDifficulty(0) end
____exports.MAP_DIFFICULTY_NORMAL = function() return ConvertGameDifficulty(1) end
____exports.MAP_DIFFICULTY_HARD = function() return ConvertGameDifficulty(2) end
____exports.MAP_DIFFICULTY_INSANE = function() return ConvertGameDifficulty(3) end
____exports.MAP_SPEED_SLOWEST = function() return ConvertGameSpeed(0) end
____exports.MAP_SPEED_SLOW = function() return ConvertGameSpeed(1) end
____exports.MAP_SPEED_FAST = function() return ConvertGameSpeed(3) end
____exports.MAP_SPEED_FASTEST = function() return ConvertGameSpeed(4) end
____exports.PLAYER_SLOT_STATE_EMPTY = function() return ConvertPlayerSlotState(0) end
____exports.PLAYER_SLOT_STATE_PLAYING = function() return ConvertPlayerSlotState(1) end
____exports.PLAYER_SLOT_STATE_LEFT = function() return ConvertPlayerSlotState(2) end
____exports.SOUND_VOLUMEGROUP_UNITMOVEMENT = function() return ConvertVolumeGroup(0) end
____exports.SOUND_VOLUMEGROUP_UNITSOUNDS = function() return ConvertVolumeGroup(1) end
____exports.SOUND_VOLUMEGROUP_COMBAT = function() return ConvertVolumeGroup(2) end
____exports.SOUND_VOLUMEGROUP_SPELLS = function() return ConvertVolumeGroup(3) end
____exports.SOUND_VOLUMEGROUP_UI = function() return ConvertVolumeGroup(4) end
____exports.SOUND_VOLUMEGROUP_MUSIC = function() return ConvertVolumeGroup(5) end
____exports.SOUND_VOLUMEGROUP_AMBIENTSOUNDS = function() return ConvertVolumeGroup(6) end
____exports.SOUND_VOLUMEGROUP_FIRE = function() return ConvertVolumeGroup(7) end
____exports.GAME_STATE_DIVINE_INTERVENTION = function() return ConvertIGameState(0) end
____exports.GAME_STATE_DISCONNECTED = function() return ConvertIGameState(1) end
____exports.GAME_STATE_TIME_OF_DAY = function() return ConvertFGameState(2) end
____exports.PLAYER_STATE_GAME_RESULT = function() return ConvertPlayerState(0) end
____exports.PLAYER_STATE_RESOURCE_GOLD = function() return ConvertPlayerState(1) end
____exports.PLAYER_STATE_RESOURCE_LUMBER = function() return ConvertPlayerState(2) end
____exports.PLAYER_STATE_RESOURCE_HERO_TOKENS = function() return ConvertPlayerState(3) end
____exports.PLAYER_STATE_RESOURCE_FOOD_CAP = function() return ConvertPlayerState(4) end
____exports.PLAYER_STATE_RESOURCE_FOOD_USED = function() return ConvertPlayerState(5) end
____exports.PLAYER_STATE_FOOD_CAP_CEILING = function() return ConvertPlayerState(6) end
____exports.PLAYER_STATE_GIVES_BOUNTY = function() return ConvertPlayerState(7) end
____exports.PLAYER_STATE_ALLIED_VICTORY = function() return ConvertPlayerState(8) end
____exports.PLAYER_STATE_PLACED = function() return ConvertPlayerState(9) end
____exports.PLAYER_STATE_OBSERVER_ON_DEATH = function() return ConvertPlayerState(10) end
____exports.PLAYER_STATE_OBSERVER = function() return ConvertPlayerState(11) end
____exports.PLAYER_STATE_UNFOLLOWABLE = function() return ConvertPlayerState(12) end
____exports.PLAYER_STATE_GOLD_UPKEEP_RATE = function() return ConvertPlayerState(13) end
____exports.PLAYER_STATE_LUMBER_UPKEEP_RATE = function() return ConvertPlayerState(14) end
____exports.PLAYER_STATE_GOLD_GATHERED = function() return ConvertPlayerState(15) end
____exports.PLAYER_STATE_LUMBER_GATHERED = function() return ConvertPlayerState(16) end
____exports.PLAYER_STATE_NO_CREEP_SLEEP = function() return ConvertPlayerState(25) end
____exports.UNIT_STATE_LIFE = function() return ConvertUnitState(0) end
____exports.UNIT_STATE_MAX_LIFE = function() return ConvertUnitState(1) end
____exports.UNIT_STATE_MANA = function() return ConvertUnitState(2) end
____exports.UNIT_STATE_MAX_MANA = function() return ConvertUnitState(3) end
____exports.UNIT_STATE_ATTACK_DICE = function() return ConvertUnitState(16) end
____exports.UNIT_STATE_ATTACK_SIDE = function() return ConvertUnitState(17) end
____exports.UNIT_STATE_ATTACK_WHITE = function() return ConvertUnitState(18) end
____exports.UNIT_STATE_ATTACK_BONUS = function() return ConvertUnitState(19) end
____exports.UNIT_STATE_ATTACK_MIX = function() return ConvertUnitState(20) end
____exports.UNIT_STATE_ATTACK_MAX = function() return ConvertUnitState(21) end
____exports.UNIT_STATE_ATTACK_RANGE = function() return ConvertUnitState(22) end
____exports.UNIT_STATE_DEFEND_WHITE = function() return ConvertUnitState(32) end
____exports.UNIT_STATE_ATTACK_SPACE = function() return ConvertUnitState(37) end
____exports.UNIT_STATE_ATTACK_SPEED = function() return ConvertUnitState(81) end
____exports.AI_DIFFICULTY_NEWBIE = function() return ConvertAIDifficulty(0) end
____exports.AI_DIFFICULTY_NORMAL = function() return ConvertAIDifficulty(1) end
____exports.AI_DIFFICULTY_INSANE = function() return ConvertAIDifficulty(2) end
____exports.PLAYER_SCORE_UNITS_TRAINED = function() return ConvertPlayerScore(0) end
____exports.PLAYER_SCORE_UNITS_KILLED = function() return ConvertPlayerScore(1) end
____exports.PLAYER_SCORE_STRUCT_BUILT = function() return ConvertPlayerScore(2) end
____exports.PLAYER_SCORE_STRUCT_RAZED = function() return ConvertPlayerScore(3) end
____exports.PLAYER_SCORE_TECH_PERCENT = function() return ConvertPlayerScore(4) end
____exports.PLAYER_SCORE_FOOD_MAXPROD = function() return ConvertPlayerScore(5) end
____exports.PLAYER_SCORE_FOOD_MAXUSED = function() return ConvertPlayerScore(6) end
____exports.PLAYER_SCORE_HEROES_KILLED = function() return ConvertPlayerScore(7) end
____exports.PLAYER_SCORE_ITEMS_GAINED = function() return ConvertPlayerScore(8) end
____exports.PLAYER_SCORE_MERCS_HIRED = function() return ConvertPlayerScore(9) end
____exports.PLAYER_SCORE_GOLD_MINED_TOTAL = function() return ConvertPlayerScore(10) end
____exports.PLAYER_SCORE_GOLD_MINED_UPKEEP = function() return ConvertPlayerScore(11) end
____exports.PLAYER_SCORE_GOLD_LOST_UPKEEP = function() return ConvertPlayerScore(12) end
____exports.PLAYER_SCORE_GOLD_LOST_TAX = function() return ConvertPlayerScore(13) end
____exports.PLAYER_SCORE_GOLD_GIVEN = function() return ConvertPlayerScore(14) end
____exports.PLAYER_SCORE_GOLD_RECEIVED = function() return ConvertPlayerScore(15) end
____exports.PLAYER_SCORE_LUMBER_TOTAL = function() return ConvertPlayerScore(16) end
____exports.PLAYER_SCORE_LUMBER_LOST_UPKEEP = function() return ConvertPlayerScore(17) end
____exports.PLAYER_SCORE_LUMBER_LOST_TAX = function() return ConvertPlayerScore(18) end
____exports.PLAYER_SCORE_LUMBER_GIVEN = function() return ConvertPlayerScore(19) end
____exports.PLAYER_SCORE_LUMBER_RECEIVED = function() return ConvertPlayerScore(20) end
____exports.PLAYER_SCORE_UNIT_TOTAL = function() return ConvertPlayerScore(21) end
____exports.PLAYER_SCORE_HERO_TOTAL = function() return ConvertPlayerScore(22) end
____exports.PLAYER_SCORE_RESOURCE_TOTAL = function() return ConvertPlayerScore(23) end
____exports.PLAYER_SCORE_TOTAL = function() return ConvertPlayerScore(24) end
____exports.EVENT_GAME_VICTORY = function() return ConvertGameEvent(0) end
____exports.EVENT_GAME_END_LEVEL = function() return ConvertGameEvent(1) end
____exports.EVENT_GAME_VARIABLE_LIMIT = function() return ConvertGameEvent(2) end
____exports.EVENT_GAME_STATE_LIMIT = function() return ConvertGameEvent(3) end
____exports.EVENT_GAME_TIMER_EXPIRED = function() return ConvertGameEvent(4) end
____exports.EVENT_GAME_ENTER_REGION = function() return ConvertGameEvent(5) end
____exports.EVENT_GAME_LEAVE_REGION = function() return ConvertGameEvent(6) end
____exports.EVENT_GAME_TRACKABLE_HIT = function() return ConvertGameEvent(7) end
____exports.EVENT_GAME_TRACKABLE_TRACK = function() return ConvertGameEvent(8) end
____exports.EVENT_GAME_SHOW_SKILL = function() return ConvertGameEvent(9) end
____exports.EVENT_GAME_BUILD_SUBMENU = function() return ConvertGameEvent(10) end
____exports.EVENT_PLAYER_STATE_LIMIT = function() return ConvertPlayerEvent(11) end
____exports.EVENT_PLAYER_ALLIANCE_CHANGED = function() return ConvertPlayerEvent(12) end
____exports.EVENT_PLAYER_DEFEAT = function() return ConvertPlayerEvent(13) end
____exports.EVENT_PLAYER_VICTORY = function() return ConvertPlayerEvent(14) end
____exports.EVENT_PLAYER_LEAVE = function() return ConvertPlayerEvent(15) end
____exports.EVENT_PLAYER_CHAT = function() return ConvertPlayerEvent(16) end
____exports.EVENT_PLAYER_END_CINEMATIC = function() return ConvertPlayerEvent(17) end
____exports.EVENT_PLAYER_UNIT_ATTACKED = function() return ConvertPlayerUnitEvent(18) end
____exports.EVENT_PLAYER_UNIT_RESCUED = function() return ConvertPlayerUnitEvent(19) end
____exports.EVENT_PLAYER_UNIT_DEATH = function() return ConvertPlayerUnitEvent(20) end
____exports.EVENT_PLAYER_UNIT_DECAY = function() return ConvertPlayerUnitEvent(21) end
____exports.EVENT_PLAYER_UNIT_DETECTED = function() return ConvertPlayerUnitEvent(22) end
____exports.EVENT_PLAYER_UNIT_HIDDEN = function() return ConvertPlayerUnitEvent(23) end
____exports.EVENT_PLAYER_UNIT_SELECTED = function() return ConvertPlayerUnitEvent(24) end
____exports.EVENT_PLAYER_UNIT_DESELECTED = function() return ConvertPlayerUnitEvent(25) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_START = function() return ConvertPlayerUnitEvent(26) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL = function() return ConvertPlayerUnitEvent(27) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_FINISH = function() return ConvertPlayerUnitEvent(28) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_START = function() return ConvertPlayerUnitEvent(29) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_CANCEL = function() return ConvertPlayerUnitEvent(30) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_FINISH = function() return ConvertPlayerUnitEvent(31) end
____exports.EVENT_PLAYER_UNIT_TRAIN_START = function() return ConvertPlayerUnitEvent(32) end
____exports.EVENT_PLAYER_UNIT_TRAIN_CANCEL = function() return ConvertPlayerUnitEvent(33) end
____exports.EVENT_PLAYER_UNIT_TRAIN_FINISH = function() return ConvertPlayerUnitEvent(34) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_START = function() return ConvertPlayerUnitEvent(35) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_CANCEL = function() return ConvertPlayerUnitEvent(36) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_FINISH = function() return ConvertPlayerUnitEvent(37) end
____exports.EVENT_PLAYER_UNIT_ISSUED_ORDER = function() return ConvertPlayerUnitEvent(38) end
____exports.EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER = function() return ConvertPlayerUnitEvent(39) end
____exports.EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_HERO_LEVEL = function() return ConvertPlayerUnitEvent(41) end
____exports.EVENT_PLAYER_HERO_SKILL = function() return ConvertPlayerUnitEvent(42) end
____exports.EVENT_PLAYER_HERO_REVIVABLE = function() return ConvertPlayerUnitEvent(43) end
____exports.EVENT_PLAYER_HERO_REVIVE_START = function() return ConvertPlayerUnitEvent(44) end
____exports.EVENT_PLAYER_HERO_REVIVE_CANCEL = function() return ConvertPlayerUnitEvent(45) end
____exports.EVENT_PLAYER_HERO_REVIVE_FINISH = function() return ConvertPlayerUnitEvent(46) end
____exports.EVENT_PLAYER_UNIT_SUMMON = function() return ConvertPlayerUnitEvent(47) end
____exports.EVENT_PLAYER_UNIT_DROP_ITEM = function() return ConvertPlayerUnitEvent(48) end
____exports.EVENT_PLAYER_UNIT_PICKUP_ITEM = function() return ConvertPlayerUnitEvent(49) end
____exports.EVENT_PLAYER_UNIT_USE_ITEM = function() return ConvertPlayerUnitEvent(50) end
____exports.EVENT_PLAYER_UNIT_LOADED = function() return ConvertPlayerUnitEvent(51) end
____exports.EVENT_UNIT_DAMAGED = function() return ConvertUnitEvent(52) end
____exports.EVENT_UNIT_DEATH = function() return ConvertUnitEvent(53) end
____exports.EVENT_UNIT_DECAY = function() return ConvertUnitEvent(54) end
____exports.EVENT_UNIT_DETECTED = function() return ConvertUnitEvent(55) end
____exports.EVENT_UNIT_HIDDEN = function() return ConvertUnitEvent(56) end
____exports.EVENT_UNIT_SELECTED = function() return ConvertUnitEvent(57) end
____exports.EVENT_UNIT_DESELECTED = function() return ConvertUnitEvent(58) end
____exports.EVENT_UNIT_STATE_LIMIT = function() return ConvertUnitEvent(59) end
____exports.EVENT_UNIT_ACQUIRED_TARGET = function() return ConvertUnitEvent(60) end
____exports.EVENT_UNIT_TARGET_IN_RANGE = function() return ConvertUnitEvent(61) end
____exports.EVENT_UNIT_ATTACKED = function() return ConvertUnitEvent(62) end
____exports.EVENT_UNIT_RESCUED = function() return ConvertUnitEvent(63) end
____exports.EVENT_UNIT_CONSTRUCT_CANCEL = function() return ConvertUnitEvent(64) end
____exports.EVENT_UNIT_CONSTRUCT_FINISH = function() return ConvertUnitEvent(65) end
____exports.EVENT_UNIT_UPGRADE_START = function() return ConvertUnitEvent(66) end
____exports.EVENT_UNIT_UPGRADE_CANCEL = function() return ConvertUnitEvent(67) end
____exports.EVENT_UNIT_UPGRADE_FINISH = function() return ConvertUnitEvent(68) end
____exports.EVENT_UNIT_TRAIN_START = function() return ConvertUnitEvent(69) end
____exports.EVENT_UNIT_TRAIN_CANCEL = function() return ConvertUnitEvent(70) end
____exports.EVENT_UNIT_TRAIN_FINISH = function() return ConvertUnitEvent(71) end
____exports.EVENT_UNIT_RESEARCH_START = function() return ConvertUnitEvent(72) end
____exports.EVENT_UNIT_RESEARCH_CANCEL = function() return ConvertUnitEvent(73) end
____exports.EVENT_UNIT_RESEARCH_FINISH = function() return ConvertUnitEvent(74) end
____exports.EVENT_UNIT_ISSUED_ORDER = function() return ConvertUnitEvent(75) end
____exports.EVENT_UNIT_ISSUED_POINT_ORDER = function() return ConvertUnitEvent(76) end
____exports.EVENT_UNIT_ISSUED_TARGET_ORDER = function() return ConvertUnitEvent(77) end
____exports.EVENT_UNIT_HERO_LEVEL = function() return ConvertUnitEvent(78) end
____exports.EVENT_UNIT_HERO_SKILL = function() return ConvertUnitEvent(79) end
____exports.EVENT_UNIT_HERO_REVIVABLE = function() return ConvertUnitEvent(80) end
____exports.EVENT_UNIT_HERO_REVIVE_START = function() return ConvertUnitEvent(81) end
____exports.EVENT_UNIT_HERO_REVIVE_CANCEL = function() return ConvertUnitEvent(82) end
____exports.EVENT_UNIT_HERO_REVIVE_FINISH = function() return ConvertUnitEvent(83) end
____exports.EVENT_UNIT_SUMMON = function() return ConvertUnitEvent(84) end
____exports.EVENT_UNIT_DROP_ITEM = function() return ConvertUnitEvent(85) end
____exports.EVENT_UNIT_PICKUP_ITEM = function() return ConvertUnitEvent(86) end
____exports.EVENT_UNIT_USE_ITEM = function() return ConvertUnitEvent(87) end
____exports.EVENT_UNIT_LOADED = function() return ConvertUnitEvent(88) end
____exports.EVENT_WIDGET_DEATH = function() return ConvertWidgetEvent(89) end
____exports.EVENT_DIALOG_BUTTON_CLICK = function() return ConvertDialogEvent(90) end
____exports.EVENT_DIALOG_CLICK = function() return ConvertDialogEvent(91) end
____exports.EVENT_GAME_LOADED = function() return ConvertGameEvent(256) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_SOON = function() return ConvertGameEvent(257) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_NOW = function() return ConvertGameEvent(258) end
____exports.EVENT_GAME_SAVE = function() return ConvertGameEvent(259) end
____exports.EVENT_PLAYER_ARROW_LEFT_DOWN = function() return ConvertPlayerEvent(261) end
____exports.EVENT_PLAYER_ARROW_LEFT_UP = function() return ConvertPlayerEvent(262) end
____exports.EVENT_PLAYER_ARROW_RIGHT_DOWN = function() return ConvertPlayerEvent(263) end
____exports.EVENT_PLAYER_ARROW_RIGHT_UP = function() return ConvertPlayerEvent(264) end
____exports.EVENT_PLAYER_ARROW_DOWN_DOWN = function() return ConvertPlayerEvent(265) end
____exports.EVENT_PLAYER_ARROW_DOWN_UP = function() return ConvertPlayerEvent(266) end
____exports.EVENT_PLAYER_ARROW_UP_DOWN = function() return ConvertPlayerEvent(267) end
____exports.EVENT_PLAYER_ARROW_UP_UP = function() return ConvertPlayerEvent(268) end
____exports.EVENT_PLAYER_UNIT_SELL = function() return ConvertPlayerUnitEvent(269) end
____exports.EVENT_PLAYER_UNIT_CHANGE_OWNER = function() return ConvertPlayerUnitEvent(270) end
____exports.EVENT_PLAYER_UNIT_SELL_ITEM = function() return ConvertPlayerUnitEvent(271) end
____exports.EVENT_PLAYER_UNIT_SPELL_CHANNEL = function() return ConvertPlayerUnitEvent(272) end
____exports.EVENT_PLAYER_UNIT_SPELL_CAST = function() return ConvertPlayerUnitEvent(273) end
____exports.EVENT_PLAYER_UNIT_SPELL_EFFECT = function() return ConvertPlayerUnitEvent(274) end
____exports.EVENT_PLAYER_UNIT_SPELL_FINISH = function() return ConvertPlayerUnitEvent(275) end
____exports.EVENT_PLAYER_UNIT_SPELL_ENDCAST = function() return ConvertPlayerUnitEvent(276) end
____exports.EVENT_PLAYER_UNIT_PAWN_ITEM = function() return ConvertPlayerUnitEvent(277) end
____exports.EVENT_UNIT_SELL = function() return ConvertUnitEvent(286) end
____exports.EVENT_UNIT_CHANGE_OWNER = function() return ConvertUnitEvent(287) end
____exports.EVENT_UNIT_SELL_ITEM = function() return ConvertUnitEvent(288) end
____exports.EVENT_UNIT_SPELL_CHANNEL = function() return ConvertUnitEvent(289) end
____exports.EVENT_UNIT_SPELL_CAST = function() return ConvertUnitEvent(290) end
____exports.EVENT_UNIT_SPELL_EFFECT = function() return ConvertUnitEvent(291) end
____exports.EVENT_UNIT_SPELL_FINISH = function() return ConvertUnitEvent(292) end
____exports.EVENT_UNIT_SPELL_ENDCAST = function() return ConvertUnitEvent(293) end
____exports.EVENT_UNIT_PAWN_ITEM = function() return ConvertUnitEvent(294) end
____exports.LESS_THAN = function() return ConvertLimitOp(0) end
____exports.LESS_THAN_OR_EQUAL = function() return ConvertLimitOp(1) end
____exports.EQUAL = function() return ConvertLimitOp(2) end
____exports.GREATER_THAN_OR_EQUAL = function() return ConvertLimitOp(3) end
____exports.GREATER_THAN = function() return ConvertLimitOp(4) end
____exports.NOT_EQUAL = function() return ConvertLimitOp(5) end
____exports.UNIT_TYPE_HERO = function() return ConvertUnitType(0) end
____exports.UNIT_TYPE_DEAD = function() return ConvertUnitType(1) end
____exports.UNIT_TYPE_STRUCTURE = function() return ConvertUnitType(2) end
____exports.UNIT_TYPE_FLYING = function() return ConvertUnitType(3) end
____exports.UNIT_TYPE_GROUND = function() return ConvertUnitType(4) end
____exports.UNIT_TYPE_ATTACKS_FLYING = function() return ConvertUnitType(5) end
____exports.UNIT_TYPE_ATTACKS_GROUND = function() return ConvertUnitType(6) end
____exports.UNIT_TYPE_MELEE_ATTACKER = function() return ConvertUnitType(7) end
____exports.UNIT_TYPE_RANGED_ATTACKER = function() return ConvertUnitType(8) end
____exports.UNIT_TYPE_GIANT = function() return ConvertUnitType(9) end
____exports.UNIT_TYPE_SUMMONED = function() return ConvertUnitType(10) end
____exports.UNIT_TYPE_STUNNED = function() return ConvertUnitType(11) end
____exports.UNIT_TYPE_PLAGUED = function() return ConvertUnitType(12) end
____exports.UNIT_TYPE_SNARED = function() return ConvertUnitType(13) end
____exports.UNIT_TYPE_UNDEAD = function() return ConvertUnitType(14) end
____exports.UNIT_TYPE_MECHANICAL = function() return ConvertUnitType(15) end
____exports.UNIT_TYPE_PEON = function() return ConvertUnitType(16) end
____exports.UNIT_TYPE_SAPPER = function() return ConvertUnitType(17) end
____exports.UNIT_TYPE_TOWNHALL = function() return ConvertUnitType(18) end
____exports.UNIT_TYPE_ANCIENT = function() return ConvertUnitType(19) end
____exports.UNIT_TYPE_TAUREN = function() return ConvertUnitType(20) end
____exports.UNIT_TYPE_POISONED = function() return ConvertUnitType(21) end
____exports.UNIT_TYPE_POLYMORPHED = function() return ConvertUnitType(22) end
____exports.UNIT_TYPE_SLEEPING = function() return ConvertUnitType(23) end
____exports.UNIT_TYPE_RESISTANT = function() return ConvertUnitType(24) end
____exports.UNIT_TYPE_ETHEREAL = function() return ConvertUnitType(25) end
____exports.UNIT_TYPE_MAGIC_IMMUNE = function() return ConvertUnitType(26) end
____exports.ITEM_TYPE_PERMANENT = function() return ConvertItemType(0) end
____exports.ITEM_TYPE_CHARGED = function() return ConvertItemType(1) end
____exports.ITEM_TYPE_POWERUP = function() return ConvertItemType(2) end
____exports.ITEM_TYPE_ARTIFACT = function() return ConvertItemType(3) end
____exports.ITEM_TYPE_PURCHASABLE = function() return ConvertItemType(4) end
____exports.ITEM_TYPE_CAMPAIGN = function() return ConvertItemType(5) end
____exports.ITEM_TYPE_MISCELLANEOUS = function() return ConvertItemType(6) end
____exports.ITEM_TYPE_UNKNOWN = function() return ConvertItemType(7) end
____exports.ITEM_TYPE_ANY = function() return ConvertItemType(8) end
____exports.ITEM_TYPE_TOME = function() return ConvertItemType(2) end
____exports.CAMERA_FIELD_TARGET_DISTANCE = function() return ConvertCameraField(0) end
____exports.CAMERA_FIELD_FARZ = function() return ConvertCameraField(1) end
____exports.CAMERA_FIELD_ANGLE_OF_ATTACK = function() return ConvertCameraField(2) end
____exports.CAMERA_FIELD_FIELD_OF_VIEW = function() return ConvertCameraField(3) end
____exports.CAMERA_FIELD_ROLL = function() return ConvertCameraField(4) end
____exports.CAMERA_FIELD_ROTATION = function() return ConvertCameraField(5) end
____exports.CAMERA_FIELD_ZOFFSET = function() return ConvertCameraField(6) end
____exports.BLEND_MODE_NONE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_DONT_CARE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_KEYALPHA = function() return ConvertBlendMode(1) end
____exports.BLEND_MODE_BLEND = function() return ConvertBlendMode(2) end
____exports.BLEND_MODE_ADDITIVE = function() return ConvertBlendMode(3) end
____exports.BLEND_MODE_MODULATE = function() return ConvertBlendMode(4) end
____exports.BLEND_MODE_MODULATE_2X = function() return ConvertBlendMode(5) end
____exports.RARITY_FREQUENT = function() return ConvertRarityControl(0) end
____exports.RARITY_RARE = function() return ConvertRarityControl(1) end
____exports.TEXMAP_FLAG_NONE = function() return ConvertTexMapFlags(0) end
____exports.TEXMAP_FLAG_WRAP_U = function() return ConvertTexMapFlags(1) end
____exports.TEXMAP_FLAG_WRAP_V = function() return ConvertTexMapFlags(2) end
____exports.TEXMAP_FLAG_WRAP_UV = function() return ConvertTexMapFlags(3) end
____exports.FOG_OF_WAR_MASKED = function() return ConvertFogState(1) end
____exports.FOG_OF_WAR_FOGGED = function() return ConvertFogState(2) end
____exports.FOG_OF_WAR_VISIBLE = function() return ConvertFogState(4) end
____exports.CAMERA_MARGIN_LEFT = 0
____exports.CAMERA_MARGIN_RIGHT = 1
____exports.CAMERA_MARGIN_TOP = 2
____exports.CAMERA_MARGIN_BOTTOM = 3
____exports.EFFECT_TYPE_EFFECT = function() return ConvertEffectType(0) end
____exports.EFFECT_TYPE_TARGET = function() return ConvertEffectType(1) end
____exports.EFFECT_TYPE_CASTER = function() return ConvertEffectType(2) end
____exports.EFFECT_TYPE_SPECIAL = function() return ConvertEffectType(3) end
____exports.EFFECT_TYPE_AREA_EFFECT = function() return ConvertEffectType(4) end
____exports.EFFECT_TYPE_MISSILE = function() return ConvertEffectType(5) end
____exports.EFFECT_TYPE_LIGHTNING = function() return ConvertEffectType(6) end
____exports.SOUND_TYPE_EFFECT = function() return ConvertSoundType(0) end
____exports.SOUND_TYPE_EFFECT_LOOPED = function() return ConvertSoundType(1) end
____exports.EVENT_DAMAGE_DATA_VAILD = 0
____exports.EVENT_DAMAGE_DATA_IS_PHYSICAL = 1
____exports.EVENT_DAMAGE_DATA_IS_ATTACK = 2
____exports.EVENT_DAMAGE_DATA_IS_RANGED = 3
____exports.EVENT_DAMAGE_DATA_DAMAGE_TYPE = 4
____exports.EVENT_DAMAGE_DATA_WEAPON_TYPE = 5
____exports.EVENT_DAMAGE_DATA_ATTACK_TYPE = 6
____exports.MOVE_TYPE_NONE = 0
____exports.MOVE_TYPE_NOT = 1
____exports.MOVE_TYPE_FOOT = 2
____exports.MOVE_TYPE_FLY = 4
____exports.MOVE_TYPE_MINE = 8
____exports.MOVE_TYPE_WIND = 16
____exports.MOVE_TYPE_UN = 32
____exports.MOVE_TYPE_FLOAT = 64
____exports.MOVE_TYPE_AMPH = 128
____exports.COLLISION_TYPE_UNIT = 1
____exports.COLLISION_TYPE_BUILDING = 3
____exports.FRAME_ALIGN_LEFT_TOP = 0
____exports.FRAME_ALIGN_TOP = 1
____exports.FRAME_ALIGN_RIGHT_TOP = 2
____exports.FRAME_ALIGN_LEFT = 3
____exports.FRAME_ALIGN_CENTER = 4
____exports.FRAME_ALIGN_RIGHT = 5
____exports.FRAME_ALIGN_LEFT_BOTTOM = 6
____exports.FRAME_ALIGN_BOTTOM = 7
____exports.FRAME_ALIGN_RIGHT_BOTTOM = 8
____exports.MOUSE_ORDER_CLICK = 1
____exports.MOUSE_ORDER_ENTER = 2
____exports.MOUSE_ORDER_LEAVE = 3
____exports.MOUSE_ORDER_RELEASE = 4
____exports.MOUSE_ORDER_SCROLL = 6
____exports.MOUSE_ORDER_DOUBLE_CLICK = 12
____exports.GAME_KEY_MOUSE_LEFT = 1
____exports.GAME_KEY_MOUSE_RIGHT = 2
____exports.GAME_KEY_A = 65
____exports.GAME_KEY_B = 66
____exports.GAME_KEY_C = 67
____exports.GAME_KEY_D = 68
____exports.GAME_KEY_E = 69
____exports.GAME_KEY_F = 70
____exports.GAME_KEY_G = 71
____exports.GAME_KEY_H = 72
____exports.GAME_KEY_I = 73
____exports.GAME_KEY_J = 74
____exports.GAME_KEY_K = 75
____exports.GAME_KEY_L = 76
____exports.GAME_KEY_M = 77
____exports.GAME_KEY_N = 78
____exports.GAME_KEY_O = 79
____exports.GAME_KEY_P = 80
____exports.GAME_KEY_Q = 81
____exports.GAME_KEY_R = 82
____exports.GAME_KEY_S = 83
____exports.GAME_KEY_T = 84
____exports.GAME_KEY_U = 85
____exports.GAME_KEY_V = 86
____exports.GAME_KEY_W = 87
____exports.GAME_KEY_X = 88
____exports.GAME_KEY_Y = 89
____exports.GAME_KEY_Z = 90
____exports.GAME_KEY_0 = 48
____exports.GAME_KEY_1 = 49
____exports.GAME_KEY_2 = 50
____exports.GAME_KEY_3 = 51
____exports.GAME_KEY_4 = 52
____exports.GAME_KEY_5 = 53
____exports.GAME_KEY_6 = 53
____exports.GAME_KEY_7 = 55
____exports.GAME_KEY_8 = 56
____exports.GAME_KEY_9 = 57
____exports.GAME_KEY_TAB = 9
____exports.GAME_KEY_SPACE = 32
____exports.GAME_KEY_ENTER = 513
____exports.GAME_KEY_BACKSPACE = 514
____exports.GAME_KEY_SHIFT = 0
____exports.GAME_KEY_RIGHT = 516
____exports.GAME_KEY_UP = 517
____exports.GAME_KEY_LEFT = 518
____exports.GAME_KEY_DOWN = 519
____exports.GAME_KEY_ACTION_PRESS = 1
____exports.GAME_KEY_ACTION_RELEASE = 0
____exports.TEXT_ALIGN_LEFT_TOP = 11
____exports.TEXT_ALIGN_TOP = 17
____exports.TEXT_ALIGN_RIGHT_TOP = 37
____exports.TEXT_ALIGN_CENTER = 18
____exports.TEXT_ALIGN_LEFT = 10
____exports.TEXT_ALIGN_RIGHT = 34
____exports.TEXT_ALIGN_LEFT_BOTTOM = 12
____exports.TEXT_ALIGN_BOTTOM = 20
____exports.TEXT_ALIGN_RIGHT_BOTTOM = 36
return ____exports
 end,
["lua_modules.wc3ts-1.27a.globals.order"] = function(...) 
local ____exports = {}
return ____exports
 end,
["lua_modules.wc3ts-1.27a.globals.index"] = function(...) 
local ____exports = {}
local ____player = require("lua_modules.wc3ts-1.27a.handles.player")
local MapPlayer = ____player.MapPlayer
local ____define = require("lua_modules.wc3ts-1.27a.globals.define")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
do
    local ____export = require("lua_modules.wc3ts-1.27a.globals.order")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
____exports.Players = {}
do
    local i = 0
    while i < bj_MAX_PLAYER_SLOTS do
        local pl = MapPlayer:fromHandle(Player(i))
        if pl then
            ____exports.Players[i + 1] = pl
        end
        i = i + 1
    end
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.camera"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectDefineProperty = ____lualib.__TS__ObjectDefineProperty
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____point = require("lua_modules.wc3ts-1.27a.handles.point")
local Point = ____point.Point
____exports.Camera = __TS__Class()
local Camera = ____exports.Camera
Camera.name = "Camera"
function Camera.prototype.____constructor(self)
end
function Camera.adjustField(self, whichField, offset, duration)
    AdjustCameraField(whichField, offset, duration)
end
function Camera.endCinematicScene(self)
    EndCinematicScene()
end
function Camera.forceCinematicSubtitles(self, flag)
    ForceCinematicSubtitles(flag)
end
function Camera.getField(self, field)
    return GetCameraField(field)
end
function Camera.getMargin(self, whichMargin)
    return GetCameraMargin(whichMargin)
end
function Camera.pan(self, x, y, zOffsetDest)
    if zOffsetDest == nil then
        PanCameraTo(x, y)
    else
        PanCameraToWithZ(x, y, zOffsetDest)
    end
end
function Camera.panTimed(self, x, y, duration, zOffsetDest)
    if zOffsetDest == nil then
        PanCameraToTimed(x, y, duration)
    else
        PanCameraToTimedWithZ(x, y, zOffsetDest, duration)
    end
end
function Camera.reset(self, duration)
    ResetToGameCamera(duration)
end
function Camera.setBounds(self, x1, y1, x2, y2, x3, y3, x4, y4)
    SetCameraBounds(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        x4,
        y4
    )
end
function Camera.setCameraOrientController(self, whichUnit, xOffset, yOffset)
    SetCameraOrientController(whichUnit, xOffset, yOffset)
end
function Camera.setCineFilterBlendMode(self, whichMode)
    SetCineFilterBlendMode(whichMode)
end
function Camera.setCineFilterDuration(self, duration)
    SetCineFilterDuration(duration)
end
function Camera.setCineFilterEndColor(self, red, green, blue, alpha)
    SetCineFilterEndColor(red, green, blue, alpha)
end
function Camera.setCineFilterEndUV(self, minU, minV, maxU, maxV)
    SetCineFilterEndUV(minU, minV, maxU, maxV)
end
function Camera.setCineFilterStartColor(self, red, green, blue, alpha)
    SetCineFilterStartColor(red, green, blue, alpha)
end
function Camera.setCineFilterStartUV(self, minU, minV, maxU, maxV)
    SetCineFilterStartUV(minU, minV, maxU, maxV)
end
function Camera.setCineFilterTexMapFlags(self, whichFlags)
    SetCineFilterTexMapFlags(whichFlags)
end
function Camera.setCineFilterTexture(self, fileName)
    SetCineFilterTexture(fileName)
end
function Camera.setCinematicCamera(self, cameraModelFile)
    SetCinematicCamera(cameraModelFile)
end
function Camera.SetCinematicScene(self, portraitUnitId, color, speakerTitle, text, sceneDuration, voiceoverDuration)
    SetCinematicScene(
        portraitUnitId,
        color,
        speakerTitle,
        text,
        sceneDuration,
        voiceoverDuration
    )
end
function Camera.setField(self, whichField, value, duration)
    SetCameraField(whichField, value, duration)
end
function Camera.setPos(self, x, y)
    SetCameraPosition(x, y)
end
function Camera.setRotateMode(self, x, y, radiansToSweep, duration)
    SetCameraRotateMode(x, y, radiansToSweep, duration)
end
function Camera.setSmoothingFactor(self, factor)
    CameraSetSmoothingFactor(factor)
end
function Camera.setSourceNoise(self, mag, velocity, vertOnly)
    if vertOnly == nil then
        vertOnly = false
    end
    CameraSetSourceNoiseEx(mag, velocity, vertOnly)
end
function Camera.setTargetController(self, whichUnit, xOffset, yOffset, inheritOrientation)
    SetCameraTargetController(whichUnit, xOffset, yOffset, inheritOrientation)
end
function Camera.setTargetNoise(self, mag, velocity, vertOnly)
    if vertOnly == nil then
        vertOnly = false
    end
    CameraSetTargetNoiseEx(mag, velocity, vertOnly)
end
function Camera.stop(self)
    StopCamera()
end
__TS__ObjectDefineProperty(
    Camera,
    "visible",
    {
        get = function(self)
            return IsCineFilterDisplayed()
        end,
        set = function(self, flag)
            DisplayCineFilter(flag)
        end
    }
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMinX",
    {get = function(self)
        return GetCameraBoundMinX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMinY",
    {get = function(self)
        return GetCameraBoundMinY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMaxX",
    {get = function(self)
        return GetCameraBoundMaxX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMaxY",
    {get = function(self)
        return GetCameraBoundMaxY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetX",
    {get = function(self)
        return GetCameraTargetPositionX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetY",
    {get = function(self)
        return GetCameraTargetPositionY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetZ",
    {get = function(self)
        return GetCameraTargetPositionZ()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeX",
    {get = function(self)
        return GetCameraEyePositionX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeY",
    {get = function(self)
        return GetCameraEyePositionY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeZ",
    {get = function(self)
        return GetCameraEyePositionZ()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyePoint",
    {get = function(self)
        return Point:fromHandle(GetCameraEyePositionLoc())
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetPoint",
    {get = function(self)
        return Point:fromHandle(GetCameraTargetPositionLoc())
    end}
)
____exports.CameraSetup = __TS__Class()
local CameraSetup = ____exports.CameraSetup
CameraSetup.name = "CameraSetup"
__TS__ClassExtends(CameraSetup, Handle)
function CameraSetup.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateCameraSetup()
    if handle == nil then
        error(
            __TS__New(Error, "w3ts failed to create camerasetup handle."),
            0
        )
    end
    Handle.prototype.____constructor(self, handle)
end
function CameraSetup.create(self)
    local handle = CreateCameraSetup()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function CameraSetup.prototype.apply(self, doPan, panTimed)
    CameraSetupApply(self.handle, doPan, panTimed)
end
function CameraSetup.prototype.applyForceDuration(self, doPan, forceDuration)
    CameraSetupApplyForceDuration(self.handle, doPan, forceDuration)
end
function CameraSetup.prototype.applyForceDurationSmooth(self, doPan, forcedDuration, easeInDuration, easeOutDuration, smoothFactor)
end
function CameraSetup.prototype.applyForceDurationZ(self, zDestOffset, forceDuration)
    CameraSetupApplyForceDurationWithZ(self.handle, zDestOffset, forceDuration)
end
function CameraSetup.prototype.applyZ(self, zDestOffset)
    CameraSetupApplyWithZ(self.handle, zDestOffset)
end
function CameraSetup.prototype.getField(self, whichField)
    return CameraSetupGetField(self.handle, whichField)
end
function CameraSetup.prototype.setDestPos(self, x, y, duration)
    CameraSetupSetDestPosition(self.handle, x, y, duration)
end
function CameraSetup.prototype.setField(self, whichField, value, duration)
    CameraSetupSetField(self.handle, whichField, value, duration)
end
function CameraSetup.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destPoint",
    {get = function(self)
        return Point:fromHandle(CameraSetupGetDestPositionLoc(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destX",
    {
        get = function(self)
            return CameraSetupGetDestPositionX(self.handle)
        end,
        set = function(self, x)
            CameraSetupSetDestPosition(self.handle, x, self.destY, 0)
        end
    },
    true
)
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destY",
    {
        get = function(self)
            return CameraSetupGetDestPositionY(self.handle)
        end,
        set = function(self, y)
            CameraSetupSetDestPosition(self.handle, self.destX, y, 0)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.widget"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Widget = __TS__Class()
local Widget = ____exports.Widget
Widget.name = "Widget"
__TS__ClassExtends(Widget, Handle)
function Widget.fromEvent(self)
    return self:fromHandle(GetTriggerWidget())
end
function Widget.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Widget.prototype,
    "life",
    {
        get = function(self)
            return GetWidgetLife(self.handle)
        end,
        set = function(self, value)
            SetWidgetLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Widget.prototype,
    "x",
    {get = function(self)
        return GetWidgetX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Widget.prototype,
    "y",
    {get = function(self)
        return GetWidgetY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.destructable"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("lua_modules.wc3ts-1.27a.handles.widget")
local Widget = ____widget.Widget
____exports.Destructable = __TS__Class()
local Destructable = ____exports.Destructable
Destructable.name = "Destructable"
__TS__ClassExtends(Destructable, Widget)
function Destructable.prototype.____constructor(self, objectId, x, y, z, face, scale, variation)
    if Handle:initFromHandle() then
        Widget.prototype.____constructor(self)
        return
    end
    local handle = CreateDestructableZ(
        objectId,
        x,
        y,
        z,
        face,
        scale,
        variation
    )
    if handle == nil then
        Error(nil, "w3ts failed to create destructable handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Destructable.create(self, objectId, x, y, face, scale, variation, skinId)
    if face == nil then
        face = 0
    end
    if scale == nil then
        scale = 1
    end
    if variation == nil then
        variation = 0
    end
    local handle
    if skinId ~= nil then
        handle = CreateDestructable(
            objectId,
            x,
            y,
            face,
            scale,
            variation
        )
    end
    if handle then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        if skinId ~= nil then
            values.skin = skinId
        end
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Destructable.createZ(self, objectId, x, y, z, face, scale, variation, skinId)
    if face == nil then
        face = 0
    end
    if scale == nil then
        scale = 1
    end
    if variation == nil then
        variation = 0
    end
    local handle
    if skinId ~= nil then
        handle = CreateDestructableZ(
            objectId,
            x,
            y,
            z,
            face,
            scale,
            variation
        )
    end
    if handle then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        if skinId ~= nil then
            values.skin = skinId
        end
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Destructable.prototype.destroy(self)
    RemoveDestructable(self.handle)
end
function Destructable.prototype.heal(self, life, birth)
    DestructableRestoreLife(self.handle, life, birth)
end
function Destructable.prototype.kill(self)
    KillDestructable(self.handle)
end
function Destructable.prototype.queueAnim(self, whichAnimation)
    QueueDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnim(self, whichAnimation)
    SetDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnimSpeed(self, speedFactor)
    SetDestructableAnimationSpeed(self.handle, speedFactor)
end
function Destructable.prototype.show(self, flag)
    ShowDestructable(self.handle, flag)
end
function Destructable.fromEvent(self)
    return self:fromHandle(GetTriggerDestructable())
end
function Destructable.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Destructable.prototype,
    "invulnerable",
    {
        get = function(self)
            return IsDestructableInvulnerable(self.handle)
        end,
        set = function(self, flag)
            SetDestructableInvulnerable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "life",
    {
        get = function(self)
            return GetDestructableLife(self.handle)
        end,
        set = function(self, value)
            SetDestructableLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "maxLife",
    {
        get = function(self)
            return GetDestructableMaxLife(self.handle)
        end,
        set = function(self, value)
            SetDestructableMaxLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "name",
    {get = function(self)
        return GetDestructableName(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "occluderHeight",
    {
        get = function(self)
            return GetDestructableOccluderHeight(self.handle)
        end,
        set = function(self, value)
            SetDestructableOccluderHeight(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "typeId",
    {get = function(self)
        return GetDestructableTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "x",
    {get = function(self)
        return GetDestructableX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "y",
    {get = function(self)
        return GetDestructableY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.dialog"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.DialogButton = __TS__Class()
local DialogButton = ____exports.DialogButton
DialogButton.name = "DialogButton"
__TS__ClassExtends(DialogButton, Handle)
function DialogButton.prototype.____constructor(self, whichDialog, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if quit == false then
        handle = DialogAddButton(whichDialog.handle, text, hotkey)
    else
        handle = DialogAddQuitButton(whichDialog.handle, score, text, hotkey)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create button handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function DialogButton.create(self, whichDialog, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    local handle
    if quit == false then
        handle = DialogAddButton(whichDialog.handle, text, hotkey)
    else
        handle = DialogAddQuitButton(whichDialog.handle, score, text, hotkey)
    end
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function DialogButton.fromEvent(self)
    return self:fromHandle(GetClickedButton())
end
function DialogButton.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
---
-- @example Create a simple dialog.
-- ```ts
-- const dialog = Dialog.create();
-- if (dialog) {
-- const trigger = Trigger.create();
-- 
-- trigger.registerDialogEvent(dialog);
-- trigger.addAction(() => {
-- const clicked = DialogButton.fromEvent();
-- });
-- 
-- Timer.create().start(1.00, false, () => {
-- DialogButton.create(dialog, "Stay", 0);
-- DialogButton.create(dialog, "Leave", 0, true);
-- 
-- dialog.setMessage("Welcome to TypeScript!");
-- dialog.display(Players[0], true);
-- });
-- }
-- ```
____exports.Dialog = __TS__Class()
local Dialog = ____exports.Dialog
Dialog.name = "Dialog"
__TS__ClassExtends(Dialog, Handle)
function Dialog.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = DialogCreate()
    if handle == nil then
        Error(nil, "w3ts failed to create dialog handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Dialog.create(self)
    local handle = DialogCreate()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Dialog.prototype.addButton(self, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    return ____exports.DialogButton:create(
        self,
        text,
        hotkey,
        quit,
        score
    )
end
function Dialog.prototype.clear(self)
    DialogClear(self.handle)
end
function Dialog.prototype.destroy(self)
    DialogDestroy(self.handle)
end
function Dialog.prototype.display(self, whichPlayer, flag)
    DialogDisplay(whichPlayer.handle, self.handle, flag)
end
function Dialog.prototype.setMessage(self, whichMessage)
    DialogSetMessage(self.handle, whichMessage)
end
function Dialog.fromEvent(self)
    return self:fromHandle(GetClickedDialog())
end
function Dialog.fromHandle(self, handle)
    local ____handle_1
    if handle then
        ____handle_1 = self:getObject(handle)
    else
        ____handle_1 = nil
    end
    return ____handle_1
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.effect"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Effect = __TS__Class()
local Effect = ____exports.Effect
Effect.name = "Effect"
__TS__ClassExtends(Effect, Handle)
function Effect.prototype.____constructor(self, modelName, a, b)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if type(a) == "number" and type(b) == "number" then
        handle = AddSpecialEffect(modelName, a, b)
    elseif type(a) ~= "number" and type(b) == "string" then
        handle = AddSpecialEffectTarget(modelName, a.handle, b)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create effect handle.")
    end
    Handle.prototype.____constructor(self, handle)
    if type(a) ~= "number" and type(b) == "string" then
        self.attachWidget = a
        self.attachPointName = b
    end
end
function Effect.create(self, modelName, x, y)
    local handle = AddSpecialEffect(modelName, x, y)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createAttachment(self, modelName, targetWidget, attachPointName)
    local handle = AddSpecialEffectTarget(modelName, targetWidget.handle, attachPointName)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.attachWidget = targetWidget
        values.attachPointName = attachPointName
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createSpell(self, abilityId, effectType, x, y)
    local handle = AddSpellEffectById(abilityId, effectType, x, y)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createSpellAttachment(self, abilityId, effectType, targetWidget, attachPointName)
    local handle = AddSpellEffectTargetById(abilityId, effectType, targetWidget.handle, attachPointName)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.attachWidget = targetWidget
        values.attachPointName = attachPointName
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.prototype.addSubAnimation(self, subAnim)
    BlzSpecialEffectAddSubAnimation(self.handle, subAnim)
end
function Effect.prototype.clearSubAnimations(self)
    BlzSpecialEffectClearSubAnimations(self.handle)
end
function Effect.prototype.destroy(self)
    DestroyEffect(self.handle)
end
function Effect.prototype.playAnimation(self, animType)
    BlzPlaySpecialEffect(self.handle, animType)
end
function Effect.prototype.playWithTimeScale(self, animType, timeScale)
    BlzPlaySpecialEffectWithTimeScale(self.handle, animType, timeScale)
end
function Effect.prototype.removeSubAnimation(self, subAnim)
    BlzSpecialEffectRemoveSubAnimation(self.handle, subAnim)
end
function Effect.prototype.resetScaleMatrix(self)
    EXEffectMatReset(self.handle)
end
function Effect.prototype.setAlpha(self, alpha)
    BlzSetSpecialEffectAlpha(self.handle, alpha)
end
function Effect.prototype.setColor(self, red, green, blue)
    BlzSetSpecialEffectColor(self.handle, red, green, blue)
end
function Effect.prototype.setColorByPlayer(self, whichPlayer)
    BlzSetSpecialEffectColorByPlayer(self.handle, whichPlayer.handle)
end
function Effect.prototype.setHeight(self, height)
    BlzSetSpecialEffectHeight(self.handle, height)
end
function Effect.prototype.setOrientation(self, yaw, pitch, roll)
    BlzSetSpecialEffectOrientation(self.handle, yaw, pitch, roll)
end
function Effect.prototype.setPitch(self, pitch)
    BlzSetSpecialEffectPitch(self.handle, pitch)
end
function Effect.prototype.setPoint(self, p)
    BlzSetSpecialEffectPositionLoc(self.handle, p.handle)
end
function Effect.prototype.setPosition(self, x, y, z)
    BlzSetSpecialEffectPosition(self.handle, x, y, z)
end
function Effect.prototype.setRoll(self, roll)
    BlzSetSpecialEffectRoll(self.handle, roll)
end
function Effect.prototype.setScaleMatrix(self, x, y, z)
    EXEffectMatScale(self.handle, x, y, z)
end
function Effect.prototype.setTime(self, value)
    BlzSetSpecialEffectTime(self.handle, value)
end
function Effect.prototype.setTimeScale(self, timeScale)
    BlzSetSpecialEffectTimeScale(self.handle, timeScale)
end
function Effect.prototype.setYaw(self, y)
    BlzSetSpecialEffectYaw(self.handle, y)
end
function Effect.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Effect.prototype,
    "scale",
    {
        get = function(self)
            return EXGetEffectSize(self.handle)
        end,
        set = function(self, scale)
            EXSetEffectSize(self.handle, scale)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "x",
    {
        get = function(self)
            return EXGetEffectX(self.handle)
        end,
        set = function(self, x)
            EXSetEffectXY(self.handle, x, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "y",
    {
        get = function(self)
            return EXGetEffectY(self.handle)
        end,
        set = function(self, y)
            EXSetEffectXY(self.handle, self.x, y)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "z",
    {
        get = function(self)
            return EXGetEffectZ(self.handle)
        end,
        set = function(self, z)
            EXSetEffectZ(self.handle, z)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.rect"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Rectangle = __TS__Class()
local Rectangle = ____exports.Rectangle
Rectangle.name = "Rectangle"
__TS__ClassExtends(Rectangle, Handle)
function Rectangle.prototype.____constructor(self, minX, minY, maxX, maxY)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Rect(minX, minY, maxX, maxY)
    if handle == nil then
        Error(nil, "w3ts failed to create rect handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Rectangle.create(self, minX, minY, maxX, maxY)
    local handle = Rect(minX, minY, maxX, maxY)
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Rectangle.prototype.destroy(self)
    RemoveRect(self.handle)
end
function Rectangle.prototype.enumDestructables(self, filter, actionFunc)
    EnumDestructablesInRect(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        actionFunc
    )
end
function Rectangle.prototype.enumItems(self, filter, actionFunc)
    EnumItemsInRect(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        actionFunc
    )
end
function Rectangle.prototype.move(self, newCenterX, newCenterY)
    MoveRectTo(self.handle, newCenterX, newCenterY)
end
function Rectangle.prototype.movePoint(self, newCenterPoint)
    MoveRectToLoc(self.handle, newCenterPoint.handle)
end
function Rectangle.prototype.setRect(self, minX, minY, maxX, maxY)
    SetRect(
        self.handle,
        minX,
        minY,
        maxX,
        maxY
    )
end
function Rectangle.prototype.setRectFromPoint(self, min, max)
    SetRectFromLoc(self.handle, min.handle, max.handle)
end
function Rectangle.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Rectangle.fromPoint(self, min, max)
    return self:fromHandle(RectFromLoc(min.handle, max.handle))
end
function Rectangle.getWorldBounds(self)
    return ____exports.Rectangle:fromHandle(GetWorldBounds())
end
__TS__SetDescriptor(
    Rectangle.prototype,
    "centerX",
    {get = function(self)
        return GetRectCenterX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "centerY",
    {get = function(self)
        return GetRectCenterY(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "maxX",
    {get = function(self)
        return GetRectMaxX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "maxY",
    {get = function(self)
        return GetRectMaxY(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "minX",
    {get = function(self)
        return GetRectMinX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "minY",
    {get = function(self)
        return GetRectMinY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.fogmodifier"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.FogModifier = __TS__Class()
local FogModifier = ____exports.FogModifier
FogModifier.name = "FogModifier"
__TS__ClassExtends(FogModifier, Handle)
function FogModifier.prototype.____constructor(self, forWhichPlayer, whichState, centerX, centerY, radius, useSharedVision, afterUnits)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateFogModifierRadius(
        forWhichPlayer.handle,
        whichState,
        centerX,
        centerY,
        radius,
        useSharedVision,
        afterUnits
    )
    if handle == nil then
        Error(nil, "w3ts failed to create fogmodifier handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function FogModifier.create(self, forWhichPlayer, whichState, centerX, centerY, radius, useSharedVision, afterUnits)
    local handle = CreateFogModifierRadius(
        forWhichPlayer.handle,
        whichState,
        centerX,
        centerY,
        radius,
        useSharedVision,
        afterUnits
    )
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function FogModifier.prototype.destroy(self)
    DestroyFogModifier(self.handle)
end
function FogModifier.prototype.start(self)
    FogModifierStart(self.handle)
end
function FogModifier.prototype.stop(self)
    FogModifierStop(self.handle)
end
function FogModifier.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function FogModifier.fromRect(self, forWhichPlayer, whichState, where, useSharedVision, afterUnits)
    return self:fromHandle(CreateFogModifierRect(
        forWhichPlayer.handle,
        whichState,
        where.handle,
        useSharedVision,
        afterUnits
    ))
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.frame"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
--- Warcraft III's UI uses a proprietary format known as FDF (Frame Definition Files).
-- This class provides the ability to manipulate and create them dynamically through code.
-- 
-- @example Create a simple button.
-- ```ts
-- const gameui = Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0);
-- if (gameui) {
-- // Create a "GLUEBUTTON" named "Facebutton", the clickable Button, for game UI
-- const buttonFrame = Frame.createType("FaceButton", gameui, 0, "GLUEBUTTON", "");
-- if (buttonFrame) {
-- // Create a BACKDROP named "FaceButtonIcon", the visible image, for buttonFrame.
-- const buttonIconFrame = Frame.createType("FaceButton", buttonFrame, 0, "BACKDROP", "");
-- // buttonIconFrame will mimic buttonFrame in size and position
-- buttonIconFrame?.setAllPoints(buttonFrame);
-- // Set a Texture
-- buttonIconFrame?.setTexture("ReplaceableTextures\\CommandButtons\\BTNSelectHeroOn", 0, true);
-- // Place the buttonFrame to the center of the screen
-- buttonFrame.setAbsPoint(FRAMEPOINT_CENTER, 0.4, 0.3);
-- // Give that buttonFrame a size
-- buttonFrame.setSize(0.05, 0.05);
-- }
-- }
-- ```
-- 
-- There are many aspects to modifying the UI and it can become complicated, so here are some
-- guides:
-- 
-- https://www.hiveworkshop.com/threads/ui-frames-starting-guide.318603/
-- https://www.hiveworkshop.com/pastebin/913bd439799b3d917e5b522dd9ef458f20598/
-- https://www.hiveworkshop.com/tags/ui-fdf/
____exports.Frame = __TS__Class()
local Frame = ____exports.Frame
Frame.name = "Frame"
__TS__ClassExtends(Frame, Handle)
function Frame.prototype.____constructor(self, name, owner, priority, createContext, typeName, inherits)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if createContext == nil then
        handle = DzCreateSimpleFrame(name, owner.handle, priority)
    elseif typeName ~= nil and inherits ~= nil then
        handle = DzCreateFrameByTagName(
            typeName,
            name,
            owner.handle,
            inherits,
            createContext
        )
    else
        handle = DzCreateFrame(name, owner.handle, priority)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create framehandle handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Frame.create(self, name, owner, priority, createContext)
    local handle = DzCreateFrame(name, owner.handle, priority)
    if handle then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.createSimple(self, name, owner, createContext)
    local handle = DzCreateSimpleFrame(name, owner.handle, createContext)
    if handle then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.createType(self, name, owner, createContext, typeName, inherits)
    local handle = DzCreateFrameByTagName(
        typeName,
        name,
        owner.handle,
        inherits,
        createContext
    )
    if handle then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.prototype.addText(self, text)
    BlzFrameAddText(self.handle, text)
    return self
end
function Frame.prototype.cageMouse(self, enable)
    DzFrameCageMouse(self.handle, enable)
    return self
end
function Frame.prototype.clearPoints(self)
    DzFrameClearAllPoints(self.handle)
    return self
end
function Frame.prototype.click(self)
    DzClickFrame(self.handle)
    return self
end
function Frame.prototype.destroy(self)
    DzDestroyFrame(self.handle)
    return self
end
function Frame.prototype.getChild(self, index)
    return ____exports.Frame:fromHandle(BlzFrameGetChild(self.handle, index))
end
function Frame.prototype.setAbsPoint(self, point, x, y)
    DzFrameSetAbsolutePoint(self.handle, point, x, y)
    return self
end
function Frame.prototype.setAllPoints(self, relative)
    DzFrameSetAllPoints(self.handle, relative.handle)
    return self
end
function Frame.prototype.setAlpha(self, alpha)
    DzFrameSetAlpha(self.handle, alpha)
    return self
end
function Frame.prototype.setEnabled(self, flag)
    DzFrameSetEnable(self.handle, flag)
    return self
end
function Frame.prototype.setFocus(self, flag)
    DzFrameSetFocus(self.handle, flag)
    return self
end
function Frame.prototype.setFont(self, filename, height, flags)
    DzFrameSetFont(self.handle, filename, height, flags)
    return self
end
function Frame.prototype.setHeight(self, height)
    DzFrameSetSize(self.handle, self.width, height)
    return self
end
function Frame.prototype.setLevel(self, level)
    BlzFrameSetLevel(self.handle, level)
    return self
end
function Frame.prototype.setMinMaxValue(self, minValue, maxValue)
    DzFrameSetMinMaxValue(self.handle, minValue, maxValue)
    return self
end
function Frame.prototype.setTextAlignment(self, vert, horz)
    DzFrameSetTextAlignment(self.handle, vert)
    return self
end
function Frame.prototype.setModel(self, modelFile, cameraIndex)
    DzFrameSetModel(self.handle, modelFile, cameraIndex, 0)
    return self
end
function Frame.prototype.getParent(self)
    return ____exports.Frame:fromHandle(DzFrameGetParent(self.handle))
end
function Frame.prototype.setParent(self, parent)
    DzFrameSetParent(self.handle, parent.handle)
    return self
end
function Frame.prototype.setPoint(self, point, relative, relativePoint, x, y)
    DzFrameSetPoint(
        self.handle,
        point,
        relative.handle,
        relativePoint,
        x,
        y
    )
    return self
end
function Frame.prototype.setScale(self, scale)
    DzFrameSetScale(self.handle, scale)
    return self
end
function Frame.prototype.setSize(self, width, height)
    DzFrameSetSize(self.handle, width, height)
    return self
end
function Frame.prototype.setSpriteAnimate(self, primaryProp, flags)
    BlzFrameSetSpriteAnimate(self.handle, primaryProp, flags)
    return self
end
function Frame.prototype.setStepSize(self, stepSize)
    DzFrameSetStepSize(self.handle, stepSize)
    return self
end
function Frame.prototype.setText(self, text)
    DzFrameSetText(self.handle, text)
    return self
end
function Frame.prototype.setTextColor(self, color)
    BlzFrameSetTextColor(self.handle, color)
    return self
end
function Frame.prototype.setTextSizeLimit(self, size)
    DzFrameSetTextSizeLimit(self.handle, size)
    return self
end
function Frame.prototype.setTexture(self, texFile, flag, blend)
    DzFrameSetTexture(self.handle, texFile, flag)
    return self
end
function Frame.prototype.setTooltip(self, tooltip)
    BlzFrameSetTooltip(self.handle, tooltip.handle)
    return self
end
function Frame.prototype.setValue(self, value)
    DzFrameSetValue(self.handle, value)
    return self
end
function Frame.prototype.setVertexColor(self, color)
    DzFrameSetVertexColor(self.handle, color)
    return self
end
function Frame.prototype.setVisible(self, flag)
    DzFrameShow(self.handle, flag)
    return self
end
function Frame.prototype.setWidth(self, width)
    DzFrameSetSize(self.handle, width, self.height)
    return self
end
function Frame.autoPosition(self, enable)
    BlzEnableUIAutoPosition(enable)
end
function Frame.fromEvent(self)
    return self:fromHandle(BlzGetTriggerFrame())
end
function Frame.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Frame.fromName(self, name, createContext)
    return self:fromHandle(DzFrameFindByName(name, createContext))
end
function Frame.fromOrigin(self, frameType, index)
    return self:fromHandle(BlzGetOriginFrame(frameType, index))
end
function Frame.getEventHandle(self)
    return BlzGetTriggerFrameEvent()
end
function Frame.getEventText(self)
    return BlzGetTriggerFrameValue()
end
function Frame.getEventValue(self)
    return BlzGetTriggerFrameValue()
end
function Frame.hideOrigin(self, enable)
    BlzHideOriginFrames(enable)
end
function Frame.loadTOC(self, filename)
    return DzLoadToc(filename)
end
__TS__SetDescriptor(
    Frame.prototype,
    "alpha",
    {
        get = function(self)
            return DzFrameGetAlpha(self.handle)
        end,
        set = function(self, alpha)
            DzFrameSetAlpha(self.handle, alpha)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "children",
    {get = function(self)
        local count = self.childrenCount
        local output = {}
        do
            local i = 0
            while i < count do
                local child = self:getChild(i)
                if child then
                    output[#output + 1] = child
                end
                i = i + 1
            end
        end
        return output
    end},
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "childrenCount",
    {get = function(self)
        return BlzFrameGetChildrenCount(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "enabled",
    {
        get = function(self)
            return DzFrameGetEnable(self.handle)
        end,
        set = function(self, flag)
            DzFrameSetEnable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "height",
    {
        get = function(self)
            return DzFrameGetHeight(self.handle)
        end,
        set = function(self, height)
            DzFrameSetSize(self.handle, self.width, height)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "parent",
    {
        get = function(self)
            return ____exports.Frame:fromHandle(DzFrameGetParent(self.handle))
        end,
        set = function(self, parent)
            DzFrameSetParent(self.handle, parent.handle)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "text",
    {
        get = function(self)
            return DzFrameGetText(self.handle) or ""
        end,
        set = function(self, text)
            DzFrameSetText(self.handle, text)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "textSizeLimit",
    {
        get = function(self)
            return DzFrameGetTextSizeLimit(self.handle)
        end,
        set = function(self, size)
            DzFrameSetTextSizeLimit(self.handle, size)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "value",
    {
        get = function(self)
            return DzFrameGetValue(self.handle)
        end,
        set = function(self, value)
            DzFrameSetValue(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "visible",
    {
        get = function(self)
            return BlzFrameIsVisible(self.handle)
        end,
        set = function(self, flag)
            DzFrameShow(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "width",
    {
        get = function(self)
            return BlzFrameGetWidth(self.handle)
        end,
        set = function(self, width)
            DzFrameSetSize(self.handle, width, self.height)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.gamecache"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.GameCache = __TS__Class()
local GameCache = ____exports.GameCache
GameCache.name = "GameCache"
__TS__ClassExtends(GameCache, Handle)
function GameCache.prototype.____constructor(self, campaignFile)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = InitGameCache(campaignFile)
    if handle == nil then
        Error(nil, "w3ts failed to create gamecache handle.")
    end
    Handle.prototype.____constructor(self, handle)
    self.filename = campaignFile
end
function GameCache.create(self, campaignFile)
    local handle = InitGameCache(campaignFile)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.filename = campaignFile
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function GameCache.prototype.flush(self)
    FlushGameCache(self.handle)
end
function GameCache.prototype.flushBoolean(self, missionKey, key)
    FlushStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.flushInteger(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushMission(self, missionKey)
    FlushStoredMission(self.handle, missionKey)
end
function GameCache.prototype.flushNumber(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushString(self, missionKey, key)
    FlushStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.flushUnit(self, missionKey, key)
    FlushStoredUnit(self.handle, missionKey, key)
end
function GameCache.prototype.getBoolean(self, missionKey, key)
    return GetStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.getInteger(self, missionKey, key)
    return GetStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.getNumber(self, missionKey, key)
    return GetStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.getString(self, missionKey, key)
    return GetStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.hasBoolean(self, missionKey, key)
    return HaveStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.hasInteger(self, missionKey, key)
    return HaveStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.hasNumber(self, missionKey, key)
    return HaveStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.hasString(self, missionKey, key)
    return HaveStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.restoreUnit(self, missionKey, key, forWhichPlayer, x, y, face)
    return RestoreUnit(
        self.handle,
        missionKey,
        key,
        forWhichPlayer.handle,
        x,
        y,
        face
    )
end
function GameCache.prototype.save(self)
    return SaveGameCache(self.handle)
end
function GameCache.prototype.store(self, missionKey, key, value)
    if type(value) == "string" then
        StoreString(self.handle, missionKey, key, value)
    elseif type(value) == "boolean" then
        StoreBoolean(self.handle, missionKey, key, value)
    elseif type(value) == "number" then
        StoreReal(self.handle, missionKey, key, value)
    else
        StoreUnit(self.handle, missionKey, key, value)
    end
end
function GameCache.prototype.syncBoolean(self, missionKey, key)
    return SyncStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.syncInteger(self, missionKey, key)
    return SyncStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.syncNumber(self, missionKey, key)
    return SyncStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.syncString(self, missionKey, key)
    return SyncStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.syncUnit(self, missionKey, key)
    return SyncStoredUnit(self.handle, missionKey, key)
end
function GameCache.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function GameCache.reloadFromDisk(self)
    return ReloadGameCachesFromDisk()
end
local function ____error(arg0, arg1)
    error(
        __TS__New(Error, "Function not implemented."),
        0
    )
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.item"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__StringSubstr = ____lualib.__TS__StringSubstr
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("lua_modules.wc3ts-1.27a.handles.widget")
local Widget = ____widget.Widget
____exports.Item = __TS__Class()
local Item = ____exports.Item
Item.name = "Item"
__TS__ClassExtends(Item, Widget)
function Item.prototype.____constructor(self, itemId, x, y)
    if Handle:initFromHandle() then
        Widget.prototype.____constructor(self)
        return
    end
    local handle = CreateItem(itemId, x, y)
    if handle == nil then
        Error(nil, "w3ts failed to create item handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Item.create(self, itemId, x, y)
    local handle = CreateItem(itemId, x, y)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Item.prototype.addAbility(self, abilCode)
    BlzItemAddAbility(self.handle, abilCode)
end
function Item.prototype.getAbility(self, abilCode)
    return BlzGetItemAbility(self.handle, abilCode)
end
function Item.prototype.getAbilityByIndex(self, index)
    return BlzGetItemAbilityByIndex(self.handle, index)
end
function Item.prototype.removeAbility(self, abilCode)
    BlzItemRemoveAbility(self.handle, abilCode)
end
function Item.prototype.destroy(self)
    RemoveItem(self.handle)
end
function Item.prototype.getField(self, field)
    local fieldType = __TS__StringSubstr(
        tostring(field),
        0,
        (string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1
    )
    repeat
        local ____switch13 = fieldType
        local ____cond13 = ____switch13 == "unitbooleanfield"
        if ____cond13 then
            return BlzGetItemBooleanField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitintegerfield"
        if ____cond13 then
            return BlzGetItemIntegerField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitrealfield"
        if ____cond13 then
            return BlzGetItemRealField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitstringfield"
        if ____cond13 then
            return BlzGetItemStringField(self.handle, field)
        end
        do
            return 0
        end
    until true
end
function Item.prototype.isOwned(self)
    return IsItemOwned(self.handle)
end
function Item.prototype.isPawnable(self)
    return IsItemPawnable(self.handle)
end
function Item.prototype.isPowerup(self)
    return IsItemPowerup(self.handle)
end
function Item.prototype.isSellable(self)
    return IsItemSellable(self.handle)
end
function Item.prototype.setDropId(self, unitId)
    SetItemDropID(self.handle, unitId)
end
function Item.prototype.setDropOnDeath(self, flag)
    SetItemDropOnDeath(self.handle, flag)
end
function Item.prototype.setDroppable(self, flag)
    SetItemDroppable(self.handle, flag)
end
function Item.prototype.setField(self, field, value)
    local fieldType = __TS__StringSubstr(
        tostring(field),
        0,
        (string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1
    )
    if fieldType == "unitbooleanfield" and type(value) == "boolean" then
        return BlzSetItemBooleanField(self.handle, field, value)
    end
    if fieldType == "unitintegerfield" and type(value) == "number" then
        return BlzSetItemIntegerField(self.handle, field, value)
    end
    if fieldType == "unitrealfield" and type(value) == "number" then
        return BlzSetItemRealField(self.handle, field, value)
    end
    if fieldType == "unitstringfield" and type(value) == "string" then
        return BlzSetItemStringField(self.handle, field, value)
    end
    return false
end
function Item.prototype.setOwner(self, whichPlayer, changeColor)
    SetItemPlayer(self.handle, whichPlayer.handle, changeColor)
end
function Item.prototype.setPoint(self, whichPoint)
    SetItemPosition(self.handle, whichPoint.x, whichPoint.y)
end
function Item.prototype.setPosition(self, x, y)
    SetItemPosition(self.handle, x, y)
end
function Item.fromEvent(self)
    return self:fromHandle(GetManipulatedItem())
end
function Item.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Item.isIdPawnable(self, itemId)
    return IsItemIdPawnable(itemId)
end
function Item.isIdPowerup(self, itemId)
    return IsItemIdPowerup(itemId)
end
function Item.isIdSellable(self, itemId)
    return IsItemIdSellable(itemId)
end
__TS__SetDescriptor(
    Item.prototype,
    "charges",
    {
        get = function(self)
            return GetItemCharges(self.handle)
        end,
        set = function(self, value)
            SetItemCharges(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "invulnerable",
    {
        get = function(self)
            return IsItemInvulnerable(self.handle)
        end,
        set = function(self, flag)
            SetItemInvulnerable(self.handle, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "level",
    {get = function(self)
        return GetItemLevel(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "extendedTooltip",
    {
        get = function(self)
            local ____BlzGetItemExtendedTooltip_result_1 = BlzGetItemExtendedTooltip(self.handle)
            if ____BlzGetItemExtendedTooltip_result_1 == nil then
                ____BlzGetItemExtendedTooltip_result_1 = ""
            end
            return ____BlzGetItemExtendedTooltip_result_1
        end,
        set = function(self, tooltip)
            BlzSetItemExtendedTooltip(self.handle, tooltip)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "icon",
    {
        get = function(self)
            local ____BlzGetItemIconPath_result_2 = BlzGetItemIconPath(self.handle)
            if ____BlzGetItemIconPath_result_2 == nil then
                ____BlzGetItemIconPath_result_2 = ""
            end
            return ____BlzGetItemIconPath_result_2
        end,
        set = function(self, path)
            BlzSetItemIconPath(self.handle, path)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "name",
    {
        get = function(self)
            return GetItemName(self.handle) or ""
        end,
        set = function(self, value)
            BlzSetItemName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "tooltip",
    {
        get = function(self)
            local ____BlzGetItemTooltip_result_3 = BlzGetItemTooltip(self.handle)
            if ____BlzGetItemTooltip_result_3 == nil then
                ____BlzGetItemTooltip_result_3 = ""
            end
            return ____BlzGetItemTooltip_result_3
        end,
        set = function(self, tooltip)
            BlzSetItemTooltip(self.handle, tooltip)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "pawnable",
    {
        get = function(self)
            return IsItemPawnable(self.handle)
        end,
        set = function(self, flag)
            SetItemPawnable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "player",
    {get = function(self)
        return GetItemPlayer(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "type",
    {get = function(self)
        return GetItemType(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "typeId",
    {get = function(self)
        return GetItemTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "userData",
    {
        get = function(self)
            return GetItemUserData(self.handle)
        end,
        set = function(self, value)
            SetItemUserData(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "visible",
    {
        get = function(self)
            return IsItemVisible(self.handle)
        end,
        set = function(self, flag)
            SetItemVisible(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "x",
    {
        get = function(self)
            return GetItemX(self.handle)
        end,
        set = function(self, value)
            SetItemPosition(self.handle, value, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "y",
    {
        get = function(self)
            return GetItemY(self.handle)
        end,
        set = function(self, value)
            SetItemPosition(self.handle, self.x, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.sound"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Sound = __TS__Class()
local Sound = ____exports.Sound
Sound.name = "Sound"
__TS__ClassExtends(Sound, Handle)
function Sound.prototype.____constructor(self, fileName, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate, eaxSetting)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateSound(
        fileName,
        looping,
        is3D,
        stopWhenOutOfRange,
        fadeInRate,
        fadeOutRate,
        eaxSetting
    )
    if handle == nil then
        Error(nil, "w3ts failed to create sound handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Sound.create(self, fileName, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate, eaxSetting)
    local handle = CreateSound(
        fileName,
        looping,
        is3D,
        stopWhenOutOfRange,
        fadeInRate,
        fadeOutRate,
        eaxSetting
    )
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Sound.prototype.killWhenDone(self)
    KillSoundWhenDone(self.handle)
end
function Sound.prototype.registerStacked(self, byPosition, rectWidth, rectHeight)
    RegisterStackedSound(self.handle, byPosition, rectWidth, rectHeight)
end
function Sound.prototype.setChannel(self, channel)
    SetSoundDistanceCutoff(self.handle, channel)
end
function Sound.prototype.setConeAngles(self, inside, outside, outsideVolume)
    SetSoundConeAngles(self.handle, inside, outside, outsideVolume)
end
function Sound.prototype.setConeOrientation(self, x, y, z)
    SetSoundConeOrientation(self.handle, x, y, z)
end
function Sound.prototype.setDistanceCutoff(self, cutoff)
    SetSoundDistanceCutoff(self.handle, cutoff)
end
function Sound.prototype.setDistances(self, minDist, maxDist)
    SetSoundDistances(self.handle, minDist, maxDist)
end
function Sound.prototype.setParamsFromLabel(self, soundLabel)
    SetSoundParamsFromLabel(self.handle, soundLabel)
end
function Sound.prototype.setPitch(self, pitch)
    SetSoundPitch(self.handle, pitch)
end
function Sound.prototype.setPlayPosition(self, millisecs)
    SetSoundPlayPosition(self.handle, millisecs)
end
function Sound.prototype.setPosition(self, x, y, z)
    SetSoundPosition(self.handle, x, y, z)
end
function Sound.prototype.setVelocity(self, x, y, z)
    SetSoundVelocity(self.handle, x, y, z)
end
function Sound.prototype.setVolume(self, volume)
    SetSoundVolume(self.handle, volume)
end
function Sound.prototype.start(self)
    StartSound(self.handle)
end
function Sound.prototype.stop(self, killWhenDone, fadeOut)
    StopSound(self.handle, killWhenDone, fadeOut)
end
function Sound.prototype.unregisterStacked(self, byPosition, rectWidth, rectHeight)
    UnregisterStackedSound(self.handle, byPosition, rectWidth, rectHeight)
end
function Sound.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Sound.getFileDuration(self, fileName)
    return GetSoundFileDuration(fileName)
end
__TS__SetDescriptor(
    Sound.prototype,
    "duration",
    {
        get = function(self)
            return GetSoundDuration(self.handle)
        end,
        set = function(self, duration)
            SetSoundDuration(self.handle, duration)
        end
    },
    true
)
__TS__SetDescriptor(
    Sound.prototype,
    "loading",
    {get = function(self)
        return GetSoundIsLoading(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Sound.prototype,
    "playing",
    {get = function(self)
        return GetSoundIsPlaying(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.unit"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____destructable = require("lua_modules.wc3ts-1.27a.handles.destructable")
local Destructable = ____destructable.Destructable
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____item = require("lua_modules.wc3ts-1.27a.handles.item")
local Item = ____item.Item
local ____player = require("lua_modules.wc3ts-1.27a.handles.player")
local MapPlayer = ____player.MapPlayer
local ____point = require("lua_modules.wc3ts-1.27a.handles.point")
local Point = ____point.Point
local ____widget = require("lua_modules.wc3ts-1.27a.handles.widget")
local Widget = ____widget.Widget
local ____define = require("lua_modules.wc3ts-1.27a.globals.define")
local bj_UNIT_FACING = ____define.bj_UNIT_FACING
local UNIT_STATE_ATTACK_BONUS = ____define.UNIT_STATE_ATTACK_BONUS
local UNIT_STATE_ATTACK_SPACE = ____define.UNIT_STATE_ATTACK_SPACE
local UNIT_STATE_ATTACK_SPEED = ____define.UNIT_STATE_ATTACK_SPEED
local UNIT_STATE_ATTACK_WHITE = ____define.UNIT_STATE_ATTACK_WHITE
local UNIT_STATE_DEFEND_WHITE = ____define.UNIT_STATE_DEFEND_WHITE
local UNIT_STATE_MANA = ____define.UNIT_STATE_MANA
local UNIT_STATE_MAX_LIFE = ____define.UNIT_STATE_MAX_LIFE
local UNIT_STATE_MAX_MANA = ____define.UNIT_STATE_MAX_MANA
local UNIT_TYPE_DEAD = ____define.UNIT_TYPE_DEAD
____exports.Unit = __TS__Class()
local Unit = ____exports.Unit
Unit.name = "Unit"
__TS__ClassExtends(Unit, Widget)
function Unit.prototype.____constructor(self, owner, unitId, x, y, face)
    if Handle:initFromHandle() == true then
        Widget.prototype.____constructor(self)
        return
    end
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle == nil then
        Error(nil, "w3ts failed to create unit handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Unit.create(self, owner, unitId, x, y, face, skinId)
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Unit.prototype.addAbility(self, abilityId)
    return UnitAddAbility(self.handle, abilityId)
end
function Unit.prototype.addAnimationProps(self, animProperties, add)
    AddUnitAnimationProperties(self.handle, animProperties, add)
end
function Unit.prototype.addExperience(self, xpToAdd, showEyeCandy)
    AddHeroXP(self.handle, xpToAdd, showEyeCandy)
end
function Unit.prototype.addIndicator(self, red, blue, green, alpha)
    UnitAddIndicator(
        self.handle,
        red,
        blue,
        green,
        alpha
    )
end
function Unit.prototype.addItem(self, whichItem)
    return UnitAddItem(self.handle, whichItem.handle)
end
function Unit.prototype.addItemById(self, itemId)
    return Item:fromHandle(UnitAddItemById(self.handle, itemId))
end
function Unit.prototype.addItemToSlotById(self, itemId, itemSlot)
    return UnitAddItemToSlotById(self.handle, itemId, itemSlot)
end
function Unit.prototype.addItemToStock(self, itemId, currentStock, stockMax)
    AddItemToStock(self.handle, itemId, currentStock, stockMax)
end
function Unit.prototype.addResourceAmount(self, amount)
    AddResourceAmount(self.handle, amount)
end
function Unit.prototype.addSleepPerm(self, add)
    UnitAddSleepPerm(self.handle, add)
end
function Unit.prototype.addType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.addUnitToStock(self, unitId, currentStock, stockMax)
    AddUnitToStock(self.handle, unitId, currentStock, stockMax)
end
function Unit.prototype.applyTimedLife(self, buffId, duration)
    UnitApplyTimedLife(self.handle, buffId, duration)
end
function Unit.prototype.attachSound(self, sound)
    AttachSoundToUnit(sound.handle, self.handle)
end
function Unit.prototype.canSleepPerm(self)
    return UnitCanSleepPerm(self.handle)
end
function Unit.prototype.countBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitCountBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.damageAt(self, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamagePoint(
        self.handle,
        delay,
        radius,
        x,
        y,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.damageTarget(self, target, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamageTarget(
        self.handle,
        target,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.decAbilityLevel(self, abilCode)
    return DecUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.destroy(self)
    RemoveUnit(self.handle)
end
function Unit.prototype.dropItem(self, whichItem, x, y)
    return UnitDropItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.dropItemFromSlot(self, whichItem, slot)
    return UnitDropItemSlot(self.handle, whichItem.handle, slot)
end
function Unit.prototype.dropItemTarget(self, whichItem, target)
    return UnitDropItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.getAbilityLevel(self, abilCode)
    return GetUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.getAgility(self, includeBonuses)
    return GetHeroAgi(self.handle, includeBonuses)
end
function Unit.prototype.getflyHeight(self)
    return GetUnitFlyHeight(self.handle)
end
function Unit.prototype.getHeroLevel(self)
    return GetHeroLevel(self.handle)
end
function Unit.prototype.getIgnoreAlarm(self, flag)
    return UnitIgnoreAlarm(self.handle, flag)
end
function Unit.prototype.getIntelligence(self, includeBonuses)
    return GetHeroInt(self.handle, includeBonuses)
end
function Unit.prototype.getItemInSlot(self, slot)
    return Item:fromHandle(UnitItemInSlot(self.handle, slot))
end
function Unit.prototype.getState(self, whichUnitState)
    return GetUnitState(self.handle, whichUnitState)
end
function Unit.prototype.getStrength(self, includeBonuses)
    return GetHeroStr(self.handle, includeBonuses)
end
function Unit.prototype.hasBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitHasBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.hasItem(self, whichItem)
    return UnitHasItem(self.handle, whichItem.handle)
end
function Unit.prototype.incAbilityLevel(self, abilCode)
    return IncUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.inForce(self, whichForce)
    return IsUnitInForce(self.handle, whichForce.handle)
end
function Unit.prototype.inGroup(self, whichGroup)
    return IsUnitInGroup(self.handle, whichGroup.handle)
end
function Unit.prototype.inRange(self, x, y, distance)
    return IsUnitInRangeXY(self.handle, x, y, distance)
end
function Unit.prototype.inRangeOfPoint(self, whichPoint, distance)
    return IsUnitInRangeLoc(self.handle, whichPoint.handle, distance)
end
function Unit.prototype.inRangeOfUnit(self, otherUnit, distance)
    return IsUnitInRange(self.handle, otherUnit.handle, distance)
end
function Unit.prototype.inTransport(self, whichTransport)
    return IsUnitInTransport(self.handle, whichTransport.handle)
end
function Unit.prototype.isAlive(self)
    return not IsUnitType(
        self.handle,
        UNIT_TYPE_DEAD()
    )
end
function Unit.prototype.isAlly(self, whichPlayer)
    return IsUnitAlly(self.handle, whichPlayer.handle)
end
function Unit.prototype.isEnemy(self, whichPlayer)
    return IsUnitEnemy(self.handle, whichPlayer.handle)
end
function Unit.prototype.isExperienceSuspended(self)
    return IsSuspendedXP(self.handle)
end
function Unit.prototype.isFogged(self, whichPlayer)
    return IsUnitFogged(self.handle, whichPlayer.handle)
end
function Unit.prototype.isHero(self)
    return IsHeroUnitId(self.typeId)
end
function Unit.prototype.isIllusion(self)
    return IsUnitIllusion(self.handle)
end
function Unit.prototype.isLoaded(self)
    return IsUnitLoaded(self.handle)
end
function Unit.prototype.isMasked(self, whichPlayer)
    return IsUnitMasked(self.handle, whichPlayer.handle)
end
function Unit.prototype.isSelected(self, whichPlayer)
    return IsUnitSelected(self.handle, whichPlayer.handle)
end
function Unit.prototype.issueBuildOrder(self, unit, x, y)
    local ____temp_0
    if type(unit) == "string" then
        ____temp_0 = IssueBuildOrder(self.handle, unit, x, y)
    else
        ____temp_0 = IssueBuildOrderById(self.handle, unit, x, y)
    end
    return ____temp_0
end
function Unit.prototype.issueImmediateOrder(self, order)
    local ____temp_1
    if type(order) == "string" then
        ____temp_1 = IssueImmediateOrder(self.handle, order)
    else
        ____temp_1 = IssueImmediateOrderById(self.handle, order)
    end
    return ____temp_1
end
function Unit.prototype.issueInstantOrderAt(self, order, x, y, instantTargetWidget)
    local ____temp_2
    if type(order) == "string" then
        ____temp_2 = IssueInstantPointOrder(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    else
        ____temp_2 = IssueInstantPointOrderById(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    end
    return ____temp_2
end
function Unit.prototype.issueInstantTargetOrder(self, order, targetWidget, instantTargetWidget)
    local ____temp_3
    if type(order) == "string" then
        ____temp_3 = IssueInstantTargetOrder(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    else
        ____temp_3 = IssueInstantTargetOrderById(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    end
    return ____temp_3
end
function Unit.prototype.issueOrderAt(self, order, x, y)
    local ____temp_4
    if type(order) == "string" then
        ____temp_4 = IssuePointOrder(self.handle, order, x, y)
    else
        ____temp_4 = IssuePointOrderById(self.handle, order, x, y)
    end
    return ____temp_4
end
function Unit.prototype.issuePointOrder(self, order, whichPoint)
    local ____temp_5
    if type(order) == "string" then
        ____temp_5 = IssuePointOrderLoc(self.handle, order, whichPoint.handle)
    else
        ____temp_5 = IssuePointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
    return ____temp_5
end
function Unit.prototype.issueTargetOrder(self, order, targetWidget)
    local ____temp_6
    if type(order) == "string" then
        ____temp_6 = IssueTargetOrder(self.handle, order, targetWidget.handle)
    else
        ____temp_6 = IssueTargetOrderById(self.handle, order, targetWidget.handle)
    end
    return ____temp_6
end
function Unit.prototype.isUnit(self, whichSpecifiedUnit)
    return IsUnit(self.handle, whichSpecifiedUnit.handle)
end
function Unit.prototype.isUnitType(self, whichUnitType)
    return IsUnitType(self.handle, whichUnitType)
end
function Unit.prototype.isVisible(self, whichPlayer)
    return IsUnitVisible(self.handle, whichPlayer.handle)
end
function Unit.prototype.kill(self)
    KillUnit(self.handle)
end
function Unit.prototype.lookAt(self, whichBone, lookAtTarget, offsetX, offsetY, offsetZ)
    SetUnitLookAt(
        self.handle,
        whichBone,
        lookAtTarget.handle,
        offsetX,
        offsetY,
        offsetZ
    )
end
function Unit.prototype.makeAbilityPermanent(self, permanent, abilityId)
    UnitMakeAbilityPermanent(self.handle, permanent, abilityId)
end
function Unit.prototype.modifySkillPoints(self, skillPointDelta)
    return UnitModifySkillPoints(self.handle, skillPointDelta)
end
function Unit.prototype.pauseEx(self, flag)
    PauseUnit(self.handle, flag)
end
function Unit.prototype.pauseTimedLife(self, flag)
    UnitPauseTimedLife(self.handle, flag)
end
function Unit.prototype.queueAnimation(self, whichAnimation)
    QueueUnitAnimation(self.handle, whichAnimation)
end
function Unit.prototype.recycleGuardPosition(self)
    RecycleGuardPosition(self.handle)
end
function Unit.prototype.removeAbility(self, abilityId)
    return UnitRemoveAbility(self.handle, abilityId)
end
function Unit.prototype.removeBuffs(self, removePositive, removeNegative)
    UnitRemoveBuffs(self.handle, removePositive, removeNegative)
end
function Unit.prototype.removeBuffsEx(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    UnitRemoveBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.removeGuardPosition(self)
    RemoveGuardPosition(self.handle)
end
function Unit.prototype.removeItem(self, whichItem)
    UnitRemoveItem(self.handle, whichItem.handle)
end
function Unit.prototype.removeItemFromSlot(self, itemSlot)
    return Item:fromHandle(UnitRemoveItemFromSlot(self.handle, itemSlot))
end
function Unit.prototype.removeItemFromStock(self, itemId)
    RemoveItemFromStock(self.handle, itemId)
end
function Unit.prototype.removeType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.removeUnitFromStock(self, itemId)
    RemoveUnitFromStock(self.handle, itemId)
end
function Unit.prototype.resetCooldown(self)
    UnitResetCooldown(self.handle)
end
function Unit.prototype.resetLookAt(self)
    ResetUnitLookAt(self.handle)
end
function Unit.prototype.revive(self, x, y, doEyecandy)
    return ReviveHero(self.handle, x, y, doEyecandy)
end
function Unit.prototype.reviveAtPoint(self, whichPoint, doEyecandy)
    return ReviveHeroLoc(self.handle, whichPoint.handle, doEyecandy)
end
function Unit.prototype.select(self, flag)
    SelectUnit(self.handle, flag)
end
function Unit.prototype.selectSkill(self, abilCode)
    SelectHeroSkill(self.handle, abilCode)
end
function Unit.prototype.setAbilityLevel(self, abilCode, level)
    return SetUnitAbilityLevel(self.handle, abilCode, level)
end
function Unit.prototype.setAgility(self, value, permanent)
    SetHeroAgi(self.handle, value, permanent)
end
function Unit.prototype.setAnimation(self, whichAnimation)
    if type(whichAnimation) == "string" then
        SetUnitAnimation(self.handle, whichAnimation)
    else
        SetUnitAnimationByIndex(self.handle, whichAnimation)
    end
end
function Unit.prototype.setAnimationWithRarity(self, whichAnimation, rarity)
    SetUnitAnimationWithRarity(self.handle, whichAnimation, rarity)
end
function Unit.prototype.setBaseDamageJAPI(self, baseDamage)
    self:setState(
        UNIT_STATE_ATTACK_WHITE(),
        baseDamage
    )
end
function Unit.prototype.setBonusDamageJAPI(self, bonusDamage)
    self:setState(
        UNIT_STATE_ATTACK_BONUS(),
        bonusDamage
    )
end
function Unit.prototype.setBlendTime(self, timeScale)
    SetUnitBlendTime(self.handle, timeScale)
end
function Unit.prototype.setConstructionProgress(self, constructionPercentage)
    UnitSetConstructionProgress(self.handle, constructionPercentage)
end
function Unit.prototype.setCreepGuard(self, creepGuard)
    SetUnitCreepGuard(self.handle, creepGuard)
end
function Unit.prototype.setExperience(self, newXpVal, showEyeCandy)
    SetHeroXP(self.handle, newXpVal, showEyeCandy)
end
function Unit.prototype.setExploded(self, exploded)
    SetUnitExploded(self.handle, exploded)
end
function Unit.prototype.setFacingEx(self, facingAngle)
    SetUnitFacing(self.handle, facingAngle)
end
function Unit.prototype.setflyHeight(self, value, rate)
    SetUnitFlyHeight(self.handle, value, rate)
end
function Unit.prototype.setHeroLevel(self, level, showEyeCandy)
    SetHeroLevel(self.handle, level, showEyeCandy)
end
function Unit.prototype.setIntelligence(self, value, permanent)
    SetHeroInt(self.handle, value, permanent)
end
function Unit.prototype.setItemTypeSlots(self, slots)
    SetItemTypeSlots(self.handle, slots)
end
function Unit.prototype.setOwner(self, whichPlayer, changeColor)
    if changeColor == nil then
        changeColor = true
    end
    SetUnitOwner(self.handle, whichPlayer.handle, changeColor)
end
function Unit.prototype.getOwner(self)
    return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
end
function Unit.prototype.setPoint(self, point)
    SetUnitPositionLoc(self.handle, point.handle)
end
function Unit.prototype.getPoint(self)
    return Point:fromHandle(GetUnitLoc(self.handle))
end
function Unit.prototype.setPathing(self, flag)
    SetUnitPathing(self.handle, flag)
end
function Unit.prototype.setPosition(self, x, y)
    SetUnitPosition(self.handle, x, y)
end
function Unit.prototype.setRescuable(self, byWhichPlayer, flag)
    SetUnitRescuable(self.handle, byWhichPlayer.handle, flag)
end
function Unit.prototype.setRescueRange(self, range)
    SetUnitRescueRange(self.handle, range)
end
function Unit.prototype.setScale(self, scaleX, scaleY, scaleZ)
    SetUnitScale(self.handle, scaleX, scaleY, scaleZ)
end
function Unit.prototype.setState(self, whichUnitState, newVal)
    SetUnitState(self.handle, whichUnitState, newVal)
end
function Unit.prototype.setStrength(self, value, permanent)
    SetHeroStr(self.handle, value, permanent)
end
function Unit.prototype.setTimeScale(self, timeScale)
    SetUnitTimeScale(self.handle, timeScale)
end
function Unit.prototype.setUnitAttackCooldownJAPI(self, cooldown)
    self:setState(
        UNIT_STATE_ATTACK_SPACE(),
        cooldown
    )
end
function Unit.prototype.setUnitAttackSpeedJAPI(self, attacksPerSecond)
    self:setState(
        UNIT_STATE_ATTACK_SPEED(),
        attacksPerSecond
    )
end
function Unit.prototype.setUnitTypeSlots(self, slots)
    SetUnitTypeSlots(self.handle, slots)
end
function Unit.prototype.setUpgradeProgress(self, upgradePercentage)
    UnitSetUpgradeProgress(self.handle, upgradePercentage)
end
function Unit.prototype.setUseAltIcon(self, flag)
    UnitSetUsesAltIcon(self.handle, flag)
end
function Unit.prototype.setUseFood(self, useFood)
    SetUnitUseFood(self.handle, useFood)
end
function Unit.prototype.setVertexColor(self, red, green, blue, alpha)
    SetUnitVertexColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Unit.prototype.shareVision(self, whichPlayer, share)
    UnitShareVision(self.handle, whichPlayer.handle, share)
end
function Unit.prototype.stripLevels(self, howManyLevels)
    return UnitStripHeroLevel(self.handle, howManyLevels)
end
function Unit.prototype.suspendDecay(self, suspend)
    UnitSuspendDecay(self.handle, suspend)
end
function Unit.prototype.suspendExperience(self, flag)
    SuspendHeroXP(self.handle, flag)
end
function Unit.prototype.useItem(self, whichItem)
    return UnitUseItem(self.handle, whichItem.handle)
end
function Unit.prototype.useItemAt(self, whichItem, x, y)
    return UnitUseItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.useItemTarget(self, whichItem, target)
    return UnitUseItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.wakeUp(self)
    UnitWakeUp(self.handle)
end
function Unit.prototype.waygateGetDestinationX(self)
    return WaygateGetDestinationX(self.handle)
end
function Unit.prototype.waygateGetDestinationY(self)
    return WaygateGetDestinationY(self.handle)
end
function Unit.prototype.waygateSetDestination(self, x, y)
    WaygateSetDestination(self.handle, x, y)
end
function Unit.foodMadeByType(self, unitId)
    return GetFoodMade(unitId)
end
function Unit.foodUsedByType(self, unitId)
    return GetFoodUsed(unitId)
end
function Unit.fromEnum(self)
    return self:fromHandle(GetEnumUnit())
end
function Unit.fromEvent(self)
    return self:fromHandle(GetTriggerUnit())
end
function Unit.fromFilter(self)
    return self:fromHandle(GetFilterUnit())
end
function Unit.fromHandle(self, handle)
    local ____handle_7
    if handle then
        ____handle_7 = self:getObject(handle)
    else
        ____handle_7 = nil
    end
    return ____handle_7
end
function Unit.getPointValueByType(self, unitType)
    return GetUnitPointValueByType(unitType)
end
function Unit.isUnitIdHero(self, unitId)
    return IsHeroUnitId(unitId)
end
function Unit.isUnitIdType(self, unitId, whichUnitType)
    return IsUnitIdType(unitId, whichUnitType)
end
__TS__SetDescriptor(
    Unit.prototype,
    "acquireRange",
    {
        get = function(self)
            return GetUnitAcquireRange(self.handle)
        end,
        set = function(self, value)
            SetUnitAcquireRange(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "agility",
    {
        get = function(self)
            return GetHeroAgi(self.handle, false)
        end,
        set = function(self, value)
            SetHeroAgi(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "armor",
    {
        get = function(self)
            return GetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE()
            )
        end,
        set = function(self, armorAmount)
            SetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE(),
                armorAmount
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "canSleep",
    {
        get = function(self)
            return UnitCanSleep(self.handle)
        end,
        set = function(self, flag)
            UnitAddSleep(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "color",
    {set = function(self, whichColor)
        SetUnitColor(self.handle, whichColor)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "currentOrder",
    {get = function(self)
        return GetUnitCurrentOrder(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultAcquireRange",
    {get = function(self)
        return GetUnitDefaultAcquireRange(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultFlyHeight",
    {get = function(self)
        return GetUnitDefaultFlyHeight(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultMoveSpeed",
    {get = function(self)
        return GetUnitDefaultMoveSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultPropWindow",
    {get = function(self)
        return GetUnitDefaultPropWindow(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultTurnSpeed",
    {get = function(self)
        return GetUnitDefaultTurnSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "experience",
    {
        get = function(self)
            return GetHeroXP(self.handle)
        end,
        set = function(self, newXpVal)
            SetHeroXP(self.handle, newXpVal, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "facing",
    {
        get = function(self)
            return GetUnitFacing(self.handle)
        end,
        set = function(self, value)
            SetUnitFacing(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodMade",
    {get = function(self)
        return GetUnitFoodMade(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodUsed",
    {get = function(self)
        return GetUnitFoodUsed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "ignoreAlarmToggled",
    {get = function(self)
        return UnitIgnoreAlarmToggled(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "intelligence",
    {
        get = function(self)
            return GetHeroInt(self.handle, false)
        end,
        set = function(self, value)
            SetHeroInt(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "inventorySize",
    {get = function(self)
        return UnitInventorySize(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "invulnerable",
    {set = function(self, flag)
        SetUnitInvulnerable(self.handle, flag)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "level",
    {get = function(self)
        return GetUnitLevel(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "mana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxLife",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_LIFE())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_LIFE(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxMana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "moveSpeed",
    {
        get = function(self)
            return GetUnitMoveSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitMoveSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "name",
    {
        get = function(self)
            return GetUnitName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "nameProper",
    {
        get = function(self)
            return GetHeroProperName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitProperName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "owner",
    {
        get = function(self)
            return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
        end,
        set = function(self, whichPlayer)
            SetUnitOwner(self.handle, whichPlayer.handle, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "paused",
    {
        get = function(self)
            return IsUnitPaused(self.handle)
        end,
        set = function(self, flag)
            PauseUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "point",
    {
        get = function(self)
            return Point:fromHandle(GetUnitLoc(self.handle))
        end,
        set = function(self, whichPoint)
            SetUnitPositionLoc(self.handle, whichPoint.handle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "pointValue",
    {get = function(self)
        return GetUnitPointValue(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "propWindow",
    {
        get = function(self)
            return GetUnitPropWindow(self.handle)
        end,
        set = function(self, newPropWindowAngle)
            SetUnitPropWindow(self.handle, newPropWindowAngle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "race",
    {get = function(self)
        return GetUnitRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyDestructable",
    {get = function(self)
        return Destructable:fromHandle(GetUnitRallyDestructable(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyPoint",
    {get = function(self)
        return Point:fromHandle(GetUnitRallyPoint(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyUnit",
    {get = function(self)
        return ____exports.Unit:fromHandle(GetUnitRallyUnit(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "resourceAmount",
    {
        get = function(self)
            return GetResourceAmount(self.handle)
        end,
        set = function(self, amount)
            SetResourceAmount(self.handle, amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "show",
    {
        get = function(self)
            return not IsUnitHidden(self.handle)
        end,
        set = function(self, flag)
            ShowUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "skillPoints",
    {
        get = function(self)
            return GetHeroSkillPoints(self.handle)
        end,
        set = function(self, skillPointDelta)
            UnitModifySkillPoints(self.handle, skillPointDelta)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "sleeping",
    {get = function(self)
        return UnitIsSleeping(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "strength",
    {
        get = function(self)
            return GetHeroStr(self.handle, false)
        end,
        set = function(self, value)
            SetHeroStr(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "turnSpeed",
    {
        get = function(self)
            return GetUnitTurnSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitTurnSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "typeId",
    {get = function(self)
        return GetUnitTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "userData",
    {
        get = function(self)
            return GetUnitUserData(self.handle)
        end,
        set = function(self, value)
            SetUnitUserData(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "waygateActive",
    {
        get = function(self)
            return WaygateIsActive(self.handle)
        end,
        set = function(self, flag)
            WaygateActivate(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "x",
    {
        get = function(self)
            return GetUnitX(self.handle)
        end,
        set = function(self, value)
            SetUnitX(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "y",
    {
        get = function(self)
            return GetUnitY(self.handle)
        end,
        set = function(self, value)
            SetUnitY(self.handle, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.group"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
local ____unit = require("lua_modules.wc3ts-1.27a.handles.unit")
local Unit = ____unit.Unit
____exports.Group = __TS__Class()
local Group = ____exports.Group
Group.name = "Group"
__TS__ClassExtends(Group, Handle)
function Group.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateGroup()
    if handle == nil then
        Error(nil, "w3ts failed to create group handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Group.create(self)
    local handle = CreateGroup()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Group.prototype.addUnit(self, whichUnit)
    return GroupAddUnit(self.handle, whichUnit.handle)
end
function Group.prototype.clear(self)
    GroupClear(self.handle)
end
function Group.prototype.destroy(self)
    DestroyGroup(self.handle)
end
function Group.prototype.enumUnitsInRange(self, x, y, radius, filter)
    GroupEnumUnitsInRange(
        self.handle,
        x,
        y,
        radius,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRangeCounted(self, x, y, radius, filter, countLimit)
    GroupEnumUnitsInRangeCounted(
        self.handle,
        x,
        y,
        radius,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsInRangeOfPoint(self, whichPoint, radius, filter)
    GroupEnumUnitsInRangeOfLoc(
        self.handle,
        whichPoint.handle,
        radius,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRangeOfPointCounted(self, whichPoint, radius, filter, countLimit)
    GroupEnumUnitsInRangeOfLocCounted(
        self.handle,
        whichPoint.handle,
        radius,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsInRect(self, r, filter)
    GroupEnumUnitsInRect(
        self.handle,
        r.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRectCounted(self, r, filter, countLimit)
    GroupEnumUnitsInRectCounted(
        self.handle,
        r.handle,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsOfPlayer(self, whichPlayer, filter)
    GroupEnumUnitsOfPlayer(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsOfType(self, unitName, filter)
    GroupEnumUnitsOfType(
        self.handle,
        unitName,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsOfTypeCounted(self, unitName, filter, countLimit)
    GroupEnumUnitsOfTypeCounted(
        self.handle,
        unitName,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsSelected(self, whichPlayer, filter)
    GroupEnumUnitsSelected(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
Group.prototype["for"] = function(self, callback)
    ForGroup(self.handle, callback)
end
function Group.prototype.getUnits(self)
    local units = {}
    self["for"](
        self,
        function()
            local u = Unit:fromFilter()
            if u then
                units[#units + 1] = u
            end
        end
    )
    return units
end
function Group.prototype.hasUnit(self, whichUnit)
    return IsUnitInGroup(whichUnit.handle, self.handle)
end
function Group.prototype.orderCoords(self, order, x, y)
    if type(order) == "string" then
        GroupPointOrder(self.handle, order, x, y)
    else
        GroupPointOrderById(self.handle, order, x, y)
    end
end
function Group.prototype.orderImmediate(self, order)
    if type(order) == "string" then
        GroupImmediateOrder(self.handle, order)
    else
        GroupImmediateOrderById(self.handle, order)
    end
end
function Group.prototype.orderPoint(self, order, whichPoint)
    if type(order) == "string" then
        GroupPointOrderLoc(self.handle, order, whichPoint.handle)
    else
        GroupPointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
end
function Group.prototype.orderTarget(self, order, targetWidget)
    if type(order) == "string" then
        GroupTargetOrder(self.handle, order, targetWidget.handle)
    else
        GroupTargetOrderById(self.handle, order, targetWidget.handle)
    end
end
function Group.prototype.removeUnit(self, whichUnit)
    return GroupRemoveUnit(self.handle, whichUnit.handle)
end
function Group.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Group.getEnumUnit(self)
    return Unit:fromHandle(GetEnumUnit())
end
function Group.getFilterUnit(self)
    return Unit:fromHandle(GetFilterUnit())
end
__TS__SetDescriptor(
    Group.prototype,
    "first",
    {get = function(self)
        return Unit:fromHandle(FirstOfGroup(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Group.prototype,
    "size",
    {get = function(self)
        local size = 0
        self["for"](
            self,
            function()
                size = size + 1
            end
        )
        return size
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.image"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.ImageType = ImageType or ({})
____exports.ImageType.Selection = 1
____exports.ImageType[____exports.ImageType.Selection] = "Selection"
____exports.ImageType.Indicator = 2
____exports.ImageType[____exports.ImageType.Indicator] = "Indicator"
____exports.ImageType.OcclusionMask = 3
____exports.ImageType[____exports.ImageType.OcclusionMask] = "OcclusionMask"
____exports.ImageType.Ubersplat = 4
____exports.ImageType[____exports.ImageType.Ubersplat] = "Ubersplat"
____exports.Image = __TS__Class()
local Image = ____exports.Image
Image.name = "Image"
__TS__ClassExtends(Image, Handle)
function Image.prototype.____constructor(self, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateImage(
        file,
        sizeX,
        sizeY,
        sizeZ,
        posX,
        posY,
        posZ,
        originX,
        originY,
        originZ,
        imageType
    )
    if handle == nil then
        Error(nil, "w3ts failed to create image handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Image.create(self, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType)
    local handle = CreateImage(
        file,
        sizeX,
        sizeY,
        sizeZ,
        posX,
        posY,
        posZ,
        originX,
        originY,
        originZ,
        imageType
    )
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Image.prototype.destroy(self)
    DestroyImage(self.handle)
end
function Image.prototype.setAboveWater(self, flag, useWaterAlpha)
    SetImageAboveWater(self.handle, flag, useWaterAlpha)
end
function Image.prototype.setColor(self, red, green, blue, alpha)
    SetImageColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Image.prototype.setConstantHeight(self, flag, height)
    SetImageConstantHeight(self.handle, flag, height)
end
function Image.prototype.setPosition(self, x, y, z)
    SetImagePosition(self.handle, x, y, z)
end
function Image.prototype.setRender(self, flag)
    SetImageRenderAlways(self.handle, flag)
end
function Image.prototype.setType(self, imageType)
    SetImageType(self.handle, imageType)
end
function Image.prototype.show(self, flag)
    ShowImage(self.handle, flag)
end
function Image.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.leaderboard"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Leaderboard = __TS__Class()
local Leaderboard = ____exports.Leaderboard
Leaderboard.name = "Leaderboard"
__TS__ClassExtends(Leaderboard, Handle)
function Leaderboard.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateLeaderboard()
    if handle == nil then
        Error(nil, "w3ts failed to create leaderboard handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Leaderboard.create(self)
    local handle = CreateLeaderboard()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Leaderboard.prototype.addItem(self, label, value, p)
    LeaderboardAddItem(self.handle, label, value, p.handle)
end
function Leaderboard.prototype.clear(self)
    LeaderboardClear(self.handle)
end
function Leaderboard.prototype.destroy(self)
    DestroyLeaderboard(self.handle)
end
function Leaderboard.prototype.display(self, flag)
    if flag == nil then
        flag = true
    end
    LeaderboardDisplay(self.handle, flag)
end
function Leaderboard.prototype.getPlayerIndex(self, p)
    return LeaderboardGetPlayerIndex(self.handle, p.handle)
end
function Leaderboard.prototype.hasPlayerItem(self, p)
    LeaderboardHasPlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.removeItem(self, index)
    LeaderboardRemoveItem(self.handle, index)
end
function Leaderboard.prototype.removePlayerItem(self, p)
    LeaderboardRemovePlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.setItemLabel(self, item, label)
    LeaderboardSetItemLabel(self.handle, item, label)
end
function Leaderboard.prototype.setItemLabelColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemLabelColor(
        self.handle,
        item,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setItemStyle(self, item, showLabel, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetItemStyle(
        self.handle,
        item,
        showLabel,
        showValues,
        showIcons
    )
end
function Leaderboard.prototype.setItemValue(self, item, value)
    LeaderboardSetItemValue(self.handle, item, value)
end
function Leaderboard.prototype.setItemValueColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemValueColor(
        self.handle,
        item,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setLabelColor(self, red, green, blue, alpha)
    LeaderboardSetLabelColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setPlayerBoard(self, p)
    PlayerSetLeaderboard(p.handle, self.handle)
end
function Leaderboard.prototype.setStyle(self, showLabel, showNames, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showNames == nil then
        showNames = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetStyle(
        self.handle,
        showLabel,
        showNames,
        showValues,
        showIcons
    )
end
function Leaderboard.prototype.setValueColor(self, red, green, blue, alpha)
    LeaderboardSetValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.sortByLabel(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByLabel(self.handle, asc)
end
function Leaderboard.prototype.sortByPlayer(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByPlayer(self.handle, asc)
end
function Leaderboard.prototype.sortByValue(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByValue(self.handle, asc)
end
function Leaderboard.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Leaderboard.fromPlayer(self, p)
    return self:fromHandle(PlayerGetLeaderboard(p.handle))
end
__TS__SetDescriptor(
    Leaderboard.prototype,
    "displayed",
    {get = function(self)
        return IsLeaderboardDisplayed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Leaderboard.prototype,
    "itemCount",
    {
        get = function(self)
            return LeaderboardGetItemCount(self.handle)
        end,
        set = function(self, count)
            LeaderboardSetSizeByItemCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Leaderboard.prototype,
    "label",
    {
        get = function(self)
            return LeaderboardGetLabelText(self.handle) or ""
        end,
        set = function(self, value)
            LeaderboardSetLabel(self.handle, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.multiboard"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.MultiboardItem = __TS__Class()
local MultiboardItem = ____exports.MultiboardItem
MultiboardItem.name = "MultiboardItem"
__TS__ClassExtends(MultiboardItem, Handle)
function MultiboardItem.prototype.____constructor(self, board, x, y)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = MultiboardGetItem(board.handle, x - 1, y - 1)
    if handle == nil then
        Error(nil, "w3ts failed to create multiboarditem handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function MultiboardItem.create(self, board, x, y)
    local handle = MultiboardGetItem(board.handle, x - 1, y - 1)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function MultiboardItem.prototype.destroy(self)
    MultiboardReleaseItem(self.handle)
end
function MultiboardItem.prototype.setIcon(self, icon)
    MultiboardSetItemIcon(self.handle, icon)
end
function MultiboardItem.prototype.setStyle(self, showValue, showIcon)
    MultiboardSetItemStyle(self.handle, showValue, showIcon)
end
function MultiboardItem.prototype.setValue(self, val)
    MultiboardSetItemValue(self.handle, val)
end
function MultiboardItem.prototype.setValueColor(self, red, green, blue, alpha)
    MultiboardSetItemValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function MultiboardItem.prototype.setWidth(self, width)
    MultiboardSetItemWidth(self.handle, width)
end
function MultiboardItem.fromHandle(self, handle)
    return self:getObject(handle)
end
____exports.Multiboard = __TS__Class()
local Multiboard = ____exports.Multiboard
Multiboard.name = "Multiboard"
__TS__ClassExtends(Multiboard, Handle)
function Multiboard.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateMultiboard()
    if handle == nil then
        Error(nil, "w3ts failed to create multiboard handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Multiboard.create(self)
    local handle = CreateMultiboard()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Multiboard.prototype.clear(self)
    MultiboardClear(self.handle)
end
function Multiboard.prototype.createItem(self, x, y)
    return ____exports.MultiboardItem:create(self, x, y)
end
function Multiboard.prototype.destroy(self)
    DestroyMultiboard(self.handle)
end
function Multiboard.prototype.display(self, show)
    MultiboardDisplay(self.handle, show)
end
function Multiboard.prototype.minimize(self, flag)
    MultiboardMinimize(self.handle, flag)
end
function Multiboard.prototype.minimized(self)
    return IsMultiboardMinimized(self.handle)
end
function Multiboard.prototype.setItemsIcons(self, icon)
    MultiboardSetItemsIcon(self.handle, icon)
end
function Multiboard.prototype.setItemsStyle(self, showValues, showIcons)
    MultiboardSetItemsStyle(self.handle, showValues, showIcons)
end
function Multiboard.prototype.setItemsValue(self, value)
    MultiboardSetItemsValue(self.handle, value)
end
function Multiboard.prototype.setItemsValueColor(self, red, green, blue, alpha)
    MultiboardSetItemsValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Multiboard.prototype.setItemsWidth(self, width)
    MultiboardSetItemsWidth(self.handle, width)
end
function Multiboard.prototype.setTitleTextColor(self, red, green, blue, alpha)
    MultiboardSetTitleTextColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Multiboard.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Multiboard.suppressDisplay(self, flag)
    MultiboardSuppressDisplay(flag)
end
__TS__SetDescriptor(
    Multiboard.prototype,
    "columns",
    {
        get = function(self)
            return MultiboardGetColumnCount(self.handle)
        end,
        set = function(self, count)
            MultiboardSetColumnCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "displayed",
    {get = function(self)
        return IsMultiboardDisplayed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "rows",
    {
        get = function(self)
            return MultiboardGetRowCount(self.handle)
        end,
        set = function(self, count)
            MultiboardSetRowCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "title",
    {
        get = function(self)
            return MultiboardGetTitleText(self.handle) or ""
        end,
        set = function(self, label)
            MultiboardSetTitleText(self.handle, label)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.quest"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.QuestItem = __TS__Class()
local QuestItem = ____exports.QuestItem
QuestItem.name = "QuestItem"
__TS__ClassExtends(QuestItem, Handle)
function QuestItem.prototype.____constructor(self, whichQuest)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = QuestCreateItem(whichQuest.handle)
    if handle == nil then
        Error(nil, "w3ts failed to create questitem handle.")
    end
    Handle.prototype.____constructor(self, handle)
    self.quest = whichQuest
end
function QuestItem.create(self, whichQuest)
    local handle = QuestCreateItem(whichQuest.handle)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.quest = whichQuest
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function QuestItem.prototype.setDescription(self, description)
    QuestItemSetDescription(self.handle, description)
end
__TS__SetDescriptor(
    QuestItem.prototype,
    "completed",
    {
        get = function(self)
            return IsQuestItemCompleted(self.handle)
        end,
        set = function(self, completed)
            QuestItemSetCompleted(self.handle, completed)
        end
    },
    true
)
____exports.Quest = __TS__Class()
local Quest = ____exports.Quest
Quest.name = "Quest"
__TS__ClassExtends(Quest, Handle)
function Quest.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateQuest()
    if handle == nil then
        Error(nil, "w3ts failed to create quest handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Quest.create(self)
    local handle = CreateQuest()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Quest.prototype.addItem(self, description)
    local questItem = ____exports.QuestItem:create(self)
    if questItem ~= nil then
        questItem:setDescription(description)
    end
    return questItem
end
function Quest.prototype.destroy(self)
    DestroyQuest(self.handle)
end
function Quest.prototype.setDescription(self, description)
    QuestSetDescription(self.handle, description)
end
function Quest.prototype.setIcon(self, iconPath)
    QuestSetIconPath(self.handle, iconPath)
end
function Quest.prototype.setTitle(self, title)
    QuestSetTitle(self.handle, title)
end
function Quest.flashQuestDialogButton(self)
    FlashQuestDialogButton()
end
function Quest.forceQuestDialogUpdate(self)
    ForceQuestDialogUpdate()
end
function Quest.fromHandle(self, handle)
    local ____handle_2
    if handle then
        ____handle_2 = self:getObject(handle)
    else
        ____handle_2 = nil
    end
    return ____handle_2
end
__TS__SetDescriptor(
    Quest.prototype,
    "completed",
    {
        get = function(self)
            return IsQuestCompleted(self.handle)
        end,
        set = function(self, completed)
            QuestSetCompleted(self.handle, completed)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "discovered",
    {
        get = function(self)
            return IsQuestDiscovered(self.handle)
        end,
        set = function(self, discovered)
            QuestSetDiscovered(self.handle, discovered)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "enabled",
    {
        get = function(self)
            return IsQuestEnabled(self.handle)
        end,
        set = function(self, enabled)
            QuestSetEnabled(self.handle, enabled)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "failed",
    {
        get = function(self)
            return IsQuestFailed(self.handle)
        end,
        set = function(self, failed)
            QuestSetFailed(self.handle, failed)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "required",
    {
        get = function(self)
            return IsQuestRequired(self.handle)
        end,
        set = function(self, required)
            QuestSetRequired(self.handle, required)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.region"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Region = __TS__Class()
local Region = ____exports.Region
Region.name = "Region"
__TS__ClassExtends(Region, Handle)
function Region.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateRegion()
    if handle == nil then
        Error(nil, "w3ts failed to create rect handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Region.create(self)
    local handle = CreateRegion()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Region.prototype.addCell(self, x, y)
    RegionAddCell(self.handle, x, y)
end
function Region.prototype.addCellPoint(self, whichPoint)
    RegionAddCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.addRect(self, r)
    RegionAddRect(self.handle, r.handle)
end
function Region.prototype.clearCell(self, x, y)
    RegionClearCell(self.handle, x, y)
end
function Region.prototype.clearCellPoint(self, whichPoint)
    RegionClearCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.clearRect(self, r)
    RegionClearRect(self.handle, r.handle)
end
function Region.prototype.containsCoords(self, x, y)
    return IsPointInRegion(self.handle, x, y)
end
function Region.prototype.containsPoint(self, whichPoint)
    IsLocationInRegion(self.handle, whichPoint.handle)
end
function Region.prototype.containsUnit(self, whichUnit)
    return IsUnitInRegion(self.handle, whichUnit.handle)
end
function Region.prototype.destroy(self)
    RemoveRegion(self.handle)
end
function Region.fromEvent(self)
    return self:fromHandle(GetTriggeringRegion())
end
function Region.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.texttag"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____define = require("lua_modules.wc3ts-1.27a.globals.define")
local bj_DEGTORAD = ____define.bj_DEGTORAD
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.TextTag = __TS__Class()
local TextTag = ____exports.TextTag
TextTag.name = "TextTag"
__TS__ClassExtends(TextTag, Handle)
function TextTag.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTextTag()
    if handle == nil then
        Error(nil, "w3ts failed to create texttag handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function TextTag.create(self)
    local handle = CreateTextTag()
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function TextTag.prototype.destroy(self)
    DestroyTextTag(self.handle)
end
function TextTag.prototype.setAge(self, age)
    SetTextTagAge(self.handle, age)
end
function TextTag.prototype.setColor(self, red, green, blue, alpha)
    SetTextTagColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TextTag.prototype.setFadepoint(self, fadepoint)
    SetTextTagFadepoint(self.handle, fadepoint)
end
function TextTag.prototype.setLifespan(self, lifespan)
    SetTextTagLifespan(self.handle, lifespan)
end
function TextTag.prototype.setPermanent(self, flag)
    SetTextTagPermanent(self.handle, flag)
end
function TextTag.prototype.setPos(self, x, y, heightOffset)
    SetTextTagPos(self.handle, x, y, heightOffset)
end
function TextTag.prototype.setPosUnit(self, u, heightOffset)
    SetTextTagPosUnit(self.handle, u.handle, heightOffset)
end
function TextTag.prototype.setSuspended(self, flag)
    SetTextTagSuspended(self.handle, flag)
end
function TextTag.prototype.setText(self, s, height, adjustHeight)
    if adjustHeight == nil then
        adjustHeight = false
    end
    if adjustHeight then
        height = height * 0.0023
    end
    SetTextTagText(self.handle, s, height)
end
function TextTag.prototype.setVelocity(self, xvel, yvel)
    SetTextTagVelocity(self.handle, xvel, yvel)
end
function TextTag.prototype.setVelocityAngle(self, speed, angle)
    local vel = speed * 0.071 / 128
    self:setVelocity(
        vel * Cos(angle * bj_DEGTORAD),
        vel * Sin(angle * bj_DEGTORAD)
    )
end
function TextTag.prototype.setVisible(self, flag)
    SetTextTagVisibility(self.handle, flag)
end
function TextTag.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.timer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Timer = __TS__Class()
local Timer = ____exports.Timer
Timer.name = "Timer"
__TS__ClassExtends(Timer, Handle)
function Timer.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTimer()
    if handle == nil then
        Error(nil, "w3ts failed to create timer handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Timer.create(self)
    local handle = CreateTimer()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Timer.prototype.destroy(self)
    DestroyTimer(self.handle)
    return self
end
function Timer.prototype.pause(self)
    PauseTimer(self.handle)
    return self
end
function Timer.prototype.resume(self)
    ResumeTimer(self.handle)
    return self
end
function Timer.prototype.start(self, timeout, periodic, handlerFunc)
    TimerStart(self.handle, timeout, periodic, handlerFunc)
    return self
end
function Timer.fromExpired(self)
    return self:fromHandle(GetExpiredTimer())
end
function Timer.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Timer.prototype,
    "elapsed",
    {get = function(self)
        return TimerGetElapsed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Timer.prototype,
    "remaining",
    {get = function(self)
        return TimerGetRemaining(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Timer.prototype,
    "timeout",
    {get = function(self)
        return TimerGetTimeout(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.timerdialog"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.TimerDialog = __TS__Class()
local TimerDialog = ____exports.TimerDialog
TimerDialog.name = "TimerDialog"
__TS__ClassExtends(TimerDialog, Handle)
function TimerDialog.prototype.____constructor(self, t)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTimerDialog(t.handle)
    if handle == nil then
        Error(nil, "w3ts failed to create timer handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function TimerDialog.create(self, t)
    local handle = CreateTimerDialog(t.handle)
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function TimerDialog.prototype.destroy(self)
    DestroyTimerDialog(self.handle)
end
function TimerDialog.prototype.setSpeed(self, speedMultFactor)
    TimerDialogSetSpeed(self.handle, speedMultFactor)
end
function TimerDialog.prototype.setTimeRemaining(self, value)
    TimerDialogSetRealTimeRemaining(self.handle, value)
end
function TimerDialog.prototype.setTitle(self, title)
    TimerDialogSetTitle(self.handle, title)
end
function TimerDialog.prototype.setTitleColor(self, red, green, blue, alpha)
    TimerDialogSetTitleColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TimerDialog.prototype.setTimeColor(self, red, green, blue, alpha)
    TimerDialogSetTimeColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TimerDialog.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    TimerDialog.prototype,
    "display",
    {
        get = function(self)
            return IsTimerDialogDisplayed(self.handle)
        end,
        set = function(self, display)
            TimerDialogDisplay(self.handle, display)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.trigger"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ObjectDefineProperty = ____lualib.__TS__ObjectDefineProperty
local ____exports = {}
local ____define = require("lua_modules.wc3ts-1.27a.globals.define")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Trigger = __TS__Class()
local Trigger = ____exports.Trigger
Trigger.name = "Trigger"
__TS__ClassExtends(Trigger, Handle)
function Trigger.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTrigger()
    if handle == nil then
        Error(nil, "w3ts failed to create trigger handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Trigger.create(self)
    local handle = CreateTrigger()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Trigger.prototype.addAction(self, actionFunc)
    return TriggerAddAction(self.handle, actionFunc)
end
function Trigger.prototype.addCondition(self, condition)
    if type(condition) == "function" then
        local cf = Condition(condition)
        return cf ~= nil and cf ~= nil and TriggerAddCondition(self.handle, cf) or nil
    end
    return TriggerAddCondition(self.handle, condition)
end
function Trigger.prototype.destroy(self)
    DestroyTrigger(self.handle)
end
function Trigger.prototype.eval(self)
    return TriggerEvaluate(self.handle)
end
function Trigger.prototype.exec(self)
    return TriggerExecute(self.handle)
end
function Trigger.prototype.execWait(self)
    TriggerExecuteWait(self.handle)
end
function Trigger.prototype.registerAnyUnitEvent(self, whichPlayerUnitEvent)
    do
        local i = 0
        while i < bj_MAX_PLAYER_SLOTS do
            TriggerRegisterPlayerUnitEvent(
                self.handle,
                Player(i),
                whichPlayerUnitEvent,
                function()
                    return true
                end
            )
            i = i + 1
        end
    end
end
function Trigger.prototype.registerDeathEvent(self, whichWidget)
    return TriggerRegisterDeathEvent(self.handle, whichWidget.handle)
end
function Trigger.prototype.registerDialogButtonEvent(self, whichButton)
    return TriggerRegisterDialogButtonEvent(self.handle, whichButton.handle)
end
function Trigger.prototype.registerDialogEvent(self, whichDialog)
    return TriggerRegisterDialogEvent(self.handle, whichDialog.handle)
end
function Trigger.prototype.registerEnterRegion(self, whichRegion, filter)
    return TriggerRegisterEnterRegion(
        self.handle,
        whichRegion.handle,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerFilterUnitEvent(self, whichUnit, whichEvent, filter)
    return TriggerRegisterFilterUnitEvent(
        self.handle,
        whichUnit.handle,
        whichEvent,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerGameEvent(self, whichGameEvent)
    return TriggerRegisterGameEvent(self.handle, whichGameEvent)
end
function Trigger.prototype.registerGameStateEvent(self, whichState, opcode, limitval)
    return TriggerRegisterGameStateEvent(self.handle, whichState, opcode, limitval)
end
function Trigger.prototype.registerLeaveRegion(self, whichRegion, filter)
    return TriggerRegisterLeaveRegion(
        self.handle,
        whichRegion.handle,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerPlayerAllianceChange(self, whichPlayer, whichAlliance)
    return TriggerRegisterPlayerAllianceChange(self.handle, whichPlayer.handle, whichAlliance)
end
function Trigger.prototype.registerPlayerChatEvent(self, whichPlayer, chatMessageToDetect, exactMatchOnly)
    return TriggerRegisterPlayerChatEvent(self.handle, whichPlayer.handle, chatMessageToDetect, exactMatchOnly)
end
function Trigger.prototype.registerPlayerEvent(self, whichPlayer, whichPlayerEvent)
    return TriggerRegisterPlayerEvent(self.handle, whichPlayer.handle, whichPlayerEvent)
end
function Trigger.prototype.registerPlayerKeyEvent(self, trig, key, status, sync, funcHandle)
    return DzTriggerRegisterKeyEventByCode(
        trig,
        key,
        status,
        sync,
        funcHandle
    )
end
function Trigger.prototype.registerPlayerMouseEvent(self, trig, btn, status, sync, funcHandle)
    return DzTriggerRegisterMouseEventByCode(
        trig,
        btn,
        status,
        sync,
        funcHandle
    )
end
function Trigger.prototype.registerPlayerStateEvent(self, whichPlayer, whichState, opcode, limitval)
    return TriggerRegisterPlayerStateEvent(
        self.handle,
        whichPlayer.handle,
        whichState,
        opcode,
        limitval
    )
end
function Trigger.prototype.registerPlayerUnitEvent(self, whichPlayer, whichPlayerUnitEvent, filter)
    return TriggerRegisterPlayerUnitEvent(
        self.handle,
        whichPlayer.handle,
        whichPlayerUnitEvent,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerTimerEvent(self, timeout, periodic)
    return TriggerRegisterTimerEvent(self.handle, timeout, periodic)
end
function Trigger.prototype.registerTimerExpireEvent(self, t)
    return TriggerRegisterTimerExpireEvent(self.handle, t)
end
function Trigger.prototype.registerTrackableHitEvent(self, whichTrackable)
    return TriggerRegisterTrackableHitEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerTrackableTrackEvent(self, whichTrackable)
    return TriggerRegisterTrackableTrackEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerUnitEvent(self, whichUnit, whichEvent)
    return TriggerRegisterUnitEvent(self.handle, whichUnit.handle, whichEvent)
end
function Trigger.prototype.registerUnitInRange(self, whichUnit, range, filter)
    return TriggerRegisterUnitInRange(
        self.handle,
        whichUnit.handle,
        range,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerUnitStateEvent(self, whichUnit, whichState, opcode, limitval)
    return TriggerRegisterUnitStateEvent(
        self.handle,
        whichUnit.handle,
        whichState,
        opcode,
        limitval
    )
end
function Trigger.prototype.registerVariableEvent(self, varName, opcode, limitval)
    return TriggerRegisterVariableEvent(self.handle, varName, opcode, limitval)
end
function Trigger.prototype.removeAction(self, whichAction)
    return TriggerRemoveAction(self.handle, whichAction)
end
function Trigger.prototype.removeActions(self)
    return TriggerClearActions(self.handle)
end
function Trigger.prototype.removeCondition(self, whichCondition)
    return TriggerRemoveCondition(self.handle, whichCondition)
end
function Trigger.prototype.removeConditions(self)
    return TriggerClearConditions(self.handle)
end
function Trigger.prototype.reset(self)
    ResetTrigger(self.handle)
end
function Trigger.fromEvent(self)
    return self:fromHandle(GetTriggeringTrigger())
end
function Trigger.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Trigger.prototype,
    "enabled",
    {
        get = function(self)
            return IsTriggerEnabled(self.handle)
        end,
        set = function(self, flag)
            if flag then
                EnableTrigger(self.handle)
            else
                DisableTrigger(self.handle)
            end
        end
    },
    true
)
__TS__SetDescriptor(
    Trigger.prototype,
    "evalCount",
    {get = function(self)
        return GetTriggerEvalCount(self.handle)
    end},
    true
)
__TS__ObjectDefineProperty(
    Trigger,
    "eventId",
    {get = function(self)
        return GetTriggerEventId()
    end}
)
__TS__SetDescriptor(
    Trigger.prototype,
    "execCount",
    {get = function(self)
        return GetTriggerExecCount(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Trigger.prototype,
    "waitOnSleeps",
    {
        get = function(self)
            return IsTriggerWaitOnSleeps(self.handle)
        end,
        set = function(self, flag)
            TriggerWaitOnSleeps(self.handle, flag)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.ubersplat"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.Ubersplat = __TS__Class()
local Ubersplat = ____exports.Ubersplat
Ubersplat.name = "Ubersplat"
__TS__ClassExtends(Ubersplat, Handle)
function Ubersplat.prototype.____constructor(self, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateUbersplat(
        x,
        y,
        name,
        red,
        green,
        blue,
        alpha,
        forcePaused,
        noBirthTime
    )
    if handle == nil then
        Error(nil, "w3ts failed to create ubersplat handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Ubersplat.create(self, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime)
    local handle = CreateUbersplat(
        x,
        y,
        name,
        red,
        green,
        blue,
        alpha,
        forcePaused,
        noBirthTime
    )
    if handle ~= nil and handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Ubersplat.prototype.destroy(self)
    DestroyUbersplat(self.handle)
end
function Ubersplat.prototype.finish(self)
    FinishUbersplat(self.handle)
end
function Ubersplat.prototype.render(self, flag, always)
    if always == nil then
        always = false
    end
    if always then
        SetUbersplatRenderAlways(self.handle, flag)
    else
        SetUbersplatRender(self.handle, flag)
    end
end
function Ubersplat.prototype.reset(self)
    ResetUbersplat(self.handle)
end
function Ubersplat.prototype.show(self, flag)
    ShowUbersplat(self.handle, flag)
end
function Ubersplat.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.weathereffect"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____handle = require("lua_modules.wc3ts-1.27a.handles.handle")
local Handle = ____handle.Handle
____exports.WeatherEffect = __TS__Class()
local WeatherEffect = ____exports.WeatherEffect
WeatherEffect.name = "WeatherEffect"
__TS__ClassExtends(WeatherEffect, Handle)
function WeatherEffect.prototype.____constructor(self, where, effectID)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = AddWeatherEffect(where.handle, effectID)
    if handle == nil then
        Error(nil, "w3ts failed to create unit handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function WeatherEffect.create(self, where, effectID)
    local handle = AddWeatherEffect(where.handle, effectID)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function WeatherEffect.prototype.destroy(self)
    RemoveWeatherEffect(self.handle)
end
function WeatherEffect.prototype.enable(self, flag)
    EnableWeatherEffect(self.handle, flag)
end
function WeatherEffect.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.handles.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.camera")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.destructable")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.dialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.effect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.fogmodifier")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.force")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.frame")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.gamecache")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.group")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.handle")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.image")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.item")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.leaderboard")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.multiboard")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.player")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.point")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.quest")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.rect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.region")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.sound")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.texttag")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.timer")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.timerdialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.trigger")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.ubersplat")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.unit")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.weathereffect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.widget")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.system.base64"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__StringCharCodeAt = ____lualib.__TS__StringCharCodeAt
local __TS__StringCharAt = ____lualib.__TS__StringCharAt
local __TS__StringAccess = ____lualib.__TS__StringAccess
local __TS__StringSubstr = ____lualib.__TS__StringSubstr
local ____exports = {}
---
-- @noSelfInFile
local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
--- Encode a string to base64.
-- 
-- @param input The string to encode.
function ____exports.base64Encode(input)
    local output = ""
    do
        local block = 0
        local charCode = 0
        local idx = 0
        local map = chars
        while true do
            local ____temp_1 = #__TS__StringCharAt(
                input,
                math.floor(idx) | 0
            ) > 0
            if not ____temp_1 then
                map = "="
                local ____ = map
                ____temp_1 = idx % 1
            end
            if not ____temp_1 then
                break
            end
            local ____input_0 = input
            idx = idx + 3 / 4
            charCode = __TS__StringCharCodeAt(
                ____input_0,
                math.floor(idx)
            ) or 0
            if math.floor(idx) > #input and charCode == 0 then
                if #output % 4 == 1 then
                    return output .. "="
                end
                return output .. "=="
            end
            if charCode > 255 then
                return output
            end
            block = block << 8 | charCode
            output = output .. __TS__StringCharAt(
                map,
                math.floor(63 & block >> 8 - idx % 1 * 8)
            )
        end
    end
    return output
end
--- Decode a base64 string.
-- 
-- @param input The base64 string to decode.
function ____exports.base64Decode(input)
    local i = #input
    do
        while i > 0 and __TS__StringAccess(input, i) ~= "=" do
            i = i - 1
        end
    end
    local str = __TS__StringSubstr(input, 0, i - 1)
    local output = ""
    if #str % 4 == 1 then
        return output
    end
    local bs = 0
    do
        local bc = 0
        local buffer
        local idx = 0
        while true do
            buffer = __TS__StringCharAt(str, idx)
            if not buffer then
                break
            end
            if #buffer == 0 then
                break
            end
            buffer = (string.find(chars, buffer, nil, true) or 0) - 1
            idx = idx + 1
            local ____temp_4
            local ____temp_3 = ~buffer
            if ____temp_3 then
                bs = bc % 4 ~= 0 and bs * 64 + buffer or buffer
                local ____ = bs
                local ____bc_2 = bc
                bc = ____bc_2 + 1
                ____temp_3 = ____bc_2 % 4 ~= 0
            end
            if ____temp_3 then
                output = output .. string.char(255 & bs >> (-2 * bc & 6))
                ____temp_4 = output
            else
                ____temp_4 = 0
            end
        end
    end
    return output
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.system.binaryreader"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__StringCharCodeAt = ____lualib.__TS__StringCharCodeAt
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Reads primitive types from a packed binary string.
-- 
-- @example ```ts
-- // Write the values
-- const writer = new BinaryWriter();
-- writer.writeUInt8(5);
-- writer.writeUInt8(32);
-- writer.writeUInt8(78);
-- writer.writeUInt8(200);
-- writer.writeUInt32(12345678);
-- writer.writeString("hello");
-- writer.writeUInt16(45000);
-- 
-- // Read the values
-- const binaryString = writer.toString();
-- const reader = new BinaryReader(binaryString);
-- const values: any[] = [];
-- 
-- values[0] = reader.readUInt8(); // 5
-- values[1] = reader.readUInt8(); // 32
-- values[2] = reader.readUInt8(); // 78
-- values[3] = reader.readUInt8(); // 200
-- values[4] = reader.readUInt32(); // 12345678
-- values[5] = reader.readString(); // hello
-- values[6] = reader.readUInt16(); // 45000
-- ```
____exports.BinaryReader = __TS__Class()
local BinaryReader = ____exports.BinaryReader
BinaryReader.name = "BinaryReader"
function BinaryReader.prototype.____constructor(self, binaryString)
    self.pos = 0
    self.data = binaryString
end
function BinaryReader.prototype.readBytes(self, size)
    local bytes = {}
    do
        local i = 0
        while i < size do
            if self.pos + i >= #self.data then
                bytes[#bytes + 1] = 0
            else
                bytes[#bytes + 1] = __TS__StringCharCodeAt(self.data, self.pos + i)
            end
            i = i + 1
        end
    end
    self.pos = self.pos + size
    return bytes
end
function BinaryReader.prototype.readDouble(self)
    local bytes = self:readBytes(8)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 8 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat64(0, false)
end
function BinaryReader.prototype.readFloat(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat32(0, false)
end
function BinaryReader.prototype.readInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt16(0, false)
end
function BinaryReader.prototype.readInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt32(0, false)
end
function BinaryReader.prototype.readInt8(self)
    local bytes = self:readBytes(1)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint8(0, bytes[1])
    return view:getInt8(0)
end
function BinaryReader.prototype.readString(self)
    local result = ""
    local charCode = __TS__StringCharCodeAt(self.data, self.pos)
    while charCode ~= 0 and self.pos < #self.data do
        result = result .. string.char(charCode)
        self.pos = self.pos + 1
        charCode = __TS__StringCharCodeAt(self.data, self.pos)
    end
    self.pos = self.pos + 1
    return result
end
function BinaryReader.prototype.readUInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint16(0, false)
end
function BinaryReader.prototype.readUInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint32(0, false)
end
function BinaryReader.prototype.readUInt8(self)
    local bytes = self:readBytes(1)
    return bytes[1]
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.system.binarywriter"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__StringCharCodeAt = ____lualib.__TS__StringCharCodeAt
local ____exports = {}
--- Packs primitive types into a binary string.
-- 
-- @example ```ts
-- // Write the values
-- const writer = new BinaryWriter();
-- writer.writeUInt8(5);
-- writer.writeUInt8(32);
-- writer.writeUInt8(78);
-- writer.writeUInt8(200);
-- writer.writeUInt32(12345678);
-- writer.writeString("hello");
-- writer.writeUInt16(45000);
-- 
-- // Read the values
-- const binaryString = writer.toString();
-- const reader = new BinaryReader(binaryString);
-- const values: any[] = [];
-- 
-- values[0] = reader.readUInt8(); // 5
-- values[1] = reader.readUInt8(); // 32
-- values[2] = reader.readUInt8(); // 78
-- values[3] = reader.readUInt8(); // 200
-- values[4] = reader.readUInt32(); // 12345678
-- values[5] = reader.readString(); // hello
-- values[6] = reader.readUInt16(); // 45000
-- ```
____exports.BinaryWriter = __TS__Class()
local BinaryWriter = ____exports.BinaryWriter
BinaryWriter.name = "BinaryWriter"
function BinaryWriter.prototype.____constructor(self)
    self.buffer = {}
end
function BinaryWriter.prototype.__tostring(self)
    return string.char(table.unpack(self.buffer))
end
function BinaryWriter.prototype.writeDouble(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat64(0, value, false)
    do
        local i = 0
        while i < 8 do
            local ____self_buffer_0 = self.buffer
            ____self_buffer_0[#____self_buffer_0 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeFloat(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_1 = self.buffer
            ____self_buffer_1[#____self_buffer_1 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_2 = self.buffer
            ____self_buffer_2[#____self_buffer_2 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_3 = self.buffer
            ____self_buffer_3[#____self_buffer_3 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt8(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt8(0, value)
    local ____self_buffer_4 = self.buffer
    ____self_buffer_4[#____self_buffer_4 + 1] = view:getUint8(0)
end
function BinaryWriter.prototype.writeString(self, value)
    do
        local i = 0
        while i < #value do
            local ____self_buffer_5 = self.buffer
            ____self_buffer_5[#____self_buffer_5 + 1] = __TS__StringCharCodeAt(value, i)
            i = i + 1
        end
    end
    local ____self_buffer_6 = self.buffer
    ____self_buffer_6[#____self_buffer_6 + 1] = 0
end
function BinaryWriter.prototype.writeUInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_7 = self.buffer
            ____self_buffer_7[#____self_buffer_7 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_8 = self.buffer
            ____self_buffer_8[#____self_buffer_8 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt8(self, value)
    local ____self_buffer_9 = self.buffer
    ____self_buffer_9[#____self_buffer_9 + 1] = value & 255
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.system.file"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
---
-- @noSelfInFile
____exports.File = __TS__Class()
local File = ____exports.File
File.name = "File"
function File.prototype.____constructor(self)
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.system.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("lua_modules.wc3ts-1.27a.system.base64")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.system.binaryreader")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.system.binarywriter")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.system.file")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.utils.color"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__New = ____lualib.__TS__New
local __TS__NumberToString = ____lualib.__TS__NumberToString
local ____exports = {}
local toHex, orderedPlayerColors
local ____define = require("lua_modules.wc3ts-1.27a.globals.define")
local PLAYER_COLOR_AQUA = ____define.PLAYER_COLOR_AQUA
local PLAYER_COLOR_BLUE = ____define.PLAYER_COLOR_BLUE
local PLAYER_COLOR_BROWN = ____define.PLAYER_COLOR_BROWN
local PLAYER_COLOR_CYAN = ____define.PLAYER_COLOR_CYAN
local PLAYER_COLOR_GREEN = ____define.PLAYER_COLOR_GREEN
local PLAYER_COLOR_LIGHT_BLUE = ____define.PLAYER_COLOR_LIGHT_BLUE
local PLAYER_COLOR_LIGHT_GRAY = ____define.PLAYER_COLOR_LIGHT_GRAY
local PLAYER_COLOR_ORANGE = ____define.PLAYER_COLOR_ORANGE
local PLAYER_COLOR_PINK = ____define.PLAYER_COLOR_PINK
local PLAYER_COLOR_PURPLE = ____define.PLAYER_COLOR_PURPLE
local PLAYER_COLOR_RED = ____define.PLAYER_COLOR_RED
local PLAYER_COLOR_YELLOW = ____define.PLAYER_COLOR_YELLOW
function toHex(value)
    local hex = __TS__NumberToString(value, 16)
    if #hex < 2 then
        hex = "0" .. hex
    end
    return hex
end
____exports.Color = __TS__Class()
local Color = ____exports.Color
Color.name = "Color"
function Color.prototype.____constructor(self, red, green, blue, alpha)
    self.red = red
    self.green = green
    self.blue = blue
    if alpha then
        self.alpha = alpha
    else
        self.alpha = 255
    end
end
function Color.prototype.equals(self, other)
    return self.red == other.red and self.green == other.green and self.blue == other.blue and self.alpha == other.alpha
end
function Color.prototype.playerColorIndex(self)
    local i = 0
    do
        while i < #____exports.playerColors do
            if ____exports.playerColors[i + 1]:equals(self) then
                break
            end
            i = i + 1
        end
    end
    return i
end
__TS__SetDescriptor(
    Color.prototype,
    "code",
    {get = function(self)
        return (("|c" .. toHex(self.alpha)) .. toHex(self.red)) .. toHex(self.green) .. toHex(self.blue)
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "name",
    {get = function(self)
        local index = self:playerColorIndex()
        if index < #____exports.playerColors then
            return ____exports.playerColorNames[index + 1]
        end
        return "unknown"
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "playerColor",
    {get = function(self)
        local index = self:playerColorIndex()
        if index < #____exports.playerColors then
            return orderedPlayerColors[index + 1]
        end
        return PLAYER_COLOR_RED
    end},
    true
)
____exports.color = function(red, green, blue, alpha) return __TS__New(
    ____exports.Color,
    red,
    green,
    blue,
    alpha
) end
--- The player colors sorted by index. Does not include
-- neutrals colors.
____exports.playerColors = {
    ____exports.color(255, 3, 3),
    ____exports.color(0, 66, 255),
    ____exports.color(28, 230, 185),
    ____exports.color(84, 0, 129),
    ____exports.color(255, 252, 0),
    ____exports.color(254, 138, 14),
    ____exports.color(32, 192, 0),
    ____exports.color(229, 91, 176),
    ____exports.color(149, 150, 151),
    ____exports.color(126, 191, 241),
    ____exports.color(16, 98, 70),
    ____exports.color(78, 42, 3),
    ____exports.color(155, 0, 0),
    ____exports.color(0, 0, 195),
    ____exports.color(0, 234, 255),
    ____exports.color(190, 0, 254),
    ____exports.color(235, 205, 135),
    ____exports.color(248, 164, 139),
    ____exports.color(191, 255, 128),
    ____exports.color(220, 185, 235),
    ____exports.color(80, 79, 85),
    ____exports.color(235, 240, 255),
    ____exports.color(0, 120, 30),
    ____exports.color(164, 111, 51)
}
--- The names of players colors sorted by player index.
____exports.playerColorNames = {
    "red",
    "blue",
    "teal",
    "purple",
    "yellow",
    "orange",
    "green",
    "pink",
    "gray",
    "light blue",
    "dark green",
    "brown",
    "maroon",
    "navy",
    "turquoise",
    "violet",
    "wheat",
    "peach",
    "mint",
    "lavender",
    "coal",
    "snow",
    "emerald",
    "peanut"
}
--- An ordered list of `playercolor`s, for lookup
orderedPlayerColors = {
    PLAYER_COLOR_RED,
    PLAYER_COLOR_BLUE,
    PLAYER_COLOR_CYAN,
    PLAYER_COLOR_PURPLE,
    PLAYER_COLOR_YELLOW,
    PLAYER_COLOR_ORANGE,
    PLAYER_COLOR_GREEN,
    PLAYER_COLOR_PINK,
    PLAYER_COLOR_LIGHT_GRAY,
    PLAYER_COLOR_LIGHT_BLUE,
    PLAYER_COLOR_AQUA,
    PLAYER_COLOR_BROWN
}
return ____exports
 end,
["lua_modules.wc3ts-1.27a.utils.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Promise = ____lualib.__TS__Promise
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____timer = require("lua_modules.wc3ts-1.27a.handles.timer")
local Timer = ____timer.Timer
do
    local ____export = require("lua_modules.wc3ts-1.27a.utils.color")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
function ____exports.sleep(howMuch)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        return ____awaiter_resolve(
            nil,
            __TS__New(
                __TS__Promise,
                function(____, resolve, reject)
                    local t = Timer:create()
                    t:start(
                        howMuch,
                        false,
                        function()
                            t:destroy()
                            resolve(nil, nil)
                        end
                    )
                end
            )
        )
    end)
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.index"] = function(...) 
local ____exports = {}
local tsGlobals = require("lua_modules.wc3ts-1.27a.globals.index")
do
    local ____export = require("lua_modules.wc3ts-1.27a.handles.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.system.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.wc3ts-1.27a.utils.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
____exports.tsGlobals = tsGlobals
return ____exports
 end,
["src.types.index"] = function(...) 
local ____exports = {}
return ____exports
 end,
["src.config.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- 默认应用配置
local DEFAULT_CONFIG = {debug = true, console = true, runtime = {debuggerPort = 4279, sleep = false, catchCrash = true}, map = {name = "WC3 TypeScript Map", version = "1.0.0", description = "A Warcraft III map built with TypeScript"}}
--- 配置管理器
-- 提供应用程序配置的统一管理
____exports.ConfigManager = __TS__Class()
local ConfigManager = ____exports.ConfigManager
ConfigManager.name = "ConfigManager"
function ConfigManager.prototype.____constructor(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
function ConfigManager.getInstance(self)
    if not ____exports.ConfigManager.instance then
        ____exports.ConfigManager.instance = __TS__New(____exports.ConfigManager)
    end
    return ____exports.ConfigManager.instance
end
function ConfigManager.prototype.getConfig(self)
    return __TS__ObjectAssign({}, self.config)
end
function ConfigManager.prototype.isDebugMode(self)
    return self.config.debug
end
function ConfigManager.prototype.isConsoleEnabled(self)
    return self.config.console
end
function ConfigManager.prototype.getRuntimeConfig(self)
    return __TS__ObjectAssign({}, self.config.runtime)
end
function ConfigManager.prototype.getMapConfig(self)
    return __TS__ObjectAssign({}, self.config.map)
end
function ConfigManager.prototype.updateConfig(self, updates)
    self.config = __TS__ObjectAssign({}, self.config, updates)
end
function ConfigManager.prototype.resetToDefault(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
return ____exports
 end,
["src.types.ydlua"] = function(...) 
local ____exports = {}
____exports.ydcommon = {}
____exports.ydai = {}
____exports.ydglobals = {}
____exports.ydjapi = {}
____exports.ydhook = {}
____exports.ydruntime = {
    sleep = function(timeout)
    end,
    console = false,
    debugger = 0,
    catch_crash = false,
    error_hanlde = function(msg)
    end
}
____exports.ydslk = {}
____exports.ydconsole = {
    write = function(message)
    end,
    enable = false
}
____exports.yddebug = {}
____exports.ydlog = {}
____exports.ydmessage = {}
____exports.ydbignum = {}
return ____exports
 end,
["src.core.runtime"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ObjectKeys = ____lualib.__TS__ObjectKeys
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____config = require("src.config.index")
local ConfigManager = ____config.ConfigManager
local ____ydlua = require("src.types.ydlua")
local ydcommon = ____ydlua.ydcommon
local ydconsole = ____ydlua.ydconsole
local ydjapi = ____ydlua.ydjapi
local ydruntime = ____ydlua.ydruntime
--- 运行时管理器
-- 负责初始化游戏运行时环境
____exports.RuntimeManager = __TS__Class()
local RuntimeManager = ____exports.RuntimeManager
RuntimeManager.name = "RuntimeManager"
function RuntimeManager.prototype.____constructor(self)
    self.initialized = false
    self.configManager = ConfigManager:getInstance()
end
function RuntimeManager.getInstance(self)
    if not ____exports.RuntimeManager.instance then
        ____exports.RuntimeManager.instance = __TS__New(____exports.RuntimeManager)
    end
    return ____exports.RuntimeManager.instance
end
function RuntimeManager.prototype.initialize(self)
    if self.initialized then
        print("Runtime already initialized")
        return
    end
    print(">>> Initializing runtime environment...")
    self:initializeConsole()
    self:initializeRuntime()
    self:registerGlobals()
    self.initialized = true
    print(">>> Runtime environment initialized")
end
function RuntimeManager.prototype.initializeConsole(self)
    local isConsoleEnabled = self.configManager:isConsoleEnabled()
    ydconsole.enable = isConsoleEnabled
    if isConsoleEnabled then
        _G.print = function(msg) return ydconsole.write(msg) end
        print(">>> Console enabled")
    end
end
function RuntimeManager.prototype.initializeRuntime(self)
    local config = self.configManager:getConfig()
    local runtimeConfig = config.runtime
    ydruntime.console = config.console
    ydruntime.sleep = runtimeConfig.sleep
    ydruntime.debugger = runtimeConfig.debuggerPort
    ydruntime.catch_crash = runtimeConfig.catchCrash
    ydruntime.error_hanlde = function(msg)
        print("========lua-err========")
        print(tostring(msg))
        print("=========================")
    end
    print(((">>> Runtime configured: debugger=" .. tostring(runtimeConfig.debuggerPort)) .. ", crash_catch=") .. tostring(runtimeConfig.catchCrash))
end
function RuntimeManager.prototype.registerGlobals(self)
    __TS__ArrayForEach(
        __TS__ObjectKeys(ydcommon),
        function(____, key)
            _G[key] = ydcommon[key]
        end
    )
    __TS__ArrayForEach(
        __TS__ObjectKeys(ydjapi),
        function(____, key)
            _G[key] = ydjapi[key]
        end
    )
    print(">>> Global APIs registered")
end
function RuntimeManager.prototype.isInitialized(self)
    return self.initialized
end
function RuntimeManager.prototype.reset(self)
    self.initialized = false
    print(">>> Runtime reset")
end
return ____exports
 end,
["src.services.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
local __TS__ArrayFrom = ____lualib.__TS__ArrayFrom
local ____exports = {}
--- 服务管理器
-- 负责管理所有应用服务的生命周期
____exports.ServiceManager = __TS__Class()
local ServiceManager = ____exports.ServiceManager
ServiceManager.name = "ServiceManager"
function ServiceManager.prototype.____constructor(self)
    self.services = __TS__New(Map)
    self.initialized = false
end
function ServiceManager.getInstance(self)
    if not ____exports.ServiceManager.instance then
        ____exports.ServiceManager.instance = __TS__New(____exports.ServiceManager)
    end
    return ____exports.ServiceManager.instance
end
function ServiceManager.prototype.registerService(self, service)
    if self.services:has(service.name) then
        print(("Service " .. service.name) .. " is already registered")
        return
    end
    self.services:set(service.name, service)
    print((">>> Service " .. service.name) .. " registered")
    if self.initialized then
        service:initialize()
    end
end
function ServiceManager.prototype.getService(self, serviceName)
    return self.services:get(serviceName)
end
function ServiceManager.prototype.unregisterService(self, serviceName)
    local service = self.services:get(serviceName)
    if service then
        service:destroy()
        self.services:delete(serviceName)
        print((">>> Service " .. serviceName) .. " unregistered")
    end
end
function ServiceManager.prototype.initializeServices(self)
    if self.initialized then
        print("Services already initialized")
        return
    end
    print(">>> Initializing all services...")
    for ____, ____value in __TS__Iterator(self.services:entries()) do
        local name = ____value[1]
        local service = ____value[2]
        do
            local function ____catch(____error)
                print(((">>> Error initializing service " .. name) .. ": ") .. tostring(____error))
            end
            local ____try, ____hasReturned = pcall(function()
                service:initialize()
                print((">>> Service " .. name) .. " initialized successfully")
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
    self.initialized = true
    print(">>> All services initialized")
end
function ServiceManager.prototype.destroyServices(self)
    print(">>> Destroying all services...")
    for ____, ____value in __TS__Iterator(self.services:entries()) do
        local name = ____value[1]
        local service = ____value[2]
        do
            local function ____catch(____error)
                print(((">>> Error destroying service " .. name) .. ": ") .. tostring(____error))
            end
            local ____try, ____hasReturned = pcall(function()
                service:destroy()
                print((">>> Service " .. name) .. " destroyed")
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
    self.services:clear()
    self.initialized = false
    print(">>> All services destroyed")
end
function ServiceManager.prototype.getRegisteredServices(self)
    return __TS__ArrayFrom(self.services:keys())
end
function ServiceManager.prototype.hasService(self, serviceName)
    return self.services:has(serviceName)
end
function ServiceManager.prototype.getServiceCount(self)
    return self.services.size
end
function ServiceManager.prototype.isInitialized(self)
    return self.initialized
end
return ____exports
 end,
["src.core.Application"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____config = require("src.config.index")
local ConfigManager = ____config.ConfigManager
local ____runtime = require("src.core.runtime")
local RuntimeManager = ____runtime.RuntimeManager
local ____services = require("src.services.index")
local ServiceManager = ____services.ServiceManager
--- 应用程序主类
-- 负责整个应用的生命周期管理
____exports.Application = __TS__Class()
local Application = ____exports.Application
Application.name = "Application"
function Application.prototype.____constructor(self)
    self.initialized = false
    self.configManager = ConfigManager:getInstance()
    self.runtimeManager = RuntimeManager:getInstance()
    self.serviceManager = ServiceManager:getInstance()
end
function Application.getInstance(self)
    if not ____exports.Application.instance then
        ____exports.Application.instance = __TS__New(____exports.Application)
    end
    return ____exports.Application.instance
end
function Application.prototype.initialize(self)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        if self.initialized then
            print("Application already initialized")
            return ____awaiter_resolve(nil)
        end
        print(">>> Starting application initialization...")
        local ____try = __TS__AsyncAwaiter(function()
            self.runtimeManager:initialize()
            self.serviceManager:initializeServices()
            self.initialized = true
            print(">>> Application initialized successfully")
            self:printApplicationInfo()
        end)
        __TS__Await(____try.catch(
            ____try,
            function(____, ____error)
                print(">>> Application initialization failed: " .. tostring(____error))
                error(____error, 0)
            end
        ))
    end)
end
function Application.prototype.registerService(self, service)
    self.serviceManager:registerService(service)
end
function Application.prototype.getService(self, serviceName)
    return self.serviceManager:getService(serviceName)
end
function Application.prototype.getConfigManager(self)
    return self.configManager
end
function Application.prototype.getRuntimeManager(self)
    return self.runtimeManager
end
function Application.prototype.getServiceManager(self)
    return self.serviceManager
end
function Application.prototype.destroy(self)
    if not self.initialized then
        return
    end
    print(">>> Shutting down application...")
    do
        local function ____catch(____error)
            print(">>> Error during application shutdown: " .. tostring(____error))
        end
        local ____try, ____hasReturned = pcall(function()
            self.serviceManager:destroyServices()
            self.runtimeManager:reset()
            self.initialized = false
            print(">>> Application shutdown complete")
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
function Application.prototype.isInitialized(self)
    return self.initialized
end
function Application.prototype.printApplicationInfo(self)
    local config = self.configManager:getConfig()
    local mapConfig = config.map
    print(">>> ============================")
    print(((">>> " .. mapConfig.name) .. " v") .. mapConfig.version)
    print(">>> " .. mapConfig.description)
    print(">>> Debug Mode: " .. (config.debug and "ON" or "OFF"))
    print(">>> Console: " .. (config.console and "ON" or "OFF"))
    print(">>> Services: " .. tostring(self.serviceManager:getServiceCount()))
    print(">>> ============================")
end
return ____exports
 end,
["src.core.index"] = function(...) 
local ____exports = {}
do
    local ____Application = require("src.core.Application")
    ____exports.Application = ____Application.Application
end
do
    local ____runtime = require("src.core.runtime")
    ____exports.RuntimeManager = ____runtime.RuntimeManager
end
return ____exports
 end,
["src.services.EventService"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArrayIndexOf = ____lualib.__TS__ArrayIndexOf
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
--- 事件服务
-- 提供游戏事件的统一管理
____exports.EventService = __TS__Class()
local EventService = ____exports.EventService
EventService.name = "EventService"
function EventService.prototype.____constructor(self)
    self.name = "EventService"
    self.listeners = __TS__New(Map)
    self.initialized = false
end
function EventService.prototype.initialize(self)
    if self.initialized then
        return
    end
    print(">>> Initializing Event Service...")
    self:setupGameEvents()
    self.initialized = true
    print(">>> Event Service initialized")
end
function EventService.prototype.destroy(self)
    self.listeners:clear()
    self.initialized = false
    print(">>> Event Service destroyed")
end
function EventService.prototype.on(self, eventType, listener)
    if not self.listeners:has(eventType) then
        self.listeners:set(eventType, {})
    end
    local ____temp_0 = self.listeners:get(eventType)
    ____temp_0[#____temp_0 + 1] = listener
end
function EventService.prototype.off(self, eventType, listener)
    local eventListeners = self.listeners:get(eventType)
    if eventListeners then
        local index = __TS__ArrayIndexOf(eventListeners, listener)
        if index > -1 then
            __TS__ArraySplice(eventListeners, index, 1)
        end
    end
end
function EventService.prototype.emit(self, eventType, data)
    local eventListeners = self.listeners:get(eventType)
    if eventListeners then
        __TS__ArrayForEach(
            eventListeners,
            function(____, listener)
                do
                    local function ____catch(____error)
                        print((("Error in event listener for " .. eventType) .. ": ") .. tostring(____error))
                    end
                    local ____try, ____hasReturned = pcall(function()
                        listener(data)
                    end)
                    if not ____try then
                        ____catch(____hasReturned)
                    end
                end
            end
        )
    end
end
function EventService.prototype.setupGameEvents(self)
    print(">>> Setting up game event triggers...")
end
return ____exports
 end,
["src.utils.helper"] = function(...) 
local ____exports = {}
function ____exports.c2i(char)
    local result = string.unpack(">I4", char)
    return result[0]
end
function ____exports.i2c(id)
    return string.pack("I4", id)
end
return ____exports
 end,
["src.map.start"] = function(...) 
local ____exports = {}
local setupEventListeners, initializeMapUnits
local ____index = require("lua_modules.wc3ts-1.27a.index")
local Unit = ____index.Unit
local MapPlayer = ____index.MapPlayer
local ____helper = require("src.utils.helper")
local c2i = ____helper.c2i
function setupEventListeners(eventService)
    print(">>> Setting up event listeners...")
    eventService:on(
        "unit.created",
        function(data)
            print("Unit created for player " .. tostring(GetPlayerId(data.player)))
        end
    )
    eventService:on(
        "unit.died",
        function(data)
            print("Unit died: " .. GetUnitName(data.unit))
            if data.killer then
                print("Killed by: " .. GetUnitName(data.killer))
            end
        end
    )
    eventService:on(
        "player.left",
        function(data)
            print(("Player " .. tostring(GetPlayerId(data.player))) .. " left the game")
        end
    )
end
function initializeMapUnits()
    print(">>> Creating initial units...")
    local localPlayer = GetLocalPlayer()
    local hero = Unit:create(
        MapPlayer:fromIndex(0),
        c2i("hpea"),
        0,
        0,
        270
    )
end
--- 地图初始化函数
-- 展示如何使用新的解耦架构
function ____exports.mapInit(app)
    print(">>> Initializing map components...")
    local eventService = app:getService("EventService")
    if not eventService then
        print(">>> Error: Required services not found")
        return
    end
    setupEventListeners(eventService)
    initializeMapUnits()
    print(">>> Map initialization complete")
end
return ____exports
 end,
["src.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____index = require("lua_modules.wc3ts-1.27a.index")
local tsGlobals = ____index.tsGlobals
local ____core = require("src.core.index")
local Application = ____core.Application
local ____start = require("src.map.start")
local mapInit = ____start.mapInit
local ____EventService = require("src.services.EventService")
local EventService = ____EventService.EventService
local ____tsGlobals_0 = tsGlobals
local Players = ____tsGlobals_0.Players
--- 应用程序主入口
-- 负责引导整个应用程序的启动
local function main()
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local ____try = __TS__AsyncAwaiter(function()
            local app = Application:getInstance()
            app:registerService(__TS__New(EventService))
            __TS__Await(app:initialize())
            DisplayTextToPlayer(
                Player(0),
                0,
                0,
                ">>> Application initialized"
            )
            print(">>> Starting map logic...")
            mapInit(app)
            print(">>> Map logic initialized")
        end)
        __TS__Await(____try.catch(
            ____try,
            function(____, ____error)
                print(">>> Failed to start application: " .. tostring(____error))
            end
        ))
    end)
end
main()
return ____exports
 end,
["lua_modules.wc3ts-1.27a.config"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- 配置管理器
____exports.ConfigManager = __TS__Class()
local ConfigManager = ____exports.ConfigManager
ConfigManager.name = "ConfigManager"
function ConfigManager.prototype.____constructor(self)
end
function ConfigManager.getInstance(self)
    if not ____exports.ConfigManager.instance then
        ____exports.ConfigManager.instance = __TS__New(____exports.ConfigManager)
    end
    return ____exports.ConfigManager.instance
end
function ConfigManager.prototype.isConsoleEnabled(self)
    return true
end
function ConfigManager.prototype.getConfig(self)
    return {console = true, runtime = {sleep = true, debuggerPort = 4279, catchCrash = true}}
end
return ____exports
 end,
["lua_modules.wc3ts-1.27a.globals.const"] = function(...) 
local ____exports = {}
____exports.EPlayerColor = EPlayerColor or ({})
____exports.EPlayerColor.COLOR1 = "|cFFFF0303"
____exports.EPlayerColor.COLOR2 = "|cFF0042FF"
____exports.EPlayerColor.COLOR3 = "|cFF1CE6B9"
____exports.EPlayerColor.COLOR4 = "|cFF540081"
____exports.EPlayerColor.COLOR5 = "|cFFFFFC01"
____exports.EPlayerColor.COLOR6 = "|cFFFE8A0E"
____exports.EPlayerColor.COLOR7 = "|cFF20C000"
____exports.EPlayerColor.COLOR8 = "|cFFE55BB0"
____exports.EPlayerColor.COLOR9 = "|cFF959697"
____exports.EPlayerColor.COLOR10 = "|cFF7EBFF1"
____exports.EPlayerColor.COLOR11 = "|cFFFFFC01"
____exports.EPlayerColor.COLOR12 = "|cFF0042FF"
____exports.EPlayerColor.COLOR13 = "|cFF282828"
____exports.EPlayerColor.COLOR14 = "|cFF282828"
____exports.EPlayerColor.COLOR15 = "|cFF282828"
____exports.EPlayerColor.COLOR16 = "|cFF282828"
return ____exports
 end,
}
return require("src.index", ...)
