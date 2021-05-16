/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.CacheType = (function() {

    /**
     * Namespace CacheType.
     * @exports CacheType
     * @namespace
     */
    var CacheType = {};

    CacheType.CommodityMsg = (function() {

        /**
         * Properties of a CommodityMsg.
         * @memberof CacheType
         * @interface ICommodityMsg
         * @property {string|null} [id] CommodityMsg id
         * @property {string|null} [name] CommodityMsg name
         * @property {number|null} [price] CommodityMsg price
         * @property {number|null} [remainingQty] CommodityMsg remainingQty
         */

        /**
         * Constructs a new CommodityMsg.
         * @memberof CacheType
         * @classdesc Represents a CommodityMsg.
         * @implements ICommodityMsg
         * @constructor
         * @param {CacheType.ICommodityMsg=} [properties] Properties to set
         */
        function CommodityMsg(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommodityMsg id.
         * @member {string} id
         * @memberof CacheType.CommodityMsg
         * @instance
         */
        CommodityMsg.prototype.id = "";

        /**
         * CommodityMsg name.
         * @member {string} name
         * @memberof CacheType.CommodityMsg
         * @instance
         */
        CommodityMsg.prototype.name = "";

        /**
         * CommodityMsg price.
         * @member {number} price
         * @memberof CacheType.CommodityMsg
         * @instance
         */
        CommodityMsg.prototype.price = 0;

        /**
         * CommodityMsg remainingQty.
         * @member {number} remainingQty
         * @memberof CacheType.CommodityMsg
         * @instance
         */
        CommodityMsg.prototype.remainingQty = 0;

        /**
         * Creates a new CommodityMsg instance using the specified properties.
         * @function create
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {CacheType.ICommodityMsg=} [properties] Properties to set
         * @returns {CacheType.CommodityMsg} CommodityMsg instance
         */
        CommodityMsg.create = function create(properties) {
            return new CommodityMsg(properties);
        };

        /**
         * Encodes the specified CommodityMsg message. Does not implicitly {@link CacheType.CommodityMsg.verify|verify} messages.
         * @function encode
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {CacheType.ICommodityMsg} message CommodityMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommodityMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.price);
            if (message.remainingQty != null && Object.hasOwnProperty.call(message, "remainingQty"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.remainingQty);
            return writer;
        };

        /**
         * Encodes the specified CommodityMsg message, length delimited. Does not implicitly {@link CacheType.CommodityMsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {CacheType.ICommodityMsg} message CommodityMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommodityMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommodityMsg message from the specified reader or buffer.
         * @function decode
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CacheType.CommodityMsg} CommodityMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommodityMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CacheType.CommodityMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.price = reader.double();
                    break;
                case 4:
                    message.remainingQty = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommodityMsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CacheType.CommodityMsg} CommodityMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommodityMsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommodityMsg message.
         * @function verify
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommodityMsg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.price != null && message.hasOwnProperty("price"))
                if (typeof message.price !== "number")
                    return "price: number expected";
            if (message.remainingQty != null && message.hasOwnProperty("remainingQty"))
                if (typeof message.remainingQty !== "number")
                    return "remainingQty: number expected";
            return null;
        };

        /**
         * Creates a CommodityMsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CacheType.CommodityMsg} CommodityMsg
         */
        CommodityMsg.fromObject = function fromObject(object) {
            if (object instanceof $root.CacheType.CommodityMsg)
                return object;
            var message = new $root.CacheType.CommodityMsg();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.price != null)
                message.price = Number(object.price);
            if (object.remainingQty != null)
                message.remainingQty = Number(object.remainingQty);
            return message;
        };

        /**
         * Creates a plain object from a CommodityMsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CacheType.CommodityMsg
         * @static
         * @param {CacheType.CommodityMsg} message CommodityMsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommodityMsg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.price = 0;
                object.remainingQty = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = options.json && !isFinite(message.price) ? String(message.price) : message.price;
            if (message.remainingQty != null && message.hasOwnProperty("remainingQty"))
                object.remainingQty = options.json && !isFinite(message.remainingQty) ? String(message.remainingQty) : message.remainingQty;
            return object;
        };

        /**
         * Converts this CommodityMsg to JSON.
         * @function toJSON
         * @memberof CacheType.CommodityMsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommodityMsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommodityMsg;
    })();

    /**
     * CountryMsg enum.
     * @name CacheType.CountryMsg
     * @enum {number}
     * @property {number} None=0 None value
     * @property {number} JP=1 JP value
     * @property {number} SG=2 SG value
     * @property {number} US=3 US value
     */
    CacheType.CountryMsg = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[1] = "JP"] = 1;
        values[valuesById[2] = "SG"] = 2;
        values[valuesById[3] = "US"] = 3;
        return values;
    })();

    CacheType.OrderMsg = (function() {

        /**
         * Properties of an OrderMsg.
         * @memberof CacheType
         * @interface IOrderMsg
         * @property {number|null} [hzCustomId] OrderMsg hzCustomId
         * @property {string|null} [id] OrderMsg id
         * @property {number|null} [quantity] OrderMsg quantity
         * @property {number|null} [price] OrderMsg price
         * @property {CacheType.ICommodityMsg|null} [commodity] OrderMsg commodity
         * @property {CacheType.CountryMsg|null} [country] OrderMsg country
         * @property {string|null} [userId] OrderMsg userId
         * @property {number|Long|null} [createdAt] OrderMsg createdAt
         * @property {number|null} [timeCost] OrderMsg timeCost
         */

        /**
         * Constructs a new OrderMsg.
         * @memberof CacheType
         * @classdesc Represents an OrderMsg.
         * @implements IOrderMsg
         * @constructor
         * @param {CacheType.IOrderMsg=} [properties] Properties to set
         */
        function OrderMsg(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OrderMsg hzCustomId.
         * @member {number} hzCustomId
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.hzCustomId = 0;

        /**
         * OrderMsg id.
         * @member {string} id
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.id = "";

        /**
         * OrderMsg quantity.
         * @member {number} quantity
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.quantity = 0;

        /**
         * OrderMsg price.
         * @member {number} price
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.price = 0;

        /**
         * OrderMsg commodity.
         * @member {CacheType.ICommodityMsg|null|undefined} commodity
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.commodity = null;

        /**
         * OrderMsg country.
         * @member {CacheType.CountryMsg} country
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.country = 0;

        /**
         * OrderMsg userId.
         * @member {string|null|undefined} userId
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.userId = null;

        /**
         * OrderMsg createdAt.
         * @member {number|Long|null|undefined} createdAt
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.createdAt = null;

        /**
         * OrderMsg timeCost.
         * @member {number|null|undefined} timeCost
         * @memberof CacheType.OrderMsg
         * @instance
         */
        OrderMsg.prototype.timeCost = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * OrderMsg _userId.
         * @member {"userId"|undefined} _userId
         * @memberof CacheType.OrderMsg
         * @instance
         */
        Object.defineProperty(OrderMsg.prototype, "_userId", {
            get: $util.oneOfGetter($oneOfFields = ["userId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * OrderMsg _createdAt.
         * @member {"createdAt"|undefined} _createdAt
         * @memberof CacheType.OrderMsg
         * @instance
         */
        Object.defineProperty(OrderMsg.prototype, "_createdAt", {
            get: $util.oneOfGetter($oneOfFields = ["createdAt"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * OrderMsg _timeCost.
         * @member {"timeCost"|undefined} _timeCost
         * @memberof CacheType.OrderMsg
         * @instance
         */
        Object.defineProperty(OrderMsg.prototype, "_timeCost", {
            get: $util.oneOfGetter($oneOfFields = ["timeCost"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new OrderMsg instance using the specified properties.
         * @function create
         * @memberof CacheType.OrderMsg
         * @static
         * @param {CacheType.IOrderMsg=} [properties] Properties to set
         * @returns {CacheType.OrderMsg} OrderMsg instance
         */
        OrderMsg.create = function create(properties) {
            return new OrderMsg(properties);
        };

        /**
         * Encodes the specified OrderMsg message. Does not implicitly {@link CacheType.OrderMsg.verify|verify} messages.
         * @function encode
         * @memberof CacheType.OrderMsg
         * @static
         * @param {CacheType.IOrderMsg} message OrderMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.quantity != null && Object.hasOwnProperty.call(message, "quantity"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.quantity);
            if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.price);
            if (message.commodity != null && Object.hasOwnProperty.call(message, "commodity"))
                $root.CacheType.CommodityMsg.encode(message.commodity, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.country != null && Object.hasOwnProperty.call(message, "country"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.country);
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.userId);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.createdAt);
            if (message.timeCost != null && Object.hasOwnProperty.call(message, "timeCost"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.timeCost);
            if (message.hzCustomId != null && Object.hasOwnProperty.call(message, "hzCustomId"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.hzCustomId);
            return writer;
        };

        /**
         * Encodes the specified OrderMsg message, length delimited. Does not implicitly {@link CacheType.OrderMsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CacheType.OrderMsg
         * @static
         * @param {CacheType.IOrderMsg} message OrderMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OrderMsg message from the specified reader or buffer.
         * @function decode
         * @memberof CacheType.OrderMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CacheType.OrderMsg} OrderMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CacheType.OrderMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 9:
                    message.hzCustomId = reader.int32();
                    break;
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.quantity = reader.int32();
                    break;
                case 3:
                    message.price = reader.float();
                    break;
                case 4:
                    message.commodity = $root.CacheType.CommodityMsg.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.country = reader.int32();
                    break;
                case 6:
                    message.userId = reader.string();
                    break;
                case 7:
                    message.createdAt = reader.int64();
                    break;
                case 8:
                    message.timeCost = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OrderMsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CacheType.OrderMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CacheType.OrderMsg} OrderMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderMsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OrderMsg message.
         * @function verify
         * @memberof CacheType.OrderMsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OrderMsg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.hzCustomId != null && message.hasOwnProperty("hzCustomId"))
                if (!$util.isInteger(message.hzCustomId))
                    return "hzCustomId: integer expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.quantity != null && message.hasOwnProperty("quantity"))
                if (!$util.isInteger(message.quantity))
                    return "quantity: integer expected";
            if (message.price != null && message.hasOwnProperty("price"))
                if (typeof message.price !== "number")
                    return "price: number expected";
            if (message.commodity != null && message.hasOwnProperty("commodity")) {
                var error = $root.CacheType.CommodityMsg.verify(message.commodity);
                if (error)
                    return "commodity." + error;
            }
            if (message.country != null && message.hasOwnProperty("country"))
                switch (message.country) {
                default:
                    return "country: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.userId != null && message.hasOwnProperty("userId")) {
                properties._userId = 1;
                if (!$util.isString(message.userId))
                    return "userId: string expected";
            }
            if (message.createdAt != null && message.hasOwnProperty("createdAt")) {
                properties._createdAt = 1;
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            }
            if (message.timeCost != null && message.hasOwnProperty("timeCost")) {
                properties._timeCost = 1;
                if (!$util.isInteger(message.timeCost))
                    return "timeCost: integer expected";
            }
            return null;
        };

        /**
         * Creates an OrderMsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CacheType.OrderMsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CacheType.OrderMsg} OrderMsg
         */
        OrderMsg.fromObject = function fromObject(object) {
            if (object instanceof $root.CacheType.OrderMsg)
                return object;
            var message = new $root.CacheType.OrderMsg();
            if (object.hzCustomId != null)
                message.hzCustomId = object.hzCustomId | 0;
            if (object.id != null)
                message.id = String(object.id);
            if (object.quantity != null)
                message.quantity = object.quantity | 0;
            if (object.price != null)
                message.price = Number(object.price);
            if (object.commodity != null) {
                if (typeof object.commodity !== "object")
                    throw TypeError(".CacheType.OrderMsg.commodity: object expected");
                message.commodity = $root.CacheType.CommodityMsg.fromObject(object.commodity);
            }
            switch (object.country) {
            case "None":
            case 0:
                message.country = 0;
                break;
            case "JP":
            case 1:
                message.country = 1;
                break;
            case "SG":
            case 2:
                message.country = 2;
                break;
            case "US":
            case 3:
                message.country = 3;
                break;
            }
            if (object.userId != null)
                message.userId = String(object.userId);
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
            if (object.timeCost != null)
                message.timeCost = object.timeCost | 0;
            return message;
        };

        /**
         * Creates a plain object from an OrderMsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CacheType.OrderMsg
         * @static
         * @param {CacheType.OrderMsg} message OrderMsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OrderMsg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.quantity = 0;
                object.price = 0;
                object.commodity = null;
                object.country = options.enums === String ? "None" : 0;
                object.hzCustomId = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.quantity != null && message.hasOwnProperty("quantity"))
                object.quantity = message.quantity;
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = options.json && !isFinite(message.price) ? String(message.price) : message.price;
            if (message.commodity != null && message.hasOwnProperty("commodity"))
                object.commodity = $root.CacheType.CommodityMsg.toObject(message.commodity, options);
            if (message.country != null && message.hasOwnProperty("country"))
                object.country = options.enums === String ? $root.CacheType.CountryMsg[message.country] : message.country;
            if (message.userId != null && message.hasOwnProperty("userId")) {
                object.userId = message.userId;
                if (options.oneofs)
                    object._userId = "userId";
            }
            if (message.createdAt != null && message.hasOwnProperty("createdAt")) {
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
                if (options.oneofs)
                    object._createdAt = "createdAt";
            }
            if (message.timeCost != null && message.hasOwnProperty("timeCost")) {
                object.timeCost = message.timeCost;
                if (options.oneofs)
                    object._timeCost = "timeCost";
            }
            if (message.hzCustomId != null && message.hasOwnProperty("hzCustomId"))
                object.hzCustomId = message.hzCustomId;
            return object;
        };

        /**
         * Converts this OrderMsg to JSON.
         * @function toJSON
         * @memberof CacheType.OrderMsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OrderMsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OrderMsg;
    })();

    return CacheType;
})();

module.exports = $root;
