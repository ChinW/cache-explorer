import * as $protobuf from "protobufjs";
/** Namespace CacheType. */
export namespace CacheType {

    /** Properties of a CommodityMsg. */
    interface ICommodityMsg {

        /** CommodityMsg id */
        id?: (string|null);

        /** CommodityMsg name */
        name?: (string|null);

        /** CommodityMsg price */
        price?: (number|null);

        /** CommodityMsg remainingQty */
        remainingQty?: (number|null);
    }

    /** Represents a CommodityMsg. */
    class CommodityMsg implements ICommodityMsg {

        /**
         * Constructs a new CommodityMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: CacheType.ICommodityMsg);

        /** CommodityMsg id. */
        public id: string;

        /** CommodityMsg name. */
        public name: string;

        /** CommodityMsg price. */
        public price: number;

        /** CommodityMsg remainingQty. */
        public remainingQty: number;

        /**
         * Creates a new CommodityMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommodityMsg instance
         */
        public static create(properties?: CacheType.ICommodityMsg): CacheType.CommodityMsg;

        /**
         * Encodes the specified CommodityMsg message. Does not implicitly {@link CacheType.CommodityMsg.verify|verify} messages.
         * @param message CommodityMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: CacheType.ICommodityMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommodityMsg message, length delimited. Does not implicitly {@link CacheType.CommodityMsg.verify|verify} messages.
         * @param message CommodityMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: CacheType.ICommodityMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommodityMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommodityMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CacheType.CommodityMsg;

        /**
         * Decodes a CommodityMsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommodityMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CacheType.CommodityMsg;

        /**
         * Verifies a CommodityMsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommodityMsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommodityMsg
         */
        public static fromObject(object: { [k: string]: any }): CacheType.CommodityMsg;

        /**
         * Creates a plain object from a CommodityMsg message. Also converts values to other types if specified.
         * @param message CommodityMsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: CacheType.CommodityMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommodityMsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** CountryMsg enum. */
    enum CountryMsg {
        None = 0,
        JP = 1,
        SG = 2,
        US = 3
    }

    /** Properties of an OrderMsg. */
    interface IOrderMsg {

        /** OrderMsg hzCustomId */
        hzCustomId?: (number|null);

        /** OrderMsg id */
        id?: (string|null);

        /** OrderMsg quantity */
        quantity?: (number|null);

        /** OrderMsg price */
        price?: (number|null);

        /** OrderMsg commodity */
        commodity?: (CacheType.ICommodityMsg|null);

        /** OrderMsg country */
        country?: (CacheType.CountryMsg|null);

        /** OrderMsg userId */
        userId?: (string|null);

        /** OrderMsg createdAt */
        createdAt?: (number|Long|null);

        /** OrderMsg timeCost */
        timeCost?: (number|null);
    }

    /** Represents an OrderMsg. */
    class OrderMsg implements IOrderMsg {

        /**
         * Constructs a new OrderMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: CacheType.IOrderMsg);

        /** OrderMsg hzCustomId. */
        public hzCustomId: number;

        /** OrderMsg id. */
        public id: string;

        /** OrderMsg quantity. */
        public quantity: number;

        /** OrderMsg price. */
        public price: number;

        /** OrderMsg commodity. */
        public commodity?: (CacheType.ICommodityMsg|null);

        /** OrderMsg country. */
        public country: CacheType.CountryMsg;

        /** OrderMsg userId. */
        public userId?: (string|null);

        /** OrderMsg createdAt. */
        public createdAt?: (number|Long|null);

        /** OrderMsg timeCost. */
        public timeCost?: (number|null);

        /** OrderMsg _userId. */
        public _userId?: "userId";

        /** OrderMsg _createdAt. */
        public _createdAt?: "createdAt";

        /** OrderMsg _timeCost. */
        public _timeCost?: "timeCost";

        /**
         * Creates a new OrderMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OrderMsg instance
         */
        public static create(properties?: CacheType.IOrderMsg): CacheType.OrderMsg;

        /**
         * Encodes the specified OrderMsg message. Does not implicitly {@link CacheType.OrderMsg.verify|verify} messages.
         * @param message OrderMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: CacheType.IOrderMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OrderMsg message, length delimited. Does not implicitly {@link CacheType.OrderMsg.verify|verify} messages.
         * @param message OrderMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: CacheType.IOrderMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OrderMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OrderMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CacheType.OrderMsg;

        /**
         * Decodes an OrderMsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OrderMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CacheType.OrderMsg;

        /**
         * Verifies an OrderMsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OrderMsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OrderMsg
         */
        public static fromObject(object: { [k: string]: any }): CacheType.OrderMsg;

        /**
         * Creates a plain object from an OrderMsg message. Also converts values to other types if specified.
         * @param message OrderMsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: CacheType.OrderMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OrderMsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
