"use strict";
/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var Long = require("long");
var Promise = require("bluebird");
var Path = require("path");
var JsonConfigLocator_1 = require("./config/JsonConfigLocator");
var Predicate_1 = require("./core/Predicate");
var Address_1 = require("./Address");
function assertNotNull(v) {
    assert.notEqual(v, null, 'Non null value expected.');
}
exports.assertNotNull = assertNotNull;
function assertArray(x) {
    assert(Array.isArray(x), 'Should be array.');
}
exports.assertArray = assertArray;
function assertString(v) {
    assert(typeof v === 'string', 'String value expected.');
}
exports.assertString = assertString;
function shuffleArray(array) {
    var randomIndex;
    var temp;
    for (var i = array.length; i > 1; i--) {
        randomIndex = Math.floor(Math.random() * i);
        temp = array[i - 1];
        array[i - 1] = array[randomIndex];
        array[randomIndex] = temp;
    }
}
exports.shuffleArray = shuffleArray;
function assertNotNegative(v, message) {
    if (message === void 0) { message = 'The value cannot be negative.'; }
    assert(v >= 0, message);
}
exports.assertNotNegative = assertNotNegative;
function getType(obj) {
    assertNotNull(obj);
    if (Long.isLong(obj)) {
        return 'long';
    }
    else {
        var t = typeof obj;
        if (t !== 'object') {
            return t;
        }
        else {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
    }
}
exports.getType = getType;
function enumFromString(enumType, value) {
    return enumType[value];
}
exports.enumFromString = enumFromString;
function getSortedQueryResultSet(list, predicate) {
    if (list.length === 0) {
        return list;
    }
    var comparatorObject = predicate.getComparator();
    if (comparatorObject == null) {
        comparatorObject = createComparator(predicate.getIterationType());
    }
    list.sort(comparatorObject.sort.bind(comparatorObject));
    var nearestAnchorEntry = (predicate == null) ? null : predicate.getNearestAnchorEntry();
    var nearestPage = nearestAnchorEntry[0];
    var page = predicate.getPage();
    var pageSize = predicate.getPageSize();
    var begin = pageSize * (page - nearestPage - 1);
    var size = list.length;
    if (begin > size) {
        return [];
    }
    var end = begin + pageSize;
    if (end > size) {
        end = size;
    }
    setAnchor(list, predicate, nearestPage);
    var iterationType = predicate.getIterationType();
    return list.slice(begin, end).map(function (item) {
        switch (iterationType) {
            case Predicate_1.IterationType.ENTRY:
                return item;
            case Predicate_1.IterationType.KEY:
                return item[0];
            case Predicate_1.IterationType.VALUE:
                return item[1];
        }
    });
}
exports.getSortedQueryResultSet = getSortedQueryResultSet;
function copyObjectShallow(obj) {
    if (obj === undefined || obj === null) {
        return obj;
    }
    if (typeof obj === 'object') {
        var newObj = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }
    assert(false, 'Object should be undefined or type of object.');
}
exports.copyObjectShallow = copyObjectShallow;
function tryGetBoolean(val) {
    if (typeof val === 'boolean') {
        return val;
    }
    else {
        throw new RangeError(val + ' is not a boolean.');
    }
}
exports.tryGetBoolean = tryGetBoolean;
function tryGetNumber(val) {
    if (typeof val === 'number') {
        return val;
    }
    else {
        throw new RangeError(val + ' is not a number.');
    }
}
exports.tryGetNumber = tryGetNumber;
function tryGetArray(val) {
    if (Array.isArray(val)) {
        return val;
    }
    else {
        throw new RangeError(val + ' is not an array.');
    }
}
exports.tryGetArray = tryGetArray;
function tryGetString(val) {
    if (typeof val === 'string') {
        return val;
    }
    else {
        throw new RangeError(val + ' is not a string.');
    }
}
exports.tryGetString = tryGetString;
function getStringOrUndefined(val) {
    try {
        return tryGetString(val);
    }
    catch (e) {
        return undefined;
    }
}
exports.getStringOrUndefined = getStringOrUndefined;
function getBooleanOrUndefined(val) {
    try {
        return tryGetBoolean(val);
    }
    catch (e) {
        return undefined;
    }
}
exports.getBooleanOrUndefined = getBooleanOrUndefined;
function tryGetEnum(enumClass, str) {
    var result = enumClass[str.toUpperCase()];
    if (result == null) {
        throw new TypeError(str + ' is not a member of the enum ' + enumClass);
    }
    return result;
}
exports.tryGetEnum = tryGetEnum;
function resolvePath(path) {
    var basePath;
    if (process.env[JsonConfigLocator_1.JsonConfigLocator.ENV_VARIABLE_NAME]) {
        basePath = Path.dirname(process.env[JsonConfigLocator_1.JsonConfigLocator.ENV_VARIABLE_NAME]);
    }
    else {
        basePath = process.cwd();
    }
    return Path.resolve(basePath, path);
}
exports.resolvePath = resolvePath;
function loadNameFromPath(path, exportedName) {
    var requirePath = require(resolvePath(path));
    if (exportedName === undefined) {
        return requirePath;
    }
    else {
        return require(resolvePath(path))[exportedName];
    }
}
exports.loadNameFromPath = loadNameFromPath;
var AddressHelper = /** @class */ (function () {
    function AddressHelper() {
    }
    AddressHelper.getSocketAddresses = function (address) {
        var addressHolder = this.createAddressFromString(address, -1);
        var possiblePort = addressHolder.port;
        var maxPortTryCount = 1;
        if (possiblePort === -1) {
            maxPortTryCount = AddressHelper.MAX_PORT_TRIES;
            possiblePort = AddressHelper.INITIAL_FIRST_PORT;
        }
        var addresses = [];
        for (var i = 0; i < maxPortTryCount; i++) {
            addresses.push(new Address_1.Address(addressHolder.host, possiblePort + i));
        }
        return addresses;
    };
    AddressHelper.createAddressFromString = function (address, defaultPort) {
        var indexBracketStart = address.indexOf('[');
        var indexBracketEnd = address.indexOf(']', indexBracketStart);
        var indexColon = address.indexOf(':');
        var lastIndexColon = address.lastIndexOf(':');
        var host;
        var port = defaultPort;
        if (indexColon > -1 && lastIndexColon > indexColon) {
            // IPv6
            if (indexBracketStart === 0 && indexBracketEnd > indexBracketStart) {
                host = address.substring(indexBracketStart + 1, indexBracketEnd);
                if (lastIndexColon === indexBracketEnd + 1) {
                    port = Number.parseInt(address.substring(lastIndexColon + 1));
                }
            }
            else {
                host = address;
            }
        }
        else if (indexColon > 0 && indexColon === lastIndexColon) {
            host = address.substring(0, indexColon);
            port = Number.parseInt(address.substring(indexColon + 1));
        }
        else {
            host = address;
        }
        return new Address_1.Address(host, port);
    };
    AddressHelper.MAX_PORT_TRIES = 3;
    AddressHelper.INITIAL_FIRST_PORT = 5701;
    return AddressHelper;
}());
exports.AddressHelper = AddressHelper;
function mergeJson(base, other) {
    for (var key in other) {
        if (Array.isArray(base[key]) && Array.isArray(other[key])) {
            base[key] = base[key].concat(other[key]);
        }
        else if (typeof base[key] === 'object' && typeof other[key] === 'object') {
            mergeJson(base[key], other[key]);
        }
        else {
            base[key] = other[key];
        }
    }
}
exports.mergeJson = mergeJson;
/**
 * Returns a random integer between 0(inclusive) and `upperBound`(exclusive)
 * Upper bound should be an integer.
 * @param upperBound
 * @returns A random integer between [0-upperBound)
 */
function randomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}
exports.randomInt = randomInt;
function createComparator(iterationType) {
    var object = {
        sort: function (a, b) {
            return 0;
        },
    };
    switch (iterationType) {
        case Predicate_1.IterationType.KEY:
            object.sort = function (e1, e2) { return e1[0] < e2[0] ? -1 : +(e1[0] > e2[0]); };
            break;
        case Predicate_1.IterationType.ENTRY:
            object.sort = function (e1, e2) { return e1[1] < e2[1] ? -1 : +(e1[1] > e2[1]); };
            break;
        case Predicate_1.IterationType.VALUE:
            object.sort = function (e1, e2) { return e1[1] < e2[1] ? -1 : +(e1[1] > e2[1]); };
            break;
    }
    return object;
}
function setAnchor(list, predicate, nearestPage) {
    assert(list.length > 0);
    var size = list.length;
    var pageSize = predicate.getPageSize();
    var page = predicate.getPage();
    for (var i = pageSize; i <= size && nearestPage < page; i += pageSize) {
        var anchor = list[i - 1];
        nearestPage++;
        predicate.setAnchor(nearestPage, anchor);
    }
}
var Task = /** @class */ (function () {
    function Task() {
    }
    return Task;
}());
exports.Task = Task;
function scheduleWithRepetition(callback, initialDelay, periodMillis) {
    var task = new Task();
    task.timeoutId = setTimeout(function () {
        callback();
        task.intervalId = setInterval(callback, periodMillis);
    }, initialDelay);
    return task;
}
exports.scheduleWithRepetition = scheduleWithRepetition;
function cancelRepetitionTask(task) {
    if (task.intervalId != null) {
        clearInterval(task.intervalId);
    }
    else if (task.timeoutId != null) {
        clearTimeout(task.timeoutId);
    }
}
exports.cancelRepetitionTask = cancelRepetitionTask;
function DeferredPromise() {
    var resolve;
    var reject;
    var promise = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise,
    };
}
exports.DeferredPromise = DeferredPromise;
function getNodejsMajorVersion() {
    var versionString = process.version;
    var versions = versionString.split('.');
    return Number.parseInt(versions[0].substr(1));
}
exports.getNodejsMajorVersion = getNodejsMajorVersion;
function pad(str, targetLength, padString) {
    if (str.length >= targetLength) {
        return str;
    }
    else {
        return new Array(targetLength - str.length + 1).join(padString) + str;
    }
}
exports.pad = pad;
//# sourceMappingURL=Util.js.map