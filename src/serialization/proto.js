/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Network = (function() {

    /**
     * Properties of a Network.
     * @exports INetwork
     * @interface INetwork
     * @property {IStatus|null} [status] Network status
     * @property {IStatusReturn|null} [statusReturn] Network statusReturn
     * @property {IPing|null} [ping] Network ping
     * @property {IPingReturn|null} [pingReturn] Network pingReturn
     * @property {IPutTx|null} [putTx] Network putTx
     * @property {IPutTxReturn|null} [putTxReturn] Network putTxReturn
     * @property {IGetTxs|null} [getTxs] Network getTxs
     * @property {IGetTxsReturn|null} [getTxsReturn] Network getTxsReturn
     * @property {IPutBlock|null} [putBlock] Network putBlock
     * @property {IPutBlockReturn|null} [putBlockReturn] Network putBlockReturn
     * @property {IGetBlocksByHash|null} [getBlocksByHash] Network getBlocksByHash
     * @property {IGetBlocksByHashReturn|null} [getBlocksByHashReturn] Network getBlocksByHashReturn
     * @property {IGetHeadersByHash|null} [getHeadersByHash] Network getHeadersByHash
     * @property {IGetHeadersByHashReturn|null} [getHeadersByHashReturn] Network getHeadersByHashReturn
     * @property {IGetBlocksByRange|null} [getBlocksByRange] Network getBlocksByRange
     * @property {IGetBlocksByRangeReturn|null} [getBlocksByRangeReturn] Network getBlocksByRangeReturn
     * @property {IGetHeadersByRange|null} [getHeadersByRange] Network getHeadersByRange
     * @property {IGetHeadersByRangeReturn|null} [getHeadersByRangeReturn] Network getHeadersByRangeReturn
     * @property {IGetPeers|null} [getPeers] Network getPeers
     * @property {IGetPeersReturn|null} [getPeersReturn] Network getPeersReturn
     * @property {IGetTip|null} [getTip] Network getTip
     * @property {IGetTipReturn|null} [getTipReturn] Network getTipReturn
     * @property {IPutHeaders|null} [putHeaders] Network putHeaders
     * @property {IPutHeadersReturn|null} [putHeadersReturn] Network putHeadersReturn
     * @property {IGetHash|null} [getHash] Network getHash
     * @property {IGetHashReturn|null} [getHashReturn] Network getHashReturn
     * @property {IGetBlockTxs|null} [getBlockTxs] Network getBlockTxs
     * @property {IGetBlockTxsReturn|null} [getBlockTxsReturn] Network getBlockTxsReturn
     * @property {IPutBlockTxs|null} [putBlockTxs] Network putBlockTxs
     * @property {IPutBlockTxsReturn|null} [putBlockTxsReturn] Network putBlockTxsReturn
     */

    /**
     * Constructs a new Network.
     * @exports Network
     * @classdesc Represents a Network.
     * @implements INetwork
     * @constructor
     * @param {INetwork=} [properties] Properties to set
     */
    function Network(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Network status.
     * @member {IStatus|null|undefined} status
     * @memberof Network
     * @instance
     */
    Network.prototype.status = null;

    /**
     * Network statusReturn.
     * @member {IStatusReturn|null|undefined} statusReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.statusReturn = null;

    /**
     * Network ping.
     * @member {IPing|null|undefined} ping
     * @memberof Network
     * @instance
     */
    Network.prototype.ping = null;

    /**
     * Network pingReturn.
     * @member {IPingReturn|null|undefined} pingReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.pingReturn = null;

    /**
     * Network putTx.
     * @member {IPutTx|null|undefined} putTx
     * @memberof Network
     * @instance
     */
    Network.prototype.putTx = null;

    /**
     * Network putTxReturn.
     * @member {IPutTxReturn|null|undefined} putTxReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.putTxReturn = null;

    /**
     * Network getTxs.
     * @member {IGetTxs|null|undefined} getTxs
     * @memberof Network
     * @instance
     */
    Network.prototype.getTxs = null;

    /**
     * Network getTxsReturn.
     * @member {IGetTxsReturn|null|undefined} getTxsReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getTxsReturn = null;

    /**
     * Network putBlock.
     * @member {IPutBlock|null|undefined} putBlock
     * @memberof Network
     * @instance
     */
    Network.prototype.putBlock = null;

    /**
     * Network putBlockReturn.
     * @member {IPutBlockReturn|null|undefined} putBlockReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.putBlockReturn = null;

    /**
     * Network getBlocksByHash.
     * @member {IGetBlocksByHash|null|undefined} getBlocksByHash
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlocksByHash = null;

    /**
     * Network getBlocksByHashReturn.
     * @member {IGetBlocksByHashReturn|null|undefined} getBlocksByHashReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlocksByHashReturn = null;

    /**
     * Network getHeadersByHash.
     * @member {IGetHeadersByHash|null|undefined} getHeadersByHash
     * @memberof Network
     * @instance
     */
    Network.prototype.getHeadersByHash = null;

    /**
     * Network getHeadersByHashReturn.
     * @member {IGetHeadersByHashReturn|null|undefined} getHeadersByHashReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getHeadersByHashReturn = null;

    /**
     * Network getBlocksByRange.
     * @member {IGetBlocksByRange|null|undefined} getBlocksByRange
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlocksByRange = null;

    /**
     * Network getBlocksByRangeReturn.
     * @member {IGetBlocksByRangeReturn|null|undefined} getBlocksByRangeReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlocksByRangeReturn = null;

    /**
     * Network getHeadersByRange.
     * @member {IGetHeadersByRange|null|undefined} getHeadersByRange
     * @memberof Network
     * @instance
     */
    Network.prototype.getHeadersByRange = null;

    /**
     * Network getHeadersByRangeReturn.
     * @member {IGetHeadersByRangeReturn|null|undefined} getHeadersByRangeReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getHeadersByRangeReturn = null;

    /**
     * Network getPeers.
     * @member {IGetPeers|null|undefined} getPeers
     * @memberof Network
     * @instance
     */
    Network.prototype.getPeers = null;

    /**
     * Network getPeersReturn.
     * @member {IGetPeersReturn|null|undefined} getPeersReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getPeersReturn = null;

    /**
     * Network getTip.
     * @member {IGetTip|null|undefined} getTip
     * @memberof Network
     * @instance
     */
    Network.prototype.getTip = null;

    /**
     * Network getTipReturn.
     * @member {IGetTipReturn|null|undefined} getTipReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getTipReturn = null;

    /**
     * Network putHeaders.
     * @member {IPutHeaders|null|undefined} putHeaders
     * @memberof Network
     * @instance
     */
    Network.prototype.putHeaders = null;

    /**
     * Network putHeadersReturn.
     * @member {IPutHeadersReturn|null|undefined} putHeadersReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.putHeadersReturn = null;

    /**
     * Network getHash.
     * @member {IGetHash|null|undefined} getHash
     * @memberof Network
     * @instance
     */
    Network.prototype.getHash = null;

    /**
     * Network getHashReturn.
     * @member {IGetHashReturn|null|undefined} getHashReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getHashReturn = null;

    /**
     * Network getBlockTxs.
     * @member {IGetBlockTxs|null|undefined} getBlockTxs
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlockTxs = null;

    /**
     * Network getBlockTxsReturn.
     * @member {IGetBlockTxsReturn|null|undefined} getBlockTxsReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.getBlockTxsReturn = null;

    /**
     * Network putBlockTxs.
     * @member {IPutBlockTxs|null|undefined} putBlockTxs
     * @memberof Network
     * @instance
     */
    Network.prototype.putBlockTxs = null;

    /**
     * Network putBlockTxsReturn.
     * @member {IPutBlockTxsReturn|null|undefined} putBlockTxsReturn
     * @memberof Network
     * @instance
     */
    Network.prototype.putBlockTxsReturn = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Network request.
     * @member {"status"|"statusReturn"|"ping"|"pingReturn"|"putTx"|"putTxReturn"|"getTxs"|"getTxsReturn"|"putBlock"|"putBlockReturn"|"getBlocksByHash"|"getBlocksByHashReturn"|"getHeadersByHash"|"getHeadersByHashReturn"|"getBlocksByRange"|"getBlocksByRangeReturn"|"getHeadersByRange"|"getHeadersByRangeReturn"|"getPeers"|"getPeersReturn"|"getTip"|"getTipReturn"|"putHeaders"|"putHeadersReturn"|"getHash"|"getHashReturn"|"getBlockTxs"|"getBlockTxsReturn"|"putBlockTxs"|"putBlockTxsReturn"|undefined} request
     * @memberof Network
     * @instance
     */
    Object.defineProperty(Network.prototype, "request", {
        get: $util.oneOfGetter($oneOfFields = ["status", "statusReturn", "ping", "pingReturn", "putTx", "putTxReturn", "getTxs", "getTxsReturn", "putBlock", "putBlockReturn", "getBlocksByHash", "getBlocksByHashReturn", "getHeadersByHash", "getHeadersByHashReturn", "getBlocksByRange", "getBlocksByRangeReturn", "getHeadersByRange", "getHeadersByRangeReturn", "getPeers", "getPeersReturn", "getTip", "getTipReturn", "putHeaders", "putHeadersReturn", "getHash", "getHashReturn", "getBlockTxs", "getBlockTxsReturn", "putBlockTxs", "putBlockTxsReturn"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Network instance using the specified properties.
     * @function create
     * @memberof Network
     * @static
     * @param {INetwork=} [properties] Properties to set
     * @returns {Network} Network instance
     */
    Network.create = function create(properties) {
        return new Network(properties);
    };

    /**
     * Encodes the specified Network message. Does not implicitly {@link Network.verify|verify} messages.
     * @function encode
     * @memberof Network
     * @static
     * @param {INetwork} message Network message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Network.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && message.hasOwnProperty("status"))
            $root.Status.encode(message.status, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.statusReturn != null && message.hasOwnProperty("statusReturn"))
            $root.StatusReturn.encode(message.statusReturn, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.ping != null && message.hasOwnProperty("ping"))
            $root.Ping.encode(message.ping, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.pingReturn != null && message.hasOwnProperty("pingReturn"))
            $root.PingReturn.encode(message.pingReturn, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.putTx != null && message.hasOwnProperty("putTx"))
            $root.PutTx.encode(message.putTx, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.putTxReturn != null && message.hasOwnProperty("putTxReturn"))
            $root.PutTxReturn.encode(message.putTxReturn, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.getTxs != null && message.hasOwnProperty("getTxs"))
            $root.GetTxs.encode(message.getTxs, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.getTxsReturn != null && message.hasOwnProperty("getTxsReturn"))
            $root.GetTxsReturn.encode(message.getTxsReturn, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.putBlock != null && message.hasOwnProperty("putBlock"))
            $root.PutBlock.encode(message.putBlock, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.putBlockReturn != null && message.hasOwnProperty("putBlockReturn"))
            $root.PutBlockReturn.encode(message.putBlockReturn, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.getBlocksByHash != null && message.hasOwnProperty("getBlocksByHash"))
            $root.GetBlocksByHash.encode(message.getBlocksByHash, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.getBlocksByHashReturn != null && message.hasOwnProperty("getBlocksByHashReturn"))
            $root.GetBlocksByHashReturn.encode(message.getBlocksByHashReturn, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.getHeadersByHash != null && message.hasOwnProperty("getHeadersByHash"))
            $root.GetHeadersByHash.encode(message.getHeadersByHash, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.getHeadersByHashReturn != null && message.hasOwnProperty("getHeadersByHashReturn"))
            $root.GetHeadersByHashReturn.encode(message.getHeadersByHashReturn, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
        if (message.getBlocksByRange != null && message.hasOwnProperty("getBlocksByRange"))
            $root.GetBlocksByRange.encode(message.getBlocksByRange, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
        if (message.getBlocksByRangeReturn != null && message.hasOwnProperty("getBlocksByRangeReturn"))
            $root.GetBlocksByRangeReturn.encode(message.getBlocksByRangeReturn, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
        if (message.getHeadersByRange != null && message.hasOwnProperty("getHeadersByRange"))
            $root.GetHeadersByRange.encode(message.getHeadersByRange, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
        if (message.getHeadersByRangeReturn != null && message.hasOwnProperty("getHeadersByRangeReturn"))
            $root.GetHeadersByRangeReturn.encode(message.getHeadersByRangeReturn, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
        if (message.getPeers != null && message.hasOwnProperty("getPeers"))
            $root.GetPeers.encode(message.getPeers, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
        if (message.getPeersReturn != null && message.hasOwnProperty("getPeersReturn"))
            $root.GetPeersReturn.encode(message.getPeersReturn, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
        if (message.getTip != null && message.hasOwnProperty("getTip"))
            $root.GetTip.encode(message.getTip, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
        if (message.getTipReturn != null && message.hasOwnProperty("getTipReturn"))
            $root.GetTipReturn.encode(message.getTipReturn, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
        if (message.putHeaders != null && message.hasOwnProperty("putHeaders"))
            $root.PutHeaders.encode(message.putHeaders, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
        if (message.putHeadersReturn != null && message.hasOwnProperty("putHeadersReturn"))
            $root.PutHeadersReturn.encode(message.putHeadersReturn, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
        if (message.getHash != null && message.hasOwnProperty("getHash"))
            $root.GetHash.encode(message.getHash, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
        if (message.getHashReturn != null && message.hasOwnProperty("getHashReturn"))
            $root.GetHashReturn.encode(message.getHashReturn, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
        if (message.getBlockTxs != null && message.hasOwnProperty("getBlockTxs"))
            $root.GetBlockTxs.encode(message.getBlockTxs, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
        if (message.getBlockTxsReturn != null && message.hasOwnProperty("getBlockTxsReturn"))
            $root.GetBlockTxsReturn.encode(message.getBlockTxsReturn, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
        if (message.putBlockTxs != null && message.hasOwnProperty("putBlockTxs"))
            $root.PutBlockTxs.encode(message.putBlockTxs, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
        if (message.putBlockTxsReturn != null && message.hasOwnProperty("putBlockTxsReturn"))
            $root.PutBlockTxsReturn.encode(message.putBlockTxsReturn, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Network message, length delimited. Does not implicitly {@link Network.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Network
     * @static
     * @param {INetwork} message Network message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Network.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Network message from the specified reader or buffer.
     * @function decode
     * @memberof Network
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Network} Network
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Network.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Network();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.status = $root.Status.decode(reader, reader.uint32());
                break;
            case 2:
                message.statusReturn = $root.StatusReturn.decode(reader, reader.uint32());
                break;
            case 3:
                message.ping = $root.Ping.decode(reader, reader.uint32());
                break;
            case 4:
                message.pingReturn = $root.PingReturn.decode(reader, reader.uint32());
                break;
            case 5:
                message.putTx = $root.PutTx.decode(reader, reader.uint32());
                break;
            case 6:
                message.putTxReturn = $root.PutTxReturn.decode(reader, reader.uint32());
                break;
            case 7:
                message.getTxs = $root.GetTxs.decode(reader, reader.uint32());
                break;
            case 8:
                message.getTxsReturn = $root.GetTxsReturn.decode(reader, reader.uint32());
                break;
            case 9:
                message.putBlock = $root.PutBlock.decode(reader, reader.uint32());
                break;
            case 10:
                message.putBlockReturn = $root.PutBlockReturn.decode(reader, reader.uint32());
                break;
            case 11:
                message.getBlocksByHash = $root.GetBlocksByHash.decode(reader, reader.uint32());
                break;
            case 12:
                message.getBlocksByHashReturn = $root.GetBlocksByHashReturn.decode(reader, reader.uint32());
                break;
            case 13:
                message.getHeadersByHash = $root.GetHeadersByHash.decode(reader, reader.uint32());
                break;
            case 14:
                message.getHeadersByHashReturn = $root.GetHeadersByHashReturn.decode(reader, reader.uint32());
                break;
            case 15:
                message.getBlocksByRange = $root.GetBlocksByRange.decode(reader, reader.uint32());
                break;
            case 16:
                message.getBlocksByRangeReturn = $root.GetBlocksByRangeReturn.decode(reader, reader.uint32());
                break;
            case 17:
                message.getHeadersByRange = $root.GetHeadersByRange.decode(reader, reader.uint32());
                break;
            case 18:
                message.getHeadersByRangeReturn = $root.GetHeadersByRangeReturn.decode(reader, reader.uint32());
                break;
            case 19:
                message.getPeers = $root.GetPeers.decode(reader, reader.uint32());
                break;
            case 20:
                message.getPeersReturn = $root.GetPeersReturn.decode(reader, reader.uint32());
                break;
            case 21:
                message.getTip = $root.GetTip.decode(reader, reader.uint32());
                break;
            case 22:
                message.getTipReturn = $root.GetTipReturn.decode(reader, reader.uint32());
                break;
            case 23:
                message.putHeaders = $root.PutHeaders.decode(reader, reader.uint32());
                break;
            case 24:
                message.putHeadersReturn = $root.PutHeadersReturn.decode(reader, reader.uint32());
                break;
            case 25:
                message.getHash = $root.GetHash.decode(reader, reader.uint32());
                break;
            case 26:
                message.getHashReturn = $root.GetHashReturn.decode(reader, reader.uint32());
                break;
            case 27:
                message.getBlockTxs = $root.GetBlockTxs.decode(reader, reader.uint32());
                break;
            case 28:
                message.getBlockTxsReturn = $root.GetBlockTxsReturn.decode(reader, reader.uint32());
                break;
            case 29:
                message.putBlockTxs = $root.PutBlockTxs.decode(reader, reader.uint32());
                break;
            case 30:
                message.putBlockTxsReturn = $root.PutBlockTxsReturn.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Network message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Network
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Network} Network
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Network.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Network message.
     * @function verify
     * @memberof Network
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Network.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.status != null && message.hasOwnProperty("status")) {
            properties.request = 1;
            {
                var error = $root.Status.verify(message.status);
                if (error)
                    return "status." + error;
            }
        }
        if (message.statusReturn != null && message.hasOwnProperty("statusReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.StatusReturn.verify(message.statusReturn);
                if (error)
                    return "statusReturn." + error;
            }
        }
        if (message.ping != null && message.hasOwnProperty("ping")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.Ping.verify(message.ping);
                if (error)
                    return "ping." + error;
            }
        }
        if (message.pingReturn != null && message.hasOwnProperty("pingReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PingReturn.verify(message.pingReturn);
                if (error)
                    return "pingReturn." + error;
            }
        }
        if (message.putTx != null && message.hasOwnProperty("putTx")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutTx.verify(message.putTx);
                if (error)
                    return "putTx." + error;
            }
        }
        if (message.putTxReturn != null && message.hasOwnProperty("putTxReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutTxReturn.verify(message.putTxReturn);
                if (error)
                    return "putTxReturn." + error;
            }
        }
        if (message.getTxs != null && message.hasOwnProperty("getTxs")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetTxs.verify(message.getTxs);
                if (error)
                    return "getTxs." + error;
            }
        }
        if (message.getTxsReturn != null && message.hasOwnProperty("getTxsReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetTxsReturn.verify(message.getTxsReturn);
                if (error)
                    return "getTxsReturn." + error;
            }
        }
        if (message.putBlock != null && message.hasOwnProperty("putBlock")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutBlock.verify(message.putBlock);
                if (error)
                    return "putBlock." + error;
            }
        }
        if (message.putBlockReturn != null && message.hasOwnProperty("putBlockReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutBlockReturn.verify(message.putBlockReturn);
                if (error)
                    return "putBlockReturn." + error;
            }
        }
        if (message.getBlocksByHash != null && message.hasOwnProperty("getBlocksByHash")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlocksByHash.verify(message.getBlocksByHash);
                if (error)
                    return "getBlocksByHash." + error;
            }
        }
        if (message.getBlocksByHashReturn != null && message.hasOwnProperty("getBlocksByHashReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlocksByHashReturn.verify(message.getBlocksByHashReturn);
                if (error)
                    return "getBlocksByHashReturn." + error;
            }
        }
        if (message.getHeadersByHash != null && message.hasOwnProperty("getHeadersByHash")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHeadersByHash.verify(message.getHeadersByHash);
                if (error)
                    return "getHeadersByHash." + error;
            }
        }
        if (message.getHeadersByHashReturn != null && message.hasOwnProperty("getHeadersByHashReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHeadersByHashReturn.verify(message.getHeadersByHashReturn);
                if (error)
                    return "getHeadersByHashReturn." + error;
            }
        }
        if (message.getBlocksByRange != null && message.hasOwnProperty("getBlocksByRange")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlocksByRange.verify(message.getBlocksByRange);
                if (error)
                    return "getBlocksByRange." + error;
            }
        }
        if (message.getBlocksByRangeReturn != null && message.hasOwnProperty("getBlocksByRangeReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlocksByRangeReturn.verify(message.getBlocksByRangeReturn);
                if (error)
                    return "getBlocksByRangeReturn." + error;
            }
        }
        if (message.getHeadersByRange != null && message.hasOwnProperty("getHeadersByRange")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHeadersByRange.verify(message.getHeadersByRange);
                if (error)
                    return "getHeadersByRange." + error;
            }
        }
        if (message.getHeadersByRangeReturn != null && message.hasOwnProperty("getHeadersByRangeReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHeadersByRangeReturn.verify(message.getHeadersByRangeReturn);
                if (error)
                    return "getHeadersByRangeReturn." + error;
            }
        }
        if (message.getPeers != null && message.hasOwnProperty("getPeers")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetPeers.verify(message.getPeers);
                if (error)
                    return "getPeers." + error;
            }
        }
        if (message.getPeersReturn != null && message.hasOwnProperty("getPeersReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetPeersReturn.verify(message.getPeersReturn);
                if (error)
                    return "getPeersReturn." + error;
            }
        }
        if (message.getTip != null && message.hasOwnProperty("getTip")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetTip.verify(message.getTip);
                if (error)
                    return "getTip." + error;
            }
        }
        if (message.getTipReturn != null && message.hasOwnProperty("getTipReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetTipReturn.verify(message.getTipReturn);
                if (error)
                    return "getTipReturn." + error;
            }
        }
        if (message.putHeaders != null && message.hasOwnProperty("putHeaders")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutHeaders.verify(message.putHeaders);
                if (error)
                    return "putHeaders." + error;
            }
        }
        if (message.putHeadersReturn != null && message.hasOwnProperty("putHeadersReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutHeadersReturn.verify(message.putHeadersReturn);
                if (error)
                    return "putHeadersReturn." + error;
            }
        }
        if (message.getHash != null && message.hasOwnProperty("getHash")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHash.verify(message.getHash);
                if (error)
                    return "getHash." + error;
            }
        }
        if (message.getHashReturn != null && message.hasOwnProperty("getHashReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetHashReturn.verify(message.getHashReturn);
                if (error)
                    return "getHashReturn." + error;
            }
        }
        if (message.getBlockTxs != null && message.hasOwnProperty("getBlockTxs")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlockTxs.verify(message.getBlockTxs);
                if (error)
                    return "getBlockTxs." + error;
            }
        }
        if (message.getBlockTxsReturn != null && message.hasOwnProperty("getBlockTxsReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.GetBlockTxsReturn.verify(message.getBlockTxsReturn);
                if (error)
                    return "getBlockTxsReturn." + error;
            }
        }
        if (message.putBlockTxs != null && message.hasOwnProperty("putBlockTxs")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutBlockTxs.verify(message.putBlockTxs);
                if (error)
                    return "putBlockTxs." + error;
            }
        }
        if (message.putBlockTxsReturn != null && message.hasOwnProperty("putBlockTxsReturn")) {
            if (properties.request === 1)
                return "request: multiple values";
            properties.request = 1;
            {
                var error = $root.PutBlockTxsReturn.verify(message.putBlockTxsReturn);
                if (error)
                    return "putBlockTxsReturn." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Network message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Network
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Network} Network
     */
    Network.fromObject = function fromObject(object) {
        if (object instanceof $root.Network)
            return object;
        var message = new $root.Network();
        if (object.status != null) {
            if (typeof object.status !== "object")
                throw TypeError(".Network.status: object expected");
            message.status = $root.Status.fromObject(object.status);
        }
        if (object.statusReturn != null) {
            if (typeof object.statusReturn !== "object")
                throw TypeError(".Network.statusReturn: object expected");
            message.statusReturn = $root.StatusReturn.fromObject(object.statusReturn);
        }
        if (object.ping != null) {
            if (typeof object.ping !== "object")
                throw TypeError(".Network.ping: object expected");
            message.ping = $root.Ping.fromObject(object.ping);
        }
        if (object.pingReturn != null) {
            if (typeof object.pingReturn !== "object")
                throw TypeError(".Network.pingReturn: object expected");
            message.pingReturn = $root.PingReturn.fromObject(object.pingReturn);
        }
        if (object.putTx != null) {
            if (typeof object.putTx !== "object")
                throw TypeError(".Network.putTx: object expected");
            message.putTx = $root.PutTx.fromObject(object.putTx);
        }
        if (object.putTxReturn != null) {
            if (typeof object.putTxReturn !== "object")
                throw TypeError(".Network.putTxReturn: object expected");
            message.putTxReturn = $root.PutTxReturn.fromObject(object.putTxReturn);
        }
        if (object.getTxs != null) {
            if (typeof object.getTxs !== "object")
                throw TypeError(".Network.getTxs: object expected");
            message.getTxs = $root.GetTxs.fromObject(object.getTxs);
        }
        if (object.getTxsReturn != null) {
            if (typeof object.getTxsReturn !== "object")
                throw TypeError(".Network.getTxsReturn: object expected");
            message.getTxsReturn = $root.GetTxsReturn.fromObject(object.getTxsReturn);
        }
        if (object.putBlock != null) {
            if (typeof object.putBlock !== "object")
                throw TypeError(".Network.putBlock: object expected");
            message.putBlock = $root.PutBlock.fromObject(object.putBlock);
        }
        if (object.putBlockReturn != null) {
            if (typeof object.putBlockReturn !== "object")
                throw TypeError(".Network.putBlockReturn: object expected");
            message.putBlockReturn = $root.PutBlockReturn.fromObject(object.putBlockReturn);
        }
        if (object.getBlocksByHash != null) {
            if (typeof object.getBlocksByHash !== "object")
                throw TypeError(".Network.getBlocksByHash: object expected");
            message.getBlocksByHash = $root.GetBlocksByHash.fromObject(object.getBlocksByHash);
        }
        if (object.getBlocksByHashReturn != null) {
            if (typeof object.getBlocksByHashReturn !== "object")
                throw TypeError(".Network.getBlocksByHashReturn: object expected");
            message.getBlocksByHashReturn = $root.GetBlocksByHashReturn.fromObject(object.getBlocksByHashReturn);
        }
        if (object.getHeadersByHash != null) {
            if (typeof object.getHeadersByHash !== "object")
                throw TypeError(".Network.getHeadersByHash: object expected");
            message.getHeadersByHash = $root.GetHeadersByHash.fromObject(object.getHeadersByHash);
        }
        if (object.getHeadersByHashReturn != null) {
            if (typeof object.getHeadersByHashReturn !== "object")
                throw TypeError(".Network.getHeadersByHashReturn: object expected");
            message.getHeadersByHashReturn = $root.GetHeadersByHashReturn.fromObject(object.getHeadersByHashReturn);
        }
        if (object.getBlocksByRange != null) {
            if (typeof object.getBlocksByRange !== "object")
                throw TypeError(".Network.getBlocksByRange: object expected");
            message.getBlocksByRange = $root.GetBlocksByRange.fromObject(object.getBlocksByRange);
        }
        if (object.getBlocksByRangeReturn != null) {
            if (typeof object.getBlocksByRangeReturn !== "object")
                throw TypeError(".Network.getBlocksByRangeReturn: object expected");
            message.getBlocksByRangeReturn = $root.GetBlocksByRangeReturn.fromObject(object.getBlocksByRangeReturn);
        }
        if (object.getHeadersByRange != null) {
            if (typeof object.getHeadersByRange !== "object")
                throw TypeError(".Network.getHeadersByRange: object expected");
            message.getHeadersByRange = $root.GetHeadersByRange.fromObject(object.getHeadersByRange);
        }
        if (object.getHeadersByRangeReturn != null) {
            if (typeof object.getHeadersByRangeReturn !== "object")
                throw TypeError(".Network.getHeadersByRangeReturn: object expected");
            message.getHeadersByRangeReturn = $root.GetHeadersByRangeReturn.fromObject(object.getHeadersByRangeReturn);
        }
        if (object.getPeers != null) {
            if (typeof object.getPeers !== "object")
                throw TypeError(".Network.getPeers: object expected");
            message.getPeers = $root.GetPeers.fromObject(object.getPeers);
        }
        if (object.getPeersReturn != null) {
            if (typeof object.getPeersReturn !== "object")
                throw TypeError(".Network.getPeersReturn: object expected");
            message.getPeersReturn = $root.GetPeersReturn.fromObject(object.getPeersReturn);
        }
        if (object.getTip != null) {
            if (typeof object.getTip !== "object")
                throw TypeError(".Network.getTip: object expected");
            message.getTip = $root.GetTip.fromObject(object.getTip);
        }
        if (object.getTipReturn != null) {
            if (typeof object.getTipReturn !== "object")
                throw TypeError(".Network.getTipReturn: object expected");
            message.getTipReturn = $root.GetTipReturn.fromObject(object.getTipReturn);
        }
        if (object.putHeaders != null) {
            if (typeof object.putHeaders !== "object")
                throw TypeError(".Network.putHeaders: object expected");
            message.putHeaders = $root.PutHeaders.fromObject(object.putHeaders);
        }
        if (object.putHeadersReturn != null) {
            if (typeof object.putHeadersReturn !== "object")
                throw TypeError(".Network.putHeadersReturn: object expected");
            message.putHeadersReturn = $root.PutHeadersReturn.fromObject(object.putHeadersReturn);
        }
        if (object.getHash != null) {
            if (typeof object.getHash !== "object")
                throw TypeError(".Network.getHash: object expected");
            message.getHash = $root.GetHash.fromObject(object.getHash);
        }
        if (object.getHashReturn != null) {
            if (typeof object.getHashReturn !== "object")
                throw TypeError(".Network.getHashReturn: object expected");
            message.getHashReturn = $root.GetHashReturn.fromObject(object.getHashReturn);
        }
        if (object.getBlockTxs != null) {
            if (typeof object.getBlockTxs !== "object")
                throw TypeError(".Network.getBlockTxs: object expected");
            message.getBlockTxs = $root.GetBlockTxs.fromObject(object.getBlockTxs);
        }
        if (object.getBlockTxsReturn != null) {
            if (typeof object.getBlockTxsReturn !== "object")
                throw TypeError(".Network.getBlockTxsReturn: object expected");
            message.getBlockTxsReturn = $root.GetBlockTxsReturn.fromObject(object.getBlockTxsReturn);
        }
        if (object.putBlockTxs != null) {
            if (typeof object.putBlockTxs !== "object")
                throw TypeError(".Network.putBlockTxs: object expected");
            message.putBlockTxs = $root.PutBlockTxs.fromObject(object.putBlockTxs);
        }
        if (object.putBlockTxsReturn != null) {
            if (typeof object.putBlockTxsReturn !== "object")
                throw TypeError(".Network.putBlockTxsReturn: object expected");
            message.putBlockTxsReturn = $root.PutBlockTxsReturn.fromObject(object.putBlockTxsReturn);
        }
        return message;
    };

    /**
     * Creates a plain object from a Network message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Network
     * @static
     * @param {Network} message Network
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Network.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.status != null && message.hasOwnProperty("status")) {
            object.status = $root.Status.toObject(message.status, options);
            if (options.oneofs)
                object.request = "status";
        }
        if (message.statusReturn != null && message.hasOwnProperty("statusReturn")) {
            object.statusReturn = $root.StatusReturn.toObject(message.statusReturn, options);
            if (options.oneofs)
                object.request = "statusReturn";
        }
        if (message.ping != null && message.hasOwnProperty("ping")) {
            object.ping = $root.Ping.toObject(message.ping, options);
            if (options.oneofs)
                object.request = "ping";
        }
        if (message.pingReturn != null && message.hasOwnProperty("pingReturn")) {
            object.pingReturn = $root.PingReturn.toObject(message.pingReturn, options);
            if (options.oneofs)
                object.request = "pingReturn";
        }
        if (message.putTx != null && message.hasOwnProperty("putTx")) {
            object.putTx = $root.PutTx.toObject(message.putTx, options);
            if (options.oneofs)
                object.request = "putTx";
        }
        if (message.putTxReturn != null && message.hasOwnProperty("putTxReturn")) {
            object.putTxReturn = $root.PutTxReturn.toObject(message.putTxReturn, options);
            if (options.oneofs)
                object.request = "putTxReturn";
        }
        if (message.getTxs != null && message.hasOwnProperty("getTxs")) {
            object.getTxs = $root.GetTxs.toObject(message.getTxs, options);
            if (options.oneofs)
                object.request = "getTxs";
        }
        if (message.getTxsReturn != null && message.hasOwnProperty("getTxsReturn")) {
            object.getTxsReturn = $root.GetTxsReturn.toObject(message.getTxsReturn, options);
            if (options.oneofs)
                object.request = "getTxsReturn";
        }
        if (message.putBlock != null && message.hasOwnProperty("putBlock")) {
            object.putBlock = $root.PutBlock.toObject(message.putBlock, options);
            if (options.oneofs)
                object.request = "putBlock";
        }
        if (message.putBlockReturn != null && message.hasOwnProperty("putBlockReturn")) {
            object.putBlockReturn = $root.PutBlockReturn.toObject(message.putBlockReturn, options);
            if (options.oneofs)
                object.request = "putBlockReturn";
        }
        if (message.getBlocksByHash != null && message.hasOwnProperty("getBlocksByHash")) {
            object.getBlocksByHash = $root.GetBlocksByHash.toObject(message.getBlocksByHash, options);
            if (options.oneofs)
                object.request = "getBlocksByHash";
        }
        if (message.getBlocksByHashReturn != null && message.hasOwnProperty("getBlocksByHashReturn")) {
            object.getBlocksByHashReturn = $root.GetBlocksByHashReturn.toObject(message.getBlocksByHashReturn, options);
            if (options.oneofs)
                object.request = "getBlocksByHashReturn";
        }
        if (message.getHeadersByHash != null && message.hasOwnProperty("getHeadersByHash")) {
            object.getHeadersByHash = $root.GetHeadersByHash.toObject(message.getHeadersByHash, options);
            if (options.oneofs)
                object.request = "getHeadersByHash";
        }
        if (message.getHeadersByHashReturn != null && message.hasOwnProperty("getHeadersByHashReturn")) {
            object.getHeadersByHashReturn = $root.GetHeadersByHashReturn.toObject(message.getHeadersByHashReturn, options);
            if (options.oneofs)
                object.request = "getHeadersByHashReturn";
        }
        if (message.getBlocksByRange != null && message.hasOwnProperty("getBlocksByRange")) {
            object.getBlocksByRange = $root.GetBlocksByRange.toObject(message.getBlocksByRange, options);
            if (options.oneofs)
                object.request = "getBlocksByRange";
        }
        if (message.getBlocksByRangeReturn != null && message.hasOwnProperty("getBlocksByRangeReturn")) {
            object.getBlocksByRangeReturn = $root.GetBlocksByRangeReturn.toObject(message.getBlocksByRangeReturn, options);
            if (options.oneofs)
                object.request = "getBlocksByRangeReturn";
        }
        if (message.getHeadersByRange != null && message.hasOwnProperty("getHeadersByRange")) {
            object.getHeadersByRange = $root.GetHeadersByRange.toObject(message.getHeadersByRange, options);
            if (options.oneofs)
                object.request = "getHeadersByRange";
        }
        if (message.getHeadersByRangeReturn != null && message.hasOwnProperty("getHeadersByRangeReturn")) {
            object.getHeadersByRangeReturn = $root.GetHeadersByRangeReturn.toObject(message.getHeadersByRangeReturn, options);
            if (options.oneofs)
                object.request = "getHeadersByRangeReturn";
        }
        if (message.getPeers != null && message.hasOwnProperty("getPeers")) {
            object.getPeers = $root.GetPeers.toObject(message.getPeers, options);
            if (options.oneofs)
                object.request = "getPeers";
        }
        if (message.getPeersReturn != null && message.hasOwnProperty("getPeersReturn")) {
            object.getPeersReturn = $root.GetPeersReturn.toObject(message.getPeersReturn, options);
            if (options.oneofs)
                object.request = "getPeersReturn";
        }
        if (message.getTip != null && message.hasOwnProperty("getTip")) {
            object.getTip = $root.GetTip.toObject(message.getTip, options);
            if (options.oneofs)
                object.request = "getTip";
        }
        if (message.getTipReturn != null && message.hasOwnProperty("getTipReturn")) {
            object.getTipReturn = $root.GetTipReturn.toObject(message.getTipReturn, options);
            if (options.oneofs)
                object.request = "getTipReturn";
        }
        if (message.putHeaders != null && message.hasOwnProperty("putHeaders")) {
            object.putHeaders = $root.PutHeaders.toObject(message.putHeaders, options);
            if (options.oneofs)
                object.request = "putHeaders";
        }
        if (message.putHeadersReturn != null && message.hasOwnProperty("putHeadersReturn")) {
            object.putHeadersReturn = $root.PutHeadersReturn.toObject(message.putHeadersReturn, options);
            if (options.oneofs)
                object.request = "putHeadersReturn";
        }
        if (message.getHash != null && message.hasOwnProperty("getHash")) {
            object.getHash = $root.GetHash.toObject(message.getHash, options);
            if (options.oneofs)
                object.request = "getHash";
        }
        if (message.getHashReturn != null && message.hasOwnProperty("getHashReturn")) {
            object.getHashReturn = $root.GetHashReturn.toObject(message.getHashReturn, options);
            if (options.oneofs)
                object.request = "getHashReturn";
        }
        if (message.getBlockTxs != null && message.hasOwnProperty("getBlockTxs")) {
            object.getBlockTxs = $root.GetBlockTxs.toObject(message.getBlockTxs, options);
            if (options.oneofs)
                object.request = "getBlockTxs";
        }
        if (message.getBlockTxsReturn != null && message.hasOwnProperty("getBlockTxsReturn")) {
            object.getBlockTxsReturn = $root.GetBlockTxsReturn.toObject(message.getBlockTxsReturn, options);
            if (options.oneofs)
                object.request = "getBlockTxsReturn";
        }
        if (message.putBlockTxs != null && message.hasOwnProperty("putBlockTxs")) {
            object.putBlockTxs = $root.PutBlockTxs.toObject(message.putBlockTxs, options);
            if (options.oneofs)
                object.request = "putBlockTxs";
        }
        if (message.putBlockTxsReturn != null && message.hasOwnProperty("putBlockTxsReturn")) {
            object.putBlockTxsReturn = $root.PutBlockTxsReturn.toObject(message.putBlockTxsReturn, options);
            if (options.oneofs)
                object.request = "putBlockTxsReturn";
        }
        return object;
    };

    /**
     * Converts this Network to JSON.
     * @function toJSON
     * @memberof Network
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Network.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Network;
})();

$root.Status = (function() {

    /**
     * Properties of a Status.
     * @exports IStatus
     * @interface IStatus
     * @property {number|null} [version] Status version
     * @property {string|null} [networkid] Status networkid
     * @property {number|null} [port] Status port
     * @property {string|null} [guid] Status guid
     * @property {number|null} [publicPort] Status publicPort
     */

    /**
     * Constructs a new Status.
     * @exports Status
     * @classdesc Represents a Status.
     * @implements IStatus
     * @constructor
     * @param {IStatus=} [properties] Properties to set
     */
    function Status(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Status version.
     * @member {number} version
     * @memberof Status
     * @instance
     */
    Status.prototype.version = 0;

    /**
     * Status networkid.
     * @member {string} networkid
     * @memberof Status
     * @instance
     */
    Status.prototype.networkid = "";

    /**
     * Status port.
     * @member {number} port
     * @memberof Status
     * @instance
     */
    Status.prototype.port = 0;

    /**
     * Status guid.
     * @member {string} guid
     * @memberof Status
     * @instance
     */
    Status.prototype.guid = "";

    /**
     * Status publicPort.
     * @member {number} publicPort
     * @memberof Status
     * @instance
     */
    Status.prototype.publicPort = 0;

    /**
     * Creates a new Status instance using the specified properties.
     * @function create
     * @memberof Status
     * @static
     * @param {IStatus=} [properties] Properties to set
     * @returns {Status} Status instance
     */
    Status.create = function create(properties) {
        return new Status(properties);
    };

    /**
     * Encodes the specified Status message. Does not implicitly {@link Status.verify|verify} messages.
     * @function encode
     * @memberof Status
     * @static
     * @param {IStatus} message Status message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Status.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.version != null && message.hasOwnProperty("version"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
        if (message.networkid != null && message.hasOwnProperty("networkid"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.networkid);
        if (message.port != null && message.hasOwnProperty("port"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.port);
        if (message.guid != null && message.hasOwnProperty("guid"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.guid);
        if (message.publicPort != null && message.hasOwnProperty("publicPort"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.publicPort);
        return writer;
    };

    /**
     * Encodes the specified Status message, length delimited. Does not implicitly {@link Status.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Status
     * @static
     * @param {IStatus} message Status message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Status.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Status message from the specified reader or buffer.
     * @function decode
     * @memberof Status
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Status} Status
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Status.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Status();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.version = reader.uint32();
                break;
            case 2:
                message.networkid = reader.string();
                break;
            case 5:
                message.port = reader.int32();
                break;
            case 6:
                message.guid = reader.string();
                break;
            case 7:
                message.publicPort = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Status message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Status
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Status} Status
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Status.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Status message.
     * @function verify
     * @memberof Status
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Status.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isInteger(message.version))
                return "version: integer expected";
        if (message.networkid != null && message.hasOwnProperty("networkid"))
            if (!$util.isString(message.networkid))
                return "networkid: string expected";
        if (message.port != null && message.hasOwnProperty("port"))
            if (!$util.isInteger(message.port))
                return "port: integer expected";
        if (message.guid != null && message.hasOwnProperty("guid"))
            if (!$util.isString(message.guid))
                return "guid: string expected";
        if (message.publicPort != null && message.hasOwnProperty("publicPort"))
            if (!$util.isInteger(message.publicPort))
                return "publicPort: integer expected";
        return null;
    };

    /**
     * Creates a Status message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Status
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Status} Status
     */
    Status.fromObject = function fromObject(object) {
        if (object instanceof $root.Status)
            return object;
        var message = new $root.Status();
        if (object.version != null)
            message.version = object.version >>> 0;
        if (object.networkid != null)
            message.networkid = String(object.networkid);
        if (object.port != null)
            message.port = object.port | 0;
        if (object.guid != null)
            message.guid = String(object.guid);
        if (object.publicPort != null)
            message.publicPort = object.publicPort | 0;
        return message;
    };

    /**
     * Creates a plain object from a Status message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Status
     * @static
     * @param {Status} message Status
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Status.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.version = 0;
            object.networkid = "";
            object.port = 0;
            object.guid = "";
            object.publicPort = 0;
        }
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        if (message.networkid != null && message.hasOwnProperty("networkid"))
            object.networkid = message.networkid;
        if (message.port != null && message.hasOwnProperty("port"))
            object.port = message.port;
        if (message.guid != null && message.hasOwnProperty("guid"))
            object.guid = message.guid;
        if (message.publicPort != null && message.hasOwnProperty("publicPort"))
            object.publicPort = message.publicPort;
        return object;
    };

    /**
     * Converts this Status to JSON.
     * @function toJSON
     * @memberof Status
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Status.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Status;
})();

$root.StatusReturn = (function() {

    /**
     * Properties of a StatusReturn.
     * @exports IStatusReturn
     * @interface IStatusReturn
     * @property {boolean|null} [success] StatusReturn success
     * @property {IStatus|null} [status] StatusReturn status
     */

    /**
     * Constructs a new StatusReturn.
     * @exports StatusReturn
     * @classdesc Represents a StatusReturn.
     * @implements IStatusReturn
     * @constructor
     * @param {IStatusReturn=} [properties] Properties to set
     */
    function StatusReturn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StatusReturn success.
     * @member {boolean} success
     * @memberof StatusReturn
     * @instance
     */
    StatusReturn.prototype.success = false;

    /**
     * StatusReturn status.
     * @member {IStatus|null|undefined} status
     * @memberof StatusReturn
     * @instance
     */
    StatusReturn.prototype.status = null;

    /**
     * Creates a new StatusReturn instance using the specified properties.
     * @function create
     * @memberof StatusReturn
     * @static
     * @param {IStatusReturn=} [properties] Properties to set
     * @returns {StatusReturn} StatusReturn instance
     */
    StatusReturn.create = function create(properties) {
        return new StatusReturn(properties);
    };

    /**
     * Encodes the specified StatusReturn message. Does not implicitly {@link StatusReturn.verify|verify} messages.
     * @function encode
     * @memberof StatusReturn
     * @static
     * @param {IStatusReturn} message StatusReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StatusReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.status != null && message.hasOwnProperty("status"))
            $root.Status.encode(message.status, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified StatusReturn message, length delimited. Does not implicitly {@link StatusReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StatusReturn
     * @static
     * @param {IStatusReturn} message StatusReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StatusReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StatusReturn message from the specified reader or buffer.
     * @function decode
     * @memberof StatusReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StatusReturn} StatusReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StatusReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StatusReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                message.status = $root.Status.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StatusReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StatusReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StatusReturn} StatusReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StatusReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StatusReturn message.
     * @function verify
     * @memberof StatusReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StatusReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.status != null && message.hasOwnProperty("status")) {
            var error = $root.Status.verify(message.status);
            if (error)
                return "status." + error;
        }
        return null;
    };

    /**
     * Creates a StatusReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StatusReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StatusReturn} StatusReturn
     */
    StatusReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.StatusReturn)
            return object;
        var message = new $root.StatusReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.status != null) {
            if (typeof object.status !== "object")
                throw TypeError(".StatusReturn.status: object expected");
            message.status = $root.Status.fromObject(object.status);
        }
        return message;
    };

    /**
     * Creates a plain object from a StatusReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StatusReturn
     * @static
     * @param {StatusReturn} message StatusReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StatusReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.success = false;
            object.status = null;
        }
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = $root.Status.toObject(message.status, options);
        return object;
    };

    /**
     * Converts this StatusReturn to JSON.
     * @function toJSON
     * @memberof StatusReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StatusReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StatusReturn;
})();

$root.Ping = (function() {

    /**
     * Properties of a Ping.
     * @exports IPing
     * @interface IPing
     * @property {number|Long|null} [nonce] Ping nonce
     */

    /**
     * Constructs a new Ping.
     * @exports Ping
     * @classdesc Represents a Ping.
     * @implements IPing
     * @constructor
     * @param {IPing=} [properties] Properties to set
     */
    function Ping(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Ping nonce.
     * @member {number|Long} nonce
     * @memberof Ping
     * @instance
     */
    Ping.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new Ping instance using the specified properties.
     * @function create
     * @memberof Ping
     * @static
     * @param {IPing=} [properties] Properties to set
     * @returns {Ping} Ping instance
     */
    Ping.create = function create(properties) {
        return new Ping(properties);
    };

    /**
     * Encodes the specified Ping message. Does not implicitly {@link Ping.verify|verify} messages.
     * @function encode
     * @memberof Ping
     * @static
     * @param {IPing} message Ping message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ping.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.nonce);
        return writer;
    };

    /**
     * Encodes the specified Ping message, length delimited. Does not implicitly {@link Ping.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Ping
     * @static
     * @param {IPing} message Ping message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ping.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Ping message from the specified reader or buffer.
     * @function decode
     * @memberof Ping
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Ping} Ping
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ping.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Ping();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nonce = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Ping message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Ping
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Ping} Ping
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ping.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Ping message.
     * @function verify
     * @memberof Ping
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Ping.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                return "nonce: integer|Long expected";
        return null;
    };

    /**
     * Creates a Ping message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Ping
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Ping} Ping
     */
    Ping.fromObject = function fromObject(object) {
        if (object instanceof $root.Ping)
            return object;
        var message = new $root.Ping();
        if (object.nonce != null)
            if ($util.Long)
                (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
            else if (typeof object.nonce === "string")
                message.nonce = parseInt(object.nonce, 10);
            else if (typeof object.nonce === "number")
                message.nonce = object.nonce;
            else if (typeof object.nonce === "object")
                message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a Ping message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Ping
     * @static
     * @param {Ping} message Ping
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Ping.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nonce = options.longs === String ? "0" : 0;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (typeof message.nonce === "number")
                object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
            else
                object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
        return object;
    };

    /**
     * Converts this Ping to JSON.
     * @function toJSON
     * @memberof Ping
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Ping.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Ping;
})();

$root.PingReturn = (function() {

    /**
     * Properties of a PingReturn.
     * @exports IPingReturn
     * @interface IPingReturn
     * @property {number|Long|null} [nonce] PingReturn nonce
     */

    /**
     * Constructs a new PingReturn.
     * @exports PingReturn
     * @classdesc Represents a PingReturn.
     * @implements IPingReturn
     * @constructor
     * @param {IPingReturn=} [properties] Properties to set
     */
    function PingReturn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PingReturn nonce.
     * @member {number|Long} nonce
     * @memberof PingReturn
     * @instance
     */
    PingReturn.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new PingReturn instance using the specified properties.
     * @function create
     * @memberof PingReturn
     * @static
     * @param {IPingReturn=} [properties] Properties to set
     * @returns {PingReturn} PingReturn instance
     */
    PingReturn.create = function create(properties) {
        return new PingReturn(properties);
    };

    /**
     * Encodes the specified PingReturn message. Does not implicitly {@link PingReturn.verify|verify} messages.
     * @function encode
     * @memberof PingReturn
     * @static
     * @param {IPingReturn} message PingReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PingReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.nonce);
        return writer;
    };

    /**
     * Encodes the specified PingReturn message, length delimited. Does not implicitly {@link PingReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PingReturn
     * @static
     * @param {IPingReturn} message PingReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PingReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PingReturn message from the specified reader or buffer.
     * @function decode
     * @memberof PingReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PingReturn} PingReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PingReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PingReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nonce = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PingReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PingReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PingReturn} PingReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PingReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PingReturn message.
     * @function verify
     * @memberof PingReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PingReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                return "nonce: integer|Long expected";
        return null;
    };

    /**
     * Creates a PingReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PingReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PingReturn} PingReturn
     */
    PingReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.PingReturn)
            return object;
        var message = new $root.PingReturn();
        if (object.nonce != null)
            if ($util.Long)
                (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
            else if (typeof object.nonce === "string")
                message.nonce = parseInt(object.nonce, 10);
            else if (typeof object.nonce === "number")
                message.nonce = object.nonce;
            else if (typeof object.nonce === "object")
                message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a PingReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PingReturn
     * @static
     * @param {PingReturn} message PingReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PingReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nonce = options.longs === String ? "0" : 0;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (typeof message.nonce === "number")
                object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
            else
                object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
        return object;
    };

    /**
     * Converts this PingReturn to JSON.
     * @function toJSON
     * @memberof PingReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PingReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PingReturn;
})();

$root.PutTx = (function() {

    /**
     * Properties of a PutTx.
     * @exports IPutTx
     * @interface IPutTx
     * @property {Array.<ITx>|null} [txs] PutTx txs
     */

    /**
     * Constructs a new PutTx.
     * @exports PutTx
     * @classdesc Represents a PutTx.
     * @implements IPutTx
     * @constructor
     * @param {IPutTx=} [properties] Properties to set
     */
    function PutTx(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutTx txs.
     * @member {Array.<ITx>} txs
     * @memberof PutTx
     * @instance
     */
    PutTx.prototype.txs = $util.emptyArray;

    /**
     * Creates a new PutTx instance using the specified properties.
     * @function create
     * @memberof PutTx
     * @static
     * @param {IPutTx=} [properties] Properties to set
     * @returns {PutTx} PutTx instance
     */
    PutTx.create = function create(properties) {
        return new PutTx(properties);
    };

    /**
     * Encodes the specified PutTx message. Does not implicitly {@link PutTx.verify|verify} messages.
     * @function encode
     * @memberof PutTx
     * @static
     * @param {IPutTx} message PutTx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutTx.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutTx message, length delimited. Does not implicitly {@link PutTx.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutTx
     * @static
     * @param {IPutTx} message PutTx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutTx.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutTx message from the specified reader or buffer.
     * @function decode
     * @memberof PutTx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutTx} PutTx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutTx.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutTx();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutTx message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutTx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutTx} PutTx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutTx.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutTx message.
     * @function verify
     * @memberof PutTx
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutTx.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutTx message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutTx
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutTx} PutTx
     */
    PutTx.fromObject = function fromObject(object) {
        if (object instanceof $root.PutTx)
            return object;
        var message = new $root.PutTx();
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".PutTx.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".PutTx.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutTx message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutTx
     * @static
     * @param {PutTx} message PutTx
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutTx.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this PutTx to JSON.
     * @function toJSON
     * @memberof PutTx
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutTx.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutTx;
})();

$root.PutTxReturn = (function() {

    /**
     * Properties of a PutTxReturn.
     * @exports IPutTxReturn
     * @interface IPutTxReturn
     * @property {boolean|null} [success] PutTxReturn success
     */

    /**
     * Constructs a new PutTxReturn.
     * @exports PutTxReturn
     * @classdesc Represents a PutTxReturn.
     * @implements IPutTxReturn
     * @constructor
     * @param {IPutTxReturn=} [properties] Properties to set
     */
    function PutTxReturn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutTxReturn success.
     * @member {boolean} success
     * @memberof PutTxReturn
     * @instance
     */
    PutTxReturn.prototype.success = false;

    /**
     * Creates a new PutTxReturn instance using the specified properties.
     * @function create
     * @memberof PutTxReturn
     * @static
     * @param {IPutTxReturn=} [properties] Properties to set
     * @returns {PutTxReturn} PutTxReturn instance
     */
    PutTxReturn.create = function create(properties) {
        return new PutTxReturn(properties);
    };

    /**
     * Encodes the specified PutTxReturn message. Does not implicitly {@link PutTxReturn.verify|verify} messages.
     * @function encode
     * @memberof PutTxReturn
     * @static
     * @param {IPutTxReturn} message PutTxReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutTxReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        return writer;
    };

    /**
     * Encodes the specified PutTxReturn message, length delimited. Does not implicitly {@link PutTxReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutTxReturn
     * @static
     * @param {IPutTxReturn} message PutTxReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutTxReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutTxReturn message from the specified reader or buffer.
     * @function decode
     * @memberof PutTxReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutTxReturn} PutTxReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutTxReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutTxReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutTxReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutTxReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutTxReturn} PutTxReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutTxReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutTxReturn message.
     * @function verify
     * @memberof PutTxReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutTxReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        return null;
    };

    /**
     * Creates a PutTxReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutTxReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutTxReturn} PutTxReturn
     */
    PutTxReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.PutTxReturn)
            return object;
        var message = new $root.PutTxReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        return message;
    };

    /**
     * Creates a plain object from a PutTxReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutTxReturn
     * @static
     * @param {PutTxReturn} message PutTxReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutTxReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        return object;
    };

    /**
     * Converts this PutTxReturn to JSON.
     * @function toJSON
     * @memberof PutTxReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutTxReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutTxReturn;
})();

$root.PutBlockTxs = (function() {

    /**
     * Properties of a PutBlockTxs.
     * @exports IPutBlockTxs
     * @interface IPutBlockTxs
     * @property {Array.<IBlockTxs>|null} [txBlocks] PutBlockTxs txBlocks
     */

    /**
     * Constructs a new PutBlockTxs.
     * @exports PutBlockTxs
     * @classdesc Represents a PutBlockTxs.
     * @implements IPutBlockTxs
     * @constructor
     * @param {IPutBlockTxs=} [properties] Properties to set
     */
    function PutBlockTxs(properties) {
        this.txBlocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutBlockTxs txBlocks.
     * @member {Array.<IBlockTxs>} txBlocks
     * @memberof PutBlockTxs
     * @instance
     */
    PutBlockTxs.prototype.txBlocks = $util.emptyArray;

    /**
     * Creates a new PutBlockTxs instance using the specified properties.
     * @function create
     * @memberof PutBlockTxs
     * @static
     * @param {IPutBlockTxs=} [properties] Properties to set
     * @returns {PutBlockTxs} PutBlockTxs instance
     */
    PutBlockTxs.create = function create(properties) {
        return new PutBlockTxs(properties);
    };

    /**
     * Encodes the specified PutBlockTxs message. Does not implicitly {@link PutBlockTxs.verify|verify} messages.
     * @function encode
     * @memberof PutBlockTxs
     * @static
     * @param {IPutBlockTxs} message PutBlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockTxs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.txBlocks != null && message.txBlocks.length)
            for (var i = 0; i < message.txBlocks.length; ++i)
                $root.BlockTxs.encode(message.txBlocks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutBlockTxs message, length delimited. Does not implicitly {@link PutBlockTxs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutBlockTxs
     * @static
     * @param {IPutBlockTxs} message PutBlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockTxs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutBlockTxs message from the specified reader or buffer.
     * @function decode
     * @memberof PutBlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutBlockTxs} PutBlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockTxs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutBlockTxs();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.txBlocks && message.txBlocks.length))
                    message.txBlocks = [];
                message.txBlocks.push($root.BlockTxs.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutBlockTxs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutBlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutBlockTxs} PutBlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockTxs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutBlockTxs message.
     * @function verify
     * @memberof PutBlockTxs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutBlockTxs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.txBlocks != null && message.hasOwnProperty("txBlocks")) {
            if (!Array.isArray(message.txBlocks))
                return "txBlocks: array expected";
            for (var i = 0; i < message.txBlocks.length; ++i) {
                var error = $root.BlockTxs.verify(message.txBlocks[i]);
                if (error)
                    return "txBlocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutBlockTxs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutBlockTxs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutBlockTxs} PutBlockTxs
     */
    PutBlockTxs.fromObject = function fromObject(object) {
        if (object instanceof $root.PutBlockTxs)
            return object;
        var message = new $root.PutBlockTxs();
        if (object.txBlocks) {
            if (!Array.isArray(object.txBlocks))
                throw TypeError(".PutBlockTxs.txBlocks: array expected");
            message.txBlocks = [];
            for (var i = 0; i < object.txBlocks.length; ++i) {
                if (typeof object.txBlocks[i] !== "object")
                    throw TypeError(".PutBlockTxs.txBlocks: object expected");
                message.txBlocks[i] = $root.BlockTxs.fromObject(object.txBlocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutBlockTxs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutBlockTxs
     * @static
     * @param {PutBlockTxs} message PutBlockTxs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutBlockTxs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txBlocks = [];
        if (message.txBlocks && message.txBlocks.length) {
            object.txBlocks = [];
            for (var j = 0; j < message.txBlocks.length; ++j)
                object.txBlocks[j] = $root.BlockTxs.toObject(message.txBlocks[j], options);
        }
        return object;
    };

    /**
     * Converts this PutBlockTxs to JSON.
     * @function toJSON
     * @memberof PutBlockTxs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutBlockTxs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutBlockTxs;
})();

$root.PutBlockTxsReturn = (function() {

    /**
     * Properties of a PutBlockTxsReturn.
     * @exports IPutBlockTxsReturn
     * @interface IPutBlockTxsReturn
     * @property {Array.<IStatusChange>|null} [statusChanges] PutBlockTxsReturn statusChanges
     */

    /**
     * Constructs a new PutBlockTxsReturn.
     * @exports PutBlockTxsReturn
     * @classdesc Represents a PutBlockTxsReturn.
     * @implements IPutBlockTxsReturn
     * @constructor
     * @param {IPutBlockTxsReturn=} [properties] Properties to set
     */
    function PutBlockTxsReturn(properties) {
        this.statusChanges = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutBlockTxsReturn statusChanges.
     * @member {Array.<IStatusChange>} statusChanges
     * @memberof PutBlockTxsReturn
     * @instance
     */
    PutBlockTxsReturn.prototype.statusChanges = $util.emptyArray;

    /**
     * Creates a new PutBlockTxsReturn instance using the specified properties.
     * @function create
     * @memberof PutBlockTxsReturn
     * @static
     * @param {IPutBlockTxsReturn=} [properties] Properties to set
     * @returns {PutBlockTxsReturn} PutBlockTxsReturn instance
     */
    PutBlockTxsReturn.create = function create(properties) {
        return new PutBlockTxsReturn(properties);
    };

    /**
     * Encodes the specified PutBlockTxsReturn message. Does not implicitly {@link PutBlockTxsReturn.verify|verify} messages.
     * @function encode
     * @memberof PutBlockTxsReturn
     * @static
     * @param {IPutBlockTxsReturn} message PutBlockTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockTxsReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.statusChanges != null && message.statusChanges.length)
            for (var i = 0; i < message.statusChanges.length; ++i)
                $root.StatusChange.encode(message.statusChanges[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutBlockTxsReturn message, length delimited. Does not implicitly {@link PutBlockTxsReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutBlockTxsReturn
     * @static
     * @param {IPutBlockTxsReturn} message PutBlockTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockTxsReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutBlockTxsReturn message from the specified reader or buffer.
     * @function decode
     * @memberof PutBlockTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutBlockTxsReturn} PutBlockTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockTxsReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutBlockTxsReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.statusChanges && message.statusChanges.length))
                    message.statusChanges = [];
                message.statusChanges.push($root.StatusChange.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutBlockTxsReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutBlockTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutBlockTxsReturn} PutBlockTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockTxsReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutBlockTxsReturn message.
     * @function verify
     * @memberof PutBlockTxsReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutBlockTxsReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.statusChanges != null && message.hasOwnProperty("statusChanges")) {
            if (!Array.isArray(message.statusChanges))
                return "statusChanges: array expected";
            for (var i = 0; i < message.statusChanges.length; ++i) {
                var error = $root.StatusChange.verify(message.statusChanges[i]);
                if (error)
                    return "statusChanges." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutBlockTxsReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutBlockTxsReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutBlockTxsReturn} PutBlockTxsReturn
     */
    PutBlockTxsReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.PutBlockTxsReturn)
            return object;
        var message = new $root.PutBlockTxsReturn();
        if (object.statusChanges) {
            if (!Array.isArray(object.statusChanges))
                throw TypeError(".PutBlockTxsReturn.statusChanges: array expected");
            message.statusChanges = [];
            for (var i = 0; i < object.statusChanges.length; ++i) {
                if (typeof object.statusChanges[i] !== "object")
                    throw TypeError(".PutBlockTxsReturn.statusChanges: object expected");
                message.statusChanges[i] = $root.StatusChange.fromObject(object.statusChanges[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutBlockTxsReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutBlockTxsReturn
     * @static
     * @param {PutBlockTxsReturn} message PutBlockTxsReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutBlockTxsReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.statusChanges = [];
        if (message.statusChanges && message.statusChanges.length) {
            object.statusChanges = [];
            for (var j = 0; j < message.statusChanges.length; ++j)
                object.statusChanges[j] = $root.StatusChange.toObject(message.statusChanges[j], options);
        }
        return object;
    };

    /**
     * Converts this PutBlockTxsReturn to JSON.
     * @function toJSON
     * @memberof PutBlockTxsReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutBlockTxsReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutBlockTxsReturn;
})();

$root.GetBlockTxs = (function() {

    /**
     * Properties of a GetBlockTxs.
     * @exports IGetBlockTxs
     * @interface IGetBlockTxs
     * @property {Array.<Uint8Array>|null} [hashes] GetBlockTxs hashes
     */

    /**
     * Constructs a new GetBlockTxs.
     * @exports GetBlockTxs
     * @classdesc Represents a GetBlockTxs.
     * @implements IGetBlockTxs
     * @constructor
     * @param {IGetBlockTxs=} [properties] Properties to set
     */
    function GetBlockTxs(properties) {
        this.hashes = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlockTxs hashes.
     * @member {Array.<Uint8Array>} hashes
     * @memberof GetBlockTxs
     * @instance
     */
    GetBlockTxs.prototype.hashes = $util.emptyArray;

    /**
     * Creates a new GetBlockTxs instance using the specified properties.
     * @function create
     * @memberof GetBlockTxs
     * @static
     * @param {IGetBlockTxs=} [properties] Properties to set
     * @returns {GetBlockTxs} GetBlockTxs instance
     */
    GetBlockTxs.create = function create(properties) {
        return new GetBlockTxs(properties);
    };

    /**
     * Encodes the specified GetBlockTxs message. Does not implicitly {@link GetBlockTxs.verify|verify} messages.
     * @function encode
     * @memberof GetBlockTxs
     * @static
     * @param {IGetBlockTxs} message GetBlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlockTxs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hashes != null && message.hashes.length)
            for (var i = 0; i < message.hashes.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hashes[i]);
        return writer;
    };

    /**
     * Encodes the specified GetBlockTxs message, length delimited. Does not implicitly {@link GetBlockTxs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlockTxs
     * @static
     * @param {IGetBlockTxs} message GetBlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlockTxs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlockTxs message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlockTxs} GetBlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlockTxs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlockTxs();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.hashes && message.hashes.length))
                    message.hashes = [];
                message.hashes.push(reader.bytes());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlockTxs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlockTxs} GetBlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlockTxs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlockTxs message.
     * @function verify
     * @memberof GetBlockTxs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlockTxs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hashes != null && message.hasOwnProperty("hashes")) {
            if (!Array.isArray(message.hashes))
                return "hashes: array expected";
            for (var i = 0; i < message.hashes.length; ++i)
                if (!(message.hashes[i] && typeof message.hashes[i].length === "number" || $util.isString(message.hashes[i])))
                    return "hashes: buffer[] expected";
        }
        return null;
    };

    /**
     * Creates a GetBlockTxs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlockTxs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlockTxs} GetBlockTxs
     */
    GetBlockTxs.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlockTxs)
            return object;
        var message = new $root.GetBlockTxs();
        if (object.hashes) {
            if (!Array.isArray(object.hashes))
                throw TypeError(".GetBlockTxs.hashes: array expected");
            message.hashes = [];
            for (var i = 0; i < object.hashes.length; ++i)
                if (typeof object.hashes[i] === "string")
                    $util.base64.decode(object.hashes[i], message.hashes[i] = $util.newBuffer($util.base64.length(object.hashes[i])), 0);
                else if (object.hashes[i].length)
                    message.hashes[i] = object.hashes[i];
        }
        return message;
    };

    /**
     * Creates a plain object from a GetBlockTxs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlockTxs
     * @static
     * @param {GetBlockTxs} message GetBlockTxs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlockTxs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.hashes = [];
        if (message.hashes && message.hashes.length) {
            object.hashes = [];
            for (var j = 0; j < message.hashes.length; ++j)
                object.hashes[j] = options.bytes === String ? $util.base64.encode(message.hashes[j], 0, message.hashes[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.hashes[j]) : message.hashes[j];
        }
        return object;
    };

    /**
     * Converts this GetBlockTxs to JSON.
     * @function toJSON
     * @memberof GetBlockTxs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlockTxs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlockTxs;
})();

$root.BlockTxs = (function() {

    /**
     * Properties of a BlockTxs.
     * @exports IBlockTxs
     * @interface IBlockTxs
     * @property {Uint8Array|null} [hash] BlockTxs hash
     * @property {Array.<ITx>|null} [txs] BlockTxs txs
     */

    /**
     * Constructs a new BlockTxs.
     * @exports BlockTxs
     * @classdesc Represents a BlockTxs.
     * @implements IBlockTxs
     * @constructor
     * @param {IBlockTxs=} [properties] Properties to set
     */
    function BlockTxs(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockTxs hash.
     * @member {Uint8Array} hash
     * @memberof BlockTxs
     * @instance
     */
    BlockTxs.prototype.hash = $util.newBuffer([]);

    /**
     * BlockTxs txs.
     * @member {Array.<ITx>} txs
     * @memberof BlockTxs
     * @instance
     */
    BlockTxs.prototype.txs = $util.emptyArray;

    /**
     * Creates a new BlockTxs instance using the specified properties.
     * @function create
     * @memberof BlockTxs
     * @static
     * @param {IBlockTxs=} [properties] Properties to set
     * @returns {BlockTxs} BlockTxs instance
     */
    BlockTxs.create = function create(properties) {
        return new BlockTxs(properties);
    };

    /**
     * Encodes the specified BlockTxs message. Does not implicitly {@link BlockTxs.verify|verify} messages.
     * @function encode
     * @memberof BlockTxs
     * @static
     * @param {IBlockTxs} message BlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockTxs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hash);
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BlockTxs message, length delimited. Does not implicitly {@link BlockTxs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockTxs
     * @static
     * @param {IBlockTxs} message BlockTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockTxs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockTxs message from the specified reader or buffer.
     * @function decode
     * @memberof BlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockTxs} BlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockTxs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockTxs();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.bytes();
                break;
            case 2:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BlockTxs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockTxs} BlockTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockTxs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockTxs message.
     * @function verify
     * @memberof BlockTxs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockTxs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a BlockTxs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockTxs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockTxs} BlockTxs
     */
    BlockTxs.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockTxs)
            return object;
        var message = new $root.BlockTxs();
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".BlockTxs.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".BlockTxs.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a BlockTxs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockTxs
     * @static
     * @param {BlockTxs} message BlockTxs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockTxs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (options.defaults)
            object.hash = options.bytes === String ? "" : [];
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this BlockTxs to JSON.
     * @function toJSON
     * @memberof BlockTxs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockTxs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockTxs;
})();

$root.GetBlockTxsReturn = (function() {

    /**
     * Properties of a GetBlockTxsReturn.
     * @exports IGetBlockTxsReturn
     * @interface IGetBlockTxsReturn
     * @property {Array.<IBlockTxs>|null} [txBlocks] GetBlockTxsReturn txBlocks
     */

    /**
     * Constructs a new GetBlockTxsReturn.
     * @exports GetBlockTxsReturn
     * @classdesc Represents a GetBlockTxsReturn.
     * @implements IGetBlockTxsReturn
     * @constructor
     * @param {IGetBlockTxsReturn=} [properties] Properties to set
     */
    function GetBlockTxsReturn(properties) {
        this.txBlocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlockTxsReturn txBlocks.
     * @member {Array.<IBlockTxs>} txBlocks
     * @memberof GetBlockTxsReturn
     * @instance
     */
    GetBlockTxsReturn.prototype.txBlocks = $util.emptyArray;

    /**
     * Creates a new GetBlockTxsReturn instance using the specified properties.
     * @function create
     * @memberof GetBlockTxsReturn
     * @static
     * @param {IGetBlockTxsReturn=} [properties] Properties to set
     * @returns {GetBlockTxsReturn} GetBlockTxsReturn instance
     */
    GetBlockTxsReturn.create = function create(properties) {
        return new GetBlockTxsReturn(properties);
    };

    /**
     * Encodes the specified GetBlockTxsReturn message. Does not implicitly {@link GetBlockTxsReturn.verify|verify} messages.
     * @function encode
     * @memberof GetBlockTxsReturn
     * @static
     * @param {IGetBlockTxsReturn} message GetBlockTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlockTxsReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.txBlocks != null && message.txBlocks.length)
            for (var i = 0; i < message.txBlocks.length; ++i)
                $root.BlockTxs.encode(message.txBlocks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetBlockTxsReturn message, length delimited. Does not implicitly {@link GetBlockTxsReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlockTxsReturn
     * @static
     * @param {IGetBlockTxsReturn} message GetBlockTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlockTxsReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlockTxsReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlockTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlockTxsReturn} GetBlockTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlockTxsReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlockTxsReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.txBlocks && message.txBlocks.length))
                    message.txBlocks = [];
                message.txBlocks.push($root.BlockTxs.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlockTxsReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlockTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlockTxsReturn} GetBlockTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlockTxsReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlockTxsReturn message.
     * @function verify
     * @memberof GetBlockTxsReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlockTxsReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.txBlocks != null && message.hasOwnProperty("txBlocks")) {
            if (!Array.isArray(message.txBlocks))
                return "txBlocks: array expected";
            for (var i = 0; i < message.txBlocks.length; ++i) {
                var error = $root.BlockTxs.verify(message.txBlocks[i]);
                if (error)
                    return "txBlocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetBlockTxsReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlockTxsReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlockTxsReturn} GetBlockTxsReturn
     */
    GetBlockTxsReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlockTxsReturn)
            return object;
        var message = new $root.GetBlockTxsReturn();
        if (object.txBlocks) {
            if (!Array.isArray(object.txBlocks))
                throw TypeError(".GetBlockTxsReturn.txBlocks: array expected");
            message.txBlocks = [];
            for (var i = 0; i < object.txBlocks.length; ++i) {
                if (typeof object.txBlocks[i] !== "object")
                    throw TypeError(".GetBlockTxsReturn.txBlocks: object expected");
                message.txBlocks[i] = $root.BlockTxs.fromObject(object.txBlocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetBlockTxsReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlockTxsReturn
     * @static
     * @param {GetBlockTxsReturn} message GetBlockTxsReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlockTxsReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txBlocks = [];
        if (message.txBlocks && message.txBlocks.length) {
            object.txBlocks = [];
            for (var j = 0; j < message.txBlocks.length; ++j)
                object.txBlocks[j] = $root.BlockTxs.toObject(message.txBlocks[j], options);
        }
        return object;
    };

    /**
     * Converts this GetBlockTxsReturn to JSON.
     * @function toJSON
     * @memberof GetBlockTxsReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlockTxsReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlockTxsReturn;
})();

$root.GetTxs = (function() {

    /**
     * Properties of a GetTxs.
     * @exports IGetTxs
     * @interface IGetTxs
     * @property {number|Long|null} [minFee] GetTxs minFee
     */

    /**
     * Constructs a new GetTxs.
     * @exports GetTxs
     * @classdesc Represents a GetTxs.
     * @implements IGetTxs
     * @constructor
     * @param {IGetTxs=} [properties] Properties to set
     */
    function GetTxs(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetTxs minFee.
     * @member {number|Long} minFee
     * @memberof GetTxs
     * @instance
     */
    GetTxs.prototype.minFee = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new GetTxs instance using the specified properties.
     * @function create
     * @memberof GetTxs
     * @static
     * @param {IGetTxs=} [properties] Properties to set
     * @returns {GetTxs} GetTxs instance
     */
    GetTxs.create = function create(properties) {
        return new GetTxs(properties);
    };

    /**
     * Encodes the specified GetTxs message. Does not implicitly {@link GetTxs.verify|verify} messages.
     * @function encode
     * @memberof GetTxs
     * @static
     * @param {IGetTxs} message GetTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTxs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.minFee != null && message.hasOwnProperty("minFee"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.minFee);
        return writer;
    };

    /**
     * Encodes the specified GetTxs message, length delimited. Does not implicitly {@link GetTxs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetTxs
     * @static
     * @param {IGetTxs} message GetTxs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTxs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetTxs message from the specified reader or buffer.
     * @function decode
     * @memberof GetTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetTxs} GetTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTxs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetTxs();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.minFee = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetTxs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetTxs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetTxs} GetTxs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTxs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetTxs message.
     * @function verify
     * @memberof GetTxs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetTxs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.minFee != null && message.hasOwnProperty("minFee"))
            if (!$util.isInteger(message.minFee) && !(message.minFee && $util.isInteger(message.minFee.low) && $util.isInteger(message.minFee.high)))
                return "minFee: integer|Long expected";
        return null;
    };

    /**
     * Creates a GetTxs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetTxs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetTxs} GetTxs
     */
    GetTxs.fromObject = function fromObject(object) {
        if (object instanceof $root.GetTxs)
            return object;
        var message = new $root.GetTxs();
        if (object.minFee != null)
            if ($util.Long)
                (message.minFee = $util.Long.fromValue(object.minFee)).unsigned = true;
            else if (typeof object.minFee === "string")
                message.minFee = parseInt(object.minFee, 10);
            else if (typeof object.minFee === "number")
                message.minFee = object.minFee;
            else if (typeof object.minFee === "object")
                message.minFee = new $util.LongBits(object.minFee.low >>> 0, object.minFee.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a GetTxs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetTxs
     * @static
     * @param {GetTxs} message GetTxs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetTxs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.minFee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.minFee = options.longs === String ? "0" : 0;
        if (message.minFee != null && message.hasOwnProperty("minFee"))
            if (typeof message.minFee === "number")
                object.minFee = options.longs === String ? String(message.minFee) : message.minFee;
            else
                object.minFee = options.longs === String ? $util.Long.prototype.toString.call(message.minFee) : options.longs === Number ? new $util.LongBits(message.minFee.low >>> 0, message.minFee.high >>> 0).toNumber(true) : message.minFee;
        return object;
    };

    /**
     * Converts this GetTxs to JSON.
     * @function toJSON
     * @memberof GetTxs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetTxs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetTxs;
})();

$root.GetTxsReturn = (function() {

    /**
     * Properties of a GetTxsReturn.
     * @exports IGetTxsReturn
     * @interface IGetTxsReturn
     * @property {boolean|null} [success] GetTxsReturn success
     * @property {Array.<ITx>|null} [txs] GetTxsReturn txs
     */

    /**
     * Constructs a new GetTxsReturn.
     * @exports GetTxsReturn
     * @classdesc Represents a GetTxsReturn.
     * @implements IGetTxsReturn
     * @constructor
     * @param {IGetTxsReturn=} [properties] Properties to set
     */
    function GetTxsReturn(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetTxsReturn success.
     * @member {boolean} success
     * @memberof GetTxsReturn
     * @instance
     */
    GetTxsReturn.prototype.success = false;

    /**
     * GetTxsReturn txs.
     * @member {Array.<ITx>} txs
     * @memberof GetTxsReturn
     * @instance
     */
    GetTxsReturn.prototype.txs = $util.emptyArray;

    /**
     * Creates a new GetTxsReturn instance using the specified properties.
     * @function create
     * @memberof GetTxsReturn
     * @static
     * @param {IGetTxsReturn=} [properties] Properties to set
     * @returns {GetTxsReturn} GetTxsReturn instance
     */
    GetTxsReturn.create = function create(properties) {
        return new GetTxsReturn(properties);
    };

    /**
     * Encodes the specified GetTxsReturn message. Does not implicitly {@link GetTxsReturn.verify|verify} messages.
     * @function encode
     * @memberof GetTxsReturn
     * @static
     * @param {IGetTxsReturn} message GetTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTxsReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetTxsReturn message, length delimited. Does not implicitly {@link GetTxsReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetTxsReturn
     * @static
     * @param {IGetTxsReturn} message GetTxsReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTxsReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetTxsReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetTxsReturn} GetTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTxsReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetTxsReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetTxsReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetTxsReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetTxsReturn} GetTxsReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTxsReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetTxsReturn message.
     * @function verify
     * @memberof GetTxsReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetTxsReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetTxsReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetTxsReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetTxsReturn} GetTxsReturn
     */
    GetTxsReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetTxsReturn)
            return object;
        var message = new $root.GetTxsReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".GetTxsReturn.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".GetTxsReturn.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetTxsReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetTxsReturn
     * @static
     * @param {GetTxsReturn} message GetTxsReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetTxsReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this GetTxsReturn to JSON.
     * @function toJSON
     * @memberof GetTxsReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetTxsReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetTxsReturn;
})();

$root.PutBlock = (function() {

    /**
     * Properties of a PutBlock.
     * @exports IPutBlock
     * @interface IPutBlock
     * @property {Array.<IBlock>|null} [blocks] PutBlock blocks
     */

    /**
     * Constructs a new PutBlock.
     * @exports PutBlock
     * @classdesc Represents a PutBlock.
     * @implements IPutBlock
     * @constructor
     * @param {IPutBlock=} [properties] Properties to set
     */
    function PutBlock(properties) {
        this.blocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutBlock blocks.
     * @member {Array.<IBlock>} blocks
     * @memberof PutBlock
     * @instance
     */
    PutBlock.prototype.blocks = $util.emptyArray;

    /**
     * Creates a new PutBlock instance using the specified properties.
     * @function create
     * @memberof PutBlock
     * @static
     * @param {IPutBlock=} [properties] Properties to set
     * @returns {PutBlock} PutBlock instance
     */
    PutBlock.create = function create(properties) {
        return new PutBlock(properties);
    };

    /**
     * Encodes the specified PutBlock message. Does not implicitly {@link PutBlock.verify|verify} messages.
     * @function encode
     * @memberof PutBlock
     * @static
     * @param {IPutBlock} message PutBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.blocks != null && message.blocks.length)
            for (var i = 0; i < message.blocks.length; ++i)
                $root.Block.encode(message.blocks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutBlock message, length delimited. Does not implicitly {@link PutBlock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutBlock
     * @static
     * @param {IPutBlock} message PutBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutBlock message from the specified reader or buffer.
     * @function decode
     * @memberof PutBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutBlock} PutBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutBlock();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.blocks && message.blocks.length))
                    message.blocks = [];
                message.blocks.push($root.Block.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutBlock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutBlock} PutBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutBlock message.
     * @function verify
     * @memberof PutBlock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutBlock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.blocks != null && message.hasOwnProperty("blocks")) {
            if (!Array.isArray(message.blocks))
                return "blocks: array expected";
            for (var i = 0; i < message.blocks.length; ++i) {
                var error = $root.Block.verify(message.blocks[i]);
                if (error)
                    return "blocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutBlock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutBlock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutBlock} PutBlock
     */
    PutBlock.fromObject = function fromObject(object) {
        if (object instanceof $root.PutBlock)
            return object;
        var message = new $root.PutBlock();
        if (object.blocks) {
            if (!Array.isArray(object.blocks))
                throw TypeError(".PutBlock.blocks: array expected");
            message.blocks = [];
            for (var i = 0; i < object.blocks.length; ++i) {
                if (typeof object.blocks[i] !== "object")
                    throw TypeError(".PutBlock.blocks: object expected");
                message.blocks[i] = $root.Block.fromObject(object.blocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutBlock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutBlock
     * @static
     * @param {PutBlock} message PutBlock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutBlock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.blocks = [];
        if (message.blocks && message.blocks.length) {
            object.blocks = [];
            for (var j = 0; j < message.blocks.length; ++j)
                object.blocks[j] = $root.Block.toObject(message.blocks[j], options);
        }
        return object;
    };

    /**
     * Converts this PutBlock to JSON.
     * @function toJSON
     * @memberof PutBlock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutBlock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutBlock;
})();

$root.PutBlockReturn = (function() {

    /**
     * Properties of a PutBlockReturn.
     * @exports IPutBlockReturn
     * @interface IPutBlockReturn
     * @property {Array.<IStatusChange>|null} [statusChanges] PutBlockReturn statusChanges
     */

    /**
     * Constructs a new PutBlockReturn.
     * @exports PutBlockReturn
     * @classdesc Represents a PutBlockReturn.
     * @implements IPutBlockReturn
     * @constructor
     * @param {IPutBlockReturn=} [properties] Properties to set
     */
    function PutBlockReturn(properties) {
        this.statusChanges = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutBlockReturn statusChanges.
     * @member {Array.<IStatusChange>} statusChanges
     * @memberof PutBlockReturn
     * @instance
     */
    PutBlockReturn.prototype.statusChanges = $util.emptyArray;

    /**
     * Creates a new PutBlockReturn instance using the specified properties.
     * @function create
     * @memberof PutBlockReturn
     * @static
     * @param {IPutBlockReturn=} [properties] Properties to set
     * @returns {PutBlockReturn} PutBlockReturn instance
     */
    PutBlockReturn.create = function create(properties) {
        return new PutBlockReturn(properties);
    };

    /**
     * Encodes the specified PutBlockReturn message. Does not implicitly {@link PutBlockReturn.verify|verify} messages.
     * @function encode
     * @memberof PutBlockReturn
     * @static
     * @param {IPutBlockReturn} message PutBlockReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.statusChanges != null && message.statusChanges.length)
            for (var i = 0; i < message.statusChanges.length; ++i)
                $root.StatusChange.encode(message.statusChanges[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutBlockReturn message, length delimited. Does not implicitly {@link PutBlockReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutBlockReturn
     * @static
     * @param {IPutBlockReturn} message PutBlockReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutBlockReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutBlockReturn message from the specified reader or buffer.
     * @function decode
     * @memberof PutBlockReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutBlockReturn} PutBlockReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutBlockReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.statusChanges && message.statusChanges.length))
                    message.statusChanges = [];
                message.statusChanges.push($root.StatusChange.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutBlockReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutBlockReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutBlockReturn} PutBlockReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutBlockReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutBlockReturn message.
     * @function verify
     * @memberof PutBlockReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutBlockReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.statusChanges != null && message.hasOwnProperty("statusChanges")) {
            if (!Array.isArray(message.statusChanges))
                return "statusChanges: array expected";
            for (var i = 0; i < message.statusChanges.length; ++i) {
                var error = $root.StatusChange.verify(message.statusChanges[i]);
                if (error)
                    return "statusChanges." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutBlockReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutBlockReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutBlockReturn} PutBlockReturn
     */
    PutBlockReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.PutBlockReturn)
            return object;
        var message = new $root.PutBlockReturn();
        if (object.statusChanges) {
            if (!Array.isArray(object.statusChanges))
                throw TypeError(".PutBlockReturn.statusChanges: array expected");
            message.statusChanges = [];
            for (var i = 0; i < object.statusChanges.length; ++i) {
                if (typeof object.statusChanges[i] !== "object")
                    throw TypeError(".PutBlockReturn.statusChanges: object expected");
                message.statusChanges[i] = $root.StatusChange.fromObject(object.statusChanges[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutBlockReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutBlockReturn
     * @static
     * @param {PutBlockReturn} message PutBlockReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutBlockReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.statusChanges = [];
        if (message.statusChanges && message.statusChanges.length) {
            object.statusChanges = [];
            for (var j = 0; j < message.statusChanges.length; ++j)
                object.statusChanges[j] = $root.StatusChange.toObject(message.statusChanges[j], options);
        }
        return object;
    };

    /**
     * Converts this PutBlockReturn to JSON.
     * @function toJSON
     * @memberof PutBlockReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutBlockReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutBlockReturn;
})();

$root.NewTx = (function() {

    /**
     * Properties of a NewTx.
     * @exports INewTx
     * @interface INewTx
     * @property {Array.<ITx>|null} [txs] NewTx txs
     */

    /**
     * Constructs a new NewTx.
     * @exports NewTx
     * @classdesc Represents a NewTx.
     * @implements INewTx
     * @constructor
     * @param {INewTx=} [properties] Properties to set
     */
    function NewTx(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewTx txs.
     * @member {Array.<ITx>} txs
     * @memberof NewTx
     * @instance
     */
    NewTx.prototype.txs = $util.emptyArray;

    /**
     * Creates a new NewTx instance using the specified properties.
     * @function create
     * @memberof NewTx
     * @static
     * @param {INewTx=} [properties] Properties to set
     * @returns {NewTx} NewTx instance
     */
    NewTx.create = function create(properties) {
        return new NewTx(properties);
    };

    /**
     * Encodes the specified NewTx message. Does not implicitly {@link NewTx.verify|verify} messages.
     * @function encode
     * @memberof NewTx
     * @static
     * @param {INewTx} message NewTx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewTx.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NewTx message, length delimited. Does not implicitly {@link NewTx.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewTx
     * @static
     * @param {INewTx} message NewTx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewTx.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewTx message from the specified reader or buffer.
     * @function decode
     * @memberof NewTx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewTx} NewTx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewTx.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewTx();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewTx message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewTx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewTx} NewTx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewTx.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewTx message.
     * @function verify
     * @memberof NewTx
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewTx.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a NewTx message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewTx
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewTx} NewTx
     */
    NewTx.fromObject = function fromObject(object) {
        if (object instanceof $root.NewTx)
            return object;
        var message = new $root.NewTx();
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".NewTx.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".NewTx.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a NewTx message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewTx
     * @static
     * @param {NewTx} message NewTx
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewTx.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this NewTx to JSON.
     * @function toJSON
     * @memberof NewTx
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewTx.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewTx;
})();

$root.NewBlock = (function() {

    /**
     * Properties of a NewBlock.
     * @exports INewBlock
     * @interface INewBlock
     * @property {Array.<IBlock>|null} [blocks] NewBlock blocks
     */

    /**
     * Constructs a new NewBlock.
     * @exports NewBlock
     * @classdesc Represents a NewBlock.
     * @implements INewBlock
     * @constructor
     * @param {INewBlock=} [properties] Properties to set
     */
    function NewBlock(properties) {
        this.blocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewBlock blocks.
     * @member {Array.<IBlock>} blocks
     * @memberof NewBlock
     * @instance
     */
    NewBlock.prototype.blocks = $util.emptyArray;

    /**
     * Creates a new NewBlock instance using the specified properties.
     * @function create
     * @memberof NewBlock
     * @static
     * @param {INewBlock=} [properties] Properties to set
     * @returns {NewBlock} NewBlock instance
     */
    NewBlock.create = function create(properties) {
        return new NewBlock(properties);
    };

    /**
     * Encodes the specified NewBlock message. Does not implicitly {@link NewBlock.verify|verify} messages.
     * @function encode
     * @memberof NewBlock
     * @static
     * @param {INewBlock} message NewBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewBlock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.blocks != null && message.blocks.length)
            for (var i = 0; i < message.blocks.length; ++i)
                $root.Block.encode(message.blocks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NewBlock message, length delimited. Does not implicitly {@link NewBlock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewBlock
     * @static
     * @param {INewBlock} message NewBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewBlock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewBlock message from the specified reader or buffer.
     * @function decode
     * @memberof NewBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewBlock} NewBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewBlock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewBlock();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.blocks && message.blocks.length))
                    message.blocks = [];
                message.blocks.push($root.Block.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewBlock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewBlock} NewBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewBlock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewBlock message.
     * @function verify
     * @memberof NewBlock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewBlock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.blocks != null && message.hasOwnProperty("blocks")) {
            if (!Array.isArray(message.blocks))
                return "blocks: array expected";
            for (var i = 0; i < message.blocks.length; ++i) {
                var error = $root.Block.verify(message.blocks[i]);
                if (error)
                    return "blocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a NewBlock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewBlock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewBlock} NewBlock
     */
    NewBlock.fromObject = function fromObject(object) {
        if (object instanceof $root.NewBlock)
            return object;
        var message = new $root.NewBlock();
        if (object.blocks) {
            if (!Array.isArray(object.blocks))
                throw TypeError(".NewBlock.blocks: array expected");
            message.blocks = [];
            for (var i = 0; i < object.blocks.length; ++i) {
                if (typeof object.blocks[i] !== "object")
                    throw TypeError(".NewBlock.blocks: object expected");
                message.blocks[i] = $root.Block.fromObject(object.blocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a NewBlock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewBlock
     * @static
     * @param {NewBlock} message NewBlock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewBlock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.blocks = [];
        if (message.blocks && message.blocks.length) {
            object.blocks = [];
            for (var j = 0; j < message.blocks.length; ++j)
                object.blocks[j] = $root.Block.toObject(message.blocks[j], options);
        }
        return object;
    };

    /**
     * Converts this NewBlock to JSON.
     * @function toJSON
     * @memberof NewBlock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewBlock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewBlock;
})();

$root.GetBlocksByHash = (function() {

    /**
     * Properties of a GetBlocksByHash.
     * @exports IGetBlocksByHash
     * @interface IGetBlocksByHash
     * @property {Array.<Uint8Array>|null} [hashes] GetBlocksByHash hashes
     */

    /**
     * Constructs a new GetBlocksByHash.
     * @exports GetBlocksByHash
     * @classdesc Represents a GetBlocksByHash.
     * @implements IGetBlocksByHash
     * @constructor
     * @param {IGetBlocksByHash=} [properties] Properties to set
     */
    function GetBlocksByHash(properties) {
        this.hashes = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlocksByHash hashes.
     * @member {Array.<Uint8Array>} hashes
     * @memberof GetBlocksByHash
     * @instance
     */
    GetBlocksByHash.prototype.hashes = $util.emptyArray;

    /**
     * Creates a new GetBlocksByHash instance using the specified properties.
     * @function create
     * @memberof GetBlocksByHash
     * @static
     * @param {IGetBlocksByHash=} [properties] Properties to set
     * @returns {GetBlocksByHash} GetBlocksByHash instance
     */
    GetBlocksByHash.create = function create(properties) {
        return new GetBlocksByHash(properties);
    };

    /**
     * Encodes the specified GetBlocksByHash message. Does not implicitly {@link GetBlocksByHash.verify|verify} messages.
     * @function encode
     * @memberof GetBlocksByHash
     * @static
     * @param {IGetBlocksByHash} message GetBlocksByHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByHash.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hashes != null && message.hashes.length)
            for (var i = 0; i < message.hashes.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hashes[i]);
        return writer;
    };

    /**
     * Encodes the specified GetBlocksByHash message, length delimited. Does not implicitly {@link GetBlocksByHash.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlocksByHash
     * @static
     * @param {IGetBlocksByHash} message GetBlocksByHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByHash.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlocksByHash message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlocksByHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlocksByHash} GetBlocksByHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByHash.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlocksByHash();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.hashes && message.hashes.length))
                    message.hashes = [];
                message.hashes.push(reader.bytes());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlocksByHash message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlocksByHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlocksByHash} GetBlocksByHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByHash.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlocksByHash message.
     * @function verify
     * @memberof GetBlocksByHash
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlocksByHash.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hashes != null && message.hasOwnProperty("hashes")) {
            if (!Array.isArray(message.hashes))
                return "hashes: array expected";
            for (var i = 0; i < message.hashes.length; ++i)
                if (!(message.hashes[i] && typeof message.hashes[i].length === "number" || $util.isString(message.hashes[i])))
                    return "hashes: buffer[] expected";
        }
        return null;
    };

    /**
     * Creates a GetBlocksByHash message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlocksByHash
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlocksByHash} GetBlocksByHash
     */
    GetBlocksByHash.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlocksByHash)
            return object;
        var message = new $root.GetBlocksByHash();
        if (object.hashes) {
            if (!Array.isArray(object.hashes))
                throw TypeError(".GetBlocksByHash.hashes: array expected");
            message.hashes = [];
            for (var i = 0; i < object.hashes.length; ++i)
                if (typeof object.hashes[i] === "string")
                    $util.base64.decode(object.hashes[i], message.hashes[i] = $util.newBuffer($util.base64.length(object.hashes[i])), 0);
                else if (object.hashes[i].length)
                    message.hashes[i] = object.hashes[i];
        }
        return message;
    };

    /**
     * Creates a plain object from a GetBlocksByHash message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlocksByHash
     * @static
     * @param {GetBlocksByHash} message GetBlocksByHash
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlocksByHash.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.hashes = [];
        if (message.hashes && message.hashes.length) {
            object.hashes = [];
            for (var j = 0; j < message.hashes.length; ++j)
                object.hashes[j] = options.bytes === String ? $util.base64.encode(message.hashes[j], 0, message.hashes[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.hashes[j]) : message.hashes[j];
        }
        return object;
    };

    /**
     * Converts this GetBlocksByHash to JSON.
     * @function toJSON
     * @memberof GetBlocksByHash
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlocksByHash.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlocksByHash;
})();

$root.GetBlocksByHashReturn = (function() {

    /**
     * Properties of a GetBlocksByHashReturn.
     * @exports IGetBlocksByHashReturn
     * @interface IGetBlocksByHashReturn
     * @property {boolean|null} [success] GetBlocksByHashReturn success
     * @property {Array.<IBlock>|null} [blocks] GetBlocksByHashReturn blocks
     */

    /**
     * Constructs a new GetBlocksByHashReturn.
     * @exports GetBlocksByHashReturn
     * @classdesc Represents a GetBlocksByHashReturn.
     * @implements IGetBlocksByHashReturn
     * @constructor
     * @param {IGetBlocksByHashReturn=} [properties] Properties to set
     */
    function GetBlocksByHashReturn(properties) {
        this.blocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlocksByHashReturn success.
     * @member {boolean} success
     * @memberof GetBlocksByHashReturn
     * @instance
     */
    GetBlocksByHashReturn.prototype.success = false;

    /**
     * GetBlocksByHashReturn blocks.
     * @member {Array.<IBlock>} blocks
     * @memberof GetBlocksByHashReturn
     * @instance
     */
    GetBlocksByHashReturn.prototype.blocks = $util.emptyArray;

    /**
     * Creates a new GetBlocksByHashReturn instance using the specified properties.
     * @function create
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {IGetBlocksByHashReturn=} [properties] Properties to set
     * @returns {GetBlocksByHashReturn} GetBlocksByHashReturn instance
     */
    GetBlocksByHashReturn.create = function create(properties) {
        return new GetBlocksByHashReturn(properties);
    };

    /**
     * Encodes the specified GetBlocksByHashReturn message. Does not implicitly {@link GetBlocksByHashReturn.verify|verify} messages.
     * @function encode
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {IGetBlocksByHashReturn} message GetBlocksByHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByHashReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.blocks != null && message.blocks.length)
            for (var i = 0; i < message.blocks.length; ++i)
                $root.Block.encode(message.blocks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetBlocksByHashReturn message, length delimited. Does not implicitly {@link GetBlocksByHashReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {IGetBlocksByHashReturn} message GetBlocksByHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByHashReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlocksByHashReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlocksByHashReturn} GetBlocksByHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByHashReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlocksByHashReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.blocks && message.blocks.length))
                    message.blocks = [];
                message.blocks.push($root.Block.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlocksByHashReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlocksByHashReturn} GetBlocksByHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByHashReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlocksByHashReturn message.
     * @function verify
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlocksByHashReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.blocks != null && message.hasOwnProperty("blocks")) {
            if (!Array.isArray(message.blocks))
                return "blocks: array expected";
            for (var i = 0; i < message.blocks.length; ++i) {
                var error = $root.Block.verify(message.blocks[i]);
                if (error)
                    return "blocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetBlocksByHashReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlocksByHashReturn} GetBlocksByHashReturn
     */
    GetBlocksByHashReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlocksByHashReturn)
            return object;
        var message = new $root.GetBlocksByHashReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.blocks) {
            if (!Array.isArray(object.blocks))
                throw TypeError(".GetBlocksByHashReturn.blocks: array expected");
            message.blocks = [];
            for (var i = 0; i < object.blocks.length; ++i) {
                if (typeof object.blocks[i] !== "object")
                    throw TypeError(".GetBlocksByHashReturn.blocks: object expected");
                message.blocks[i] = $root.Block.fromObject(object.blocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetBlocksByHashReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlocksByHashReturn
     * @static
     * @param {GetBlocksByHashReturn} message GetBlocksByHashReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlocksByHashReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.blocks = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.blocks && message.blocks.length) {
            object.blocks = [];
            for (var j = 0; j < message.blocks.length; ++j)
                object.blocks[j] = $root.Block.toObject(message.blocks[j], options);
        }
        return object;
    };

    /**
     * Converts this GetBlocksByHashReturn to JSON.
     * @function toJSON
     * @memberof GetBlocksByHashReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlocksByHashReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlocksByHashReturn;
})();

$root.GetHeadersByHash = (function() {

    /**
     * Properties of a GetHeadersByHash.
     * @exports IGetHeadersByHash
     * @interface IGetHeadersByHash
     * @property {Array.<Uint8Array>|null} [hashes] GetHeadersByHash hashes
     */

    /**
     * Constructs a new GetHeadersByHash.
     * @exports GetHeadersByHash
     * @classdesc Represents a GetHeadersByHash.
     * @implements IGetHeadersByHash
     * @constructor
     * @param {IGetHeadersByHash=} [properties] Properties to set
     */
    function GetHeadersByHash(properties) {
        this.hashes = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHeadersByHash hashes.
     * @member {Array.<Uint8Array>} hashes
     * @memberof GetHeadersByHash
     * @instance
     */
    GetHeadersByHash.prototype.hashes = $util.emptyArray;

    /**
     * Creates a new GetHeadersByHash instance using the specified properties.
     * @function create
     * @memberof GetHeadersByHash
     * @static
     * @param {IGetHeadersByHash=} [properties] Properties to set
     * @returns {GetHeadersByHash} GetHeadersByHash instance
     */
    GetHeadersByHash.create = function create(properties) {
        return new GetHeadersByHash(properties);
    };

    /**
     * Encodes the specified GetHeadersByHash message. Does not implicitly {@link GetHeadersByHash.verify|verify} messages.
     * @function encode
     * @memberof GetHeadersByHash
     * @static
     * @param {IGetHeadersByHash} message GetHeadersByHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByHash.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hashes != null && message.hashes.length)
            for (var i = 0; i < message.hashes.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hashes[i]);
        return writer;
    };

    /**
     * Encodes the specified GetHeadersByHash message, length delimited. Does not implicitly {@link GetHeadersByHash.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHeadersByHash
     * @static
     * @param {IGetHeadersByHash} message GetHeadersByHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByHash.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHeadersByHash message from the specified reader or buffer.
     * @function decode
     * @memberof GetHeadersByHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHeadersByHash} GetHeadersByHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByHash.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHeadersByHash();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.hashes && message.hashes.length))
                    message.hashes = [];
                message.hashes.push(reader.bytes());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHeadersByHash message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHeadersByHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHeadersByHash} GetHeadersByHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByHash.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHeadersByHash message.
     * @function verify
     * @memberof GetHeadersByHash
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHeadersByHash.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hashes != null && message.hasOwnProperty("hashes")) {
            if (!Array.isArray(message.hashes))
                return "hashes: array expected";
            for (var i = 0; i < message.hashes.length; ++i)
                if (!(message.hashes[i] && typeof message.hashes[i].length === "number" || $util.isString(message.hashes[i])))
                    return "hashes: buffer[] expected";
        }
        return null;
    };

    /**
     * Creates a GetHeadersByHash message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHeadersByHash
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHeadersByHash} GetHeadersByHash
     */
    GetHeadersByHash.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHeadersByHash)
            return object;
        var message = new $root.GetHeadersByHash();
        if (object.hashes) {
            if (!Array.isArray(object.hashes))
                throw TypeError(".GetHeadersByHash.hashes: array expected");
            message.hashes = [];
            for (var i = 0; i < object.hashes.length; ++i)
                if (typeof object.hashes[i] === "string")
                    $util.base64.decode(object.hashes[i], message.hashes[i] = $util.newBuffer($util.base64.length(object.hashes[i])), 0);
                else if (object.hashes[i].length)
                    message.hashes[i] = object.hashes[i];
        }
        return message;
    };

    /**
     * Creates a plain object from a GetHeadersByHash message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHeadersByHash
     * @static
     * @param {GetHeadersByHash} message GetHeadersByHash
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHeadersByHash.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.hashes = [];
        if (message.hashes && message.hashes.length) {
            object.hashes = [];
            for (var j = 0; j < message.hashes.length; ++j)
                object.hashes[j] = options.bytes === String ? $util.base64.encode(message.hashes[j], 0, message.hashes[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.hashes[j]) : message.hashes[j];
        }
        return object;
    };

    /**
     * Converts this GetHeadersByHash to JSON.
     * @function toJSON
     * @memberof GetHeadersByHash
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHeadersByHash.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHeadersByHash;
})();

$root.GetHeadersByHashReturn = (function() {

    /**
     * Properties of a GetHeadersByHashReturn.
     * @exports IGetHeadersByHashReturn
     * @interface IGetHeadersByHashReturn
     * @property {boolean|null} [success] GetHeadersByHashReturn success
     * @property {Array.<IBlockHeader>|null} [headers] GetHeadersByHashReturn headers
     */

    /**
     * Constructs a new GetHeadersByHashReturn.
     * @exports GetHeadersByHashReturn
     * @classdesc Represents a GetHeadersByHashReturn.
     * @implements IGetHeadersByHashReturn
     * @constructor
     * @param {IGetHeadersByHashReturn=} [properties] Properties to set
     */
    function GetHeadersByHashReturn(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHeadersByHashReturn success.
     * @member {boolean} success
     * @memberof GetHeadersByHashReturn
     * @instance
     */
    GetHeadersByHashReturn.prototype.success = false;

    /**
     * GetHeadersByHashReturn headers.
     * @member {Array.<IBlockHeader>} headers
     * @memberof GetHeadersByHashReturn
     * @instance
     */
    GetHeadersByHashReturn.prototype.headers = $util.emptyArray;

    /**
     * Creates a new GetHeadersByHashReturn instance using the specified properties.
     * @function create
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {IGetHeadersByHashReturn=} [properties] Properties to set
     * @returns {GetHeadersByHashReturn} GetHeadersByHashReturn instance
     */
    GetHeadersByHashReturn.create = function create(properties) {
        return new GetHeadersByHashReturn(properties);
    };

    /**
     * Encodes the specified GetHeadersByHashReturn message. Does not implicitly {@link GetHeadersByHashReturn.verify|verify} messages.
     * @function encode
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {IGetHeadersByHashReturn} message GetHeadersByHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByHashReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                $root.BlockHeader.encode(message.headers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetHeadersByHashReturn message, length delimited. Does not implicitly {@link GetHeadersByHashReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {IGetHeadersByHashReturn} message GetHeadersByHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByHashReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHeadersByHashReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHeadersByHashReturn} GetHeadersByHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByHashReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHeadersByHashReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push($root.BlockHeader.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHeadersByHashReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHeadersByHashReturn} GetHeadersByHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByHashReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHeadersByHashReturn message.
     * @function verify
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHeadersByHashReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i) {
                var error = $root.BlockHeader.verify(message.headers[i]);
                if (error)
                    return "headers." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetHeadersByHashReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHeadersByHashReturn} GetHeadersByHashReturn
     */
    GetHeadersByHashReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHeadersByHashReturn)
            return object;
        var message = new $root.GetHeadersByHashReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".GetHeadersByHashReturn.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i) {
                if (typeof object.headers[i] !== "object")
                    throw TypeError(".GetHeadersByHashReturn.headers: object expected");
                message.headers[i] = $root.BlockHeader.fromObject(object.headers[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetHeadersByHashReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHeadersByHashReturn
     * @static
     * @param {GetHeadersByHashReturn} message GetHeadersByHashReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHeadersByHashReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = $root.BlockHeader.toObject(message.headers[j], options);
        }
        return object;
    };

    /**
     * Converts this GetHeadersByHashReturn to JSON.
     * @function toJSON
     * @memberof GetHeadersByHashReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHeadersByHashReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHeadersByHashReturn;
})();

$root.GetBlocksByRange = (function() {

    /**
     * Properties of a GetBlocksByRange.
     * @exports IGetBlocksByRange
     * @interface IGetBlocksByRange
     * @property {number|Long|null} [fromHeight] GetBlocksByRange fromHeight
     * @property {number|Long|null} [count] GetBlocksByRange count
     */

    /**
     * Constructs a new GetBlocksByRange.
     * @exports GetBlocksByRange
     * @classdesc Represents a GetBlocksByRange.
     * @implements IGetBlocksByRange
     * @constructor
     * @param {IGetBlocksByRange=} [properties] Properties to set
     */
    function GetBlocksByRange(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlocksByRange fromHeight.
     * @member {number|Long} fromHeight
     * @memberof GetBlocksByRange
     * @instance
     */
    GetBlocksByRange.prototype.fromHeight = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GetBlocksByRange count.
     * @member {number|Long} count
     * @memberof GetBlocksByRange
     * @instance
     */
    GetBlocksByRange.prototype.count = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new GetBlocksByRange instance using the specified properties.
     * @function create
     * @memberof GetBlocksByRange
     * @static
     * @param {IGetBlocksByRange=} [properties] Properties to set
     * @returns {GetBlocksByRange} GetBlocksByRange instance
     */
    GetBlocksByRange.create = function create(properties) {
        return new GetBlocksByRange(properties);
    };

    /**
     * Encodes the specified GetBlocksByRange message. Does not implicitly {@link GetBlocksByRange.verify|verify} messages.
     * @function encode
     * @memberof GetBlocksByRange
     * @static
     * @param {IGetBlocksByRange} message GetBlocksByRange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByRange.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.fromHeight);
        if (message.count != null && message.hasOwnProperty("count"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.count);
        return writer;
    };

    /**
     * Encodes the specified GetBlocksByRange message, length delimited. Does not implicitly {@link GetBlocksByRange.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlocksByRange
     * @static
     * @param {IGetBlocksByRange} message GetBlocksByRange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByRange.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlocksByRange message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlocksByRange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlocksByRange} GetBlocksByRange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByRange.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlocksByRange();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.fromHeight = reader.uint64();
                break;
            case 2:
                message.count = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlocksByRange message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlocksByRange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlocksByRange} GetBlocksByRange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByRange.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlocksByRange message.
     * @function verify
     * @memberof GetBlocksByRange
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlocksByRange.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            if (!$util.isInteger(message.fromHeight) && !(message.fromHeight && $util.isInteger(message.fromHeight.low) && $util.isInteger(message.fromHeight.high)))
                return "fromHeight: integer|Long expected";
        if (message.count != null && message.hasOwnProperty("count"))
            if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
                return "count: integer|Long expected";
        return null;
    };

    /**
     * Creates a GetBlocksByRange message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlocksByRange
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlocksByRange} GetBlocksByRange
     */
    GetBlocksByRange.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlocksByRange)
            return object;
        var message = new $root.GetBlocksByRange();
        if (object.fromHeight != null)
            if ($util.Long)
                (message.fromHeight = $util.Long.fromValue(object.fromHeight)).unsigned = true;
            else if (typeof object.fromHeight === "string")
                message.fromHeight = parseInt(object.fromHeight, 10);
            else if (typeof object.fromHeight === "number")
                message.fromHeight = object.fromHeight;
            else if (typeof object.fromHeight === "object")
                message.fromHeight = new $util.LongBits(object.fromHeight.low >>> 0, object.fromHeight.high >>> 0).toNumber(true);
        if (object.count != null)
            if ($util.Long)
                (message.count = $util.Long.fromValue(object.count)).unsigned = true;
            else if (typeof object.count === "string")
                message.count = parseInt(object.count, 10);
            else if (typeof object.count === "number")
                message.count = object.count;
            else if (typeof object.count === "object")
                message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a GetBlocksByRange message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlocksByRange
     * @static
     * @param {GetBlocksByRange} message GetBlocksByRange
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlocksByRange.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.fromHeight = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.fromHeight = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.count = options.longs === String ? "0" : 0;
        }
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            if (typeof message.fromHeight === "number")
                object.fromHeight = options.longs === String ? String(message.fromHeight) : message.fromHeight;
            else
                object.fromHeight = options.longs === String ? $util.Long.prototype.toString.call(message.fromHeight) : options.longs === Number ? new $util.LongBits(message.fromHeight.low >>> 0, message.fromHeight.high >>> 0).toNumber(true) : message.fromHeight;
        if (message.count != null && message.hasOwnProperty("count"))
            if (typeof message.count === "number")
                object.count = options.longs === String ? String(message.count) : message.count;
            else
                object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber(true) : message.count;
        return object;
    };

    /**
     * Converts this GetBlocksByRange to JSON.
     * @function toJSON
     * @memberof GetBlocksByRange
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlocksByRange.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlocksByRange;
})();

$root.GetBlocksByRangeReturn = (function() {

    /**
     * Properties of a GetBlocksByRangeReturn.
     * @exports IGetBlocksByRangeReturn
     * @interface IGetBlocksByRangeReturn
     * @property {boolean|null} [success] GetBlocksByRangeReturn success
     * @property {Array.<IBlock>|null} [blocks] GetBlocksByRangeReturn blocks
     */

    /**
     * Constructs a new GetBlocksByRangeReturn.
     * @exports GetBlocksByRangeReturn
     * @classdesc Represents a GetBlocksByRangeReturn.
     * @implements IGetBlocksByRangeReturn
     * @constructor
     * @param {IGetBlocksByRangeReturn=} [properties] Properties to set
     */
    function GetBlocksByRangeReturn(properties) {
        this.blocks = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetBlocksByRangeReturn success.
     * @member {boolean} success
     * @memberof GetBlocksByRangeReturn
     * @instance
     */
    GetBlocksByRangeReturn.prototype.success = false;

    /**
     * GetBlocksByRangeReturn blocks.
     * @member {Array.<IBlock>} blocks
     * @memberof GetBlocksByRangeReturn
     * @instance
     */
    GetBlocksByRangeReturn.prototype.blocks = $util.emptyArray;

    /**
     * Creates a new GetBlocksByRangeReturn instance using the specified properties.
     * @function create
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {IGetBlocksByRangeReturn=} [properties] Properties to set
     * @returns {GetBlocksByRangeReturn} GetBlocksByRangeReturn instance
     */
    GetBlocksByRangeReturn.create = function create(properties) {
        return new GetBlocksByRangeReturn(properties);
    };

    /**
     * Encodes the specified GetBlocksByRangeReturn message. Does not implicitly {@link GetBlocksByRangeReturn.verify|verify} messages.
     * @function encode
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {IGetBlocksByRangeReturn} message GetBlocksByRangeReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByRangeReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.blocks != null && message.blocks.length)
            for (var i = 0; i < message.blocks.length; ++i)
                $root.Block.encode(message.blocks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetBlocksByRangeReturn message, length delimited. Does not implicitly {@link GetBlocksByRangeReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {IGetBlocksByRangeReturn} message GetBlocksByRangeReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetBlocksByRangeReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetBlocksByRangeReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetBlocksByRangeReturn} GetBlocksByRangeReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByRangeReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetBlocksByRangeReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.blocks && message.blocks.length))
                    message.blocks = [];
                message.blocks.push($root.Block.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetBlocksByRangeReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetBlocksByRangeReturn} GetBlocksByRangeReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetBlocksByRangeReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetBlocksByRangeReturn message.
     * @function verify
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetBlocksByRangeReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.blocks != null && message.hasOwnProperty("blocks")) {
            if (!Array.isArray(message.blocks))
                return "blocks: array expected";
            for (var i = 0; i < message.blocks.length; ++i) {
                var error = $root.Block.verify(message.blocks[i]);
                if (error)
                    return "blocks." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetBlocksByRangeReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetBlocksByRangeReturn} GetBlocksByRangeReturn
     */
    GetBlocksByRangeReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetBlocksByRangeReturn)
            return object;
        var message = new $root.GetBlocksByRangeReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.blocks) {
            if (!Array.isArray(object.blocks))
                throw TypeError(".GetBlocksByRangeReturn.blocks: array expected");
            message.blocks = [];
            for (var i = 0; i < object.blocks.length; ++i) {
                if (typeof object.blocks[i] !== "object")
                    throw TypeError(".GetBlocksByRangeReturn.blocks: object expected");
                message.blocks[i] = $root.Block.fromObject(object.blocks[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetBlocksByRangeReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetBlocksByRangeReturn
     * @static
     * @param {GetBlocksByRangeReturn} message GetBlocksByRangeReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetBlocksByRangeReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.blocks = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.blocks && message.blocks.length) {
            object.blocks = [];
            for (var j = 0; j < message.blocks.length; ++j)
                object.blocks[j] = $root.Block.toObject(message.blocks[j], options);
        }
        return object;
    };

    /**
     * Converts this GetBlocksByRangeReturn to JSON.
     * @function toJSON
     * @memberof GetBlocksByRangeReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetBlocksByRangeReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetBlocksByRangeReturn;
})();

$root.GetHeadersByRange = (function() {

    /**
     * Properties of a GetHeadersByRange.
     * @exports IGetHeadersByRange
     * @interface IGetHeadersByRange
     * @property {number|Long|null} [fromHeight] GetHeadersByRange fromHeight
     * @property {number|Long|null} [count] GetHeadersByRange count
     */

    /**
     * Constructs a new GetHeadersByRange.
     * @exports GetHeadersByRange
     * @classdesc Represents a GetHeadersByRange.
     * @implements IGetHeadersByRange
     * @constructor
     * @param {IGetHeadersByRange=} [properties] Properties to set
     */
    function GetHeadersByRange(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHeadersByRange fromHeight.
     * @member {number|Long} fromHeight
     * @memberof GetHeadersByRange
     * @instance
     */
    GetHeadersByRange.prototype.fromHeight = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GetHeadersByRange count.
     * @member {number|Long} count
     * @memberof GetHeadersByRange
     * @instance
     */
    GetHeadersByRange.prototype.count = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new GetHeadersByRange instance using the specified properties.
     * @function create
     * @memberof GetHeadersByRange
     * @static
     * @param {IGetHeadersByRange=} [properties] Properties to set
     * @returns {GetHeadersByRange} GetHeadersByRange instance
     */
    GetHeadersByRange.create = function create(properties) {
        return new GetHeadersByRange(properties);
    };

    /**
     * Encodes the specified GetHeadersByRange message. Does not implicitly {@link GetHeadersByRange.verify|verify} messages.
     * @function encode
     * @memberof GetHeadersByRange
     * @static
     * @param {IGetHeadersByRange} message GetHeadersByRange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByRange.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.fromHeight);
        if (message.count != null && message.hasOwnProperty("count"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.count);
        return writer;
    };

    /**
     * Encodes the specified GetHeadersByRange message, length delimited. Does not implicitly {@link GetHeadersByRange.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHeadersByRange
     * @static
     * @param {IGetHeadersByRange} message GetHeadersByRange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByRange.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHeadersByRange message from the specified reader or buffer.
     * @function decode
     * @memberof GetHeadersByRange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHeadersByRange} GetHeadersByRange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByRange.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHeadersByRange();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.fromHeight = reader.uint64();
                break;
            case 2:
                message.count = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHeadersByRange message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHeadersByRange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHeadersByRange} GetHeadersByRange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByRange.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHeadersByRange message.
     * @function verify
     * @memberof GetHeadersByRange
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHeadersByRange.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            if (!$util.isInteger(message.fromHeight) && !(message.fromHeight && $util.isInteger(message.fromHeight.low) && $util.isInteger(message.fromHeight.high)))
                return "fromHeight: integer|Long expected";
        if (message.count != null && message.hasOwnProperty("count"))
            if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
                return "count: integer|Long expected";
        return null;
    };

    /**
     * Creates a GetHeadersByRange message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHeadersByRange
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHeadersByRange} GetHeadersByRange
     */
    GetHeadersByRange.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHeadersByRange)
            return object;
        var message = new $root.GetHeadersByRange();
        if (object.fromHeight != null)
            if ($util.Long)
                (message.fromHeight = $util.Long.fromValue(object.fromHeight)).unsigned = true;
            else if (typeof object.fromHeight === "string")
                message.fromHeight = parseInt(object.fromHeight, 10);
            else if (typeof object.fromHeight === "number")
                message.fromHeight = object.fromHeight;
            else if (typeof object.fromHeight === "object")
                message.fromHeight = new $util.LongBits(object.fromHeight.low >>> 0, object.fromHeight.high >>> 0).toNumber(true);
        if (object.count != null)
            if ($util.Long)
                (message.count = $util.Long.fromValue(object.count)).unsigned = true;
            else if (typeof object.count === "string")
                message.count = parseInt(object.count, 10);
            else if (typeof object.count === "number")
                message.count = object.count;
            else if (typeof object.count === "object")
                message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a GetHeadersByRange message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHeadersByRange
     * @static
     * @param {GetHeadersByRange} message GetHeadersByRange
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHeadersByRange.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.fromHeight = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.fromHeight = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.count = options.longs === String ? "0" : 0;
        }
        if (message.fromHeight != null && message.hasOwnProperty("fromHeight"))
            if (typeof message.fromHeight === "number")
                object.fromHeight = options.longs === String ? String(message.fromHeight) : message.fromHeight;
            else
                object.fromHeight = options.longs === String ? $util.Long.prototype.toString.call(message.fromHeight) : options.longs === Number ? new $util.LongBits(message.fromHeight.low >>> 0, message.fromHeight.high >>> 0).toNumber(true) : message.fromHeight;
        if (message.count != null && message.hasOwnProperty("count"))
            if (typeof message.count === "number")
                object.count = options.longs === String ? String(message.count) : message.count;
            else
                object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber(true) : message.count;
        return object;
    };

    /**
     * Converts this GetHeadersByRange to JSON.
     * @function toJSON
     * @memberof GetHeadersByRange
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHeadersByRange.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHeadersByRange;
})();

$root.GetHeadersByRangeReturn = (function() {

    /**
     * Properties of a GetHeadersByRangeReturn.
     * @exports IGetHeadersByRangeReturn
     * @interface IGetHeadersByRangeReturn
     * @property {boolean|null} [success] GetHeadersByRangeReturn success
     * @property {Array.<IBlockHeader>|null} [headers] GetHeadersByRangeReturn headers
     */

    /**
     * Constructs a new GetHeadersByRangeReturn.
     * @exports GetHeadersByRangeReturn
     * @classdesc Represents a GetHeadersByRangeReturn.
     * @implements IGetHeadersByRangeReturn
     * @constructor
     * @param {IGetHeadersByRangeReturn=} [properties] Properties to set
     */
    function GetHeadersByRangeReturn(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHeadersByRangeReturn success.
     * @member {boolean} success
     * @memberof GetHeadersByRangeReturn
     * @instance
     */
    GetHeadersByRangeReturn.prototype.success = false;

    /**
     * GetHeadersByRangeReturn headers.
     * @member {Array.<IBlockHeader>} headers
     * @memberof GetHeadersByRangeReturn
     * @instance
     */
    GetHeadersByRangeReturn.prototype.headers = $util.emptyArray;

    /**
     * Creates a new GetHeadersByRangeReturn instance using the specified properties.
     * @function create
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {IGetHeadersByRangeReturn=} [properties] Properties to set
     * @returns {GetHeadersByRangeReturn} GetHeadersByRangeReturn instance
     */
    GetHeadersByRangeReturn.create = function create(properties) {
        return new GetHeadersByRangeReturn(properties);
    };

    /**
     * Encodes the specified GetHeadersByRangeReturn message. Does not implicitly {@link GetHeadersByRangeReturn.verify|verify} messages.
     * @function encode
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {IGetHeadersByRangeReturn} message GetHeadersByRangeReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByRangeReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                $root.BlockHeader.encode(message.headers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetHeadersByRangeReturn message, length delimited. Does not implicitly {@link GetHeadersByRangeReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {IGetHeadersByRangeReturn} message GetHeadersByRangeReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHeadersByRangeReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHeadersByRangeReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHeadersByRangeReturn} GetHeadersByRangeReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByRangeReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHeadersByRangeReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push($root.BlockHeader.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHeadersByRangeReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHeadersByRangeReturn} GetHeadersByRangeReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHeadersByRangeReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHeadersByRangeReturn message.
     * @function verify
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHeadersByRangeReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i) {
                var error = $root.BlockHeader.verify(message.headers[i]);
                if (error)
                    return "headers." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetHeadersByRangeReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHeadersByRangeReturn} GetHeadersByRangeReturn
     */
    GetHeadersByRangeReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHeadersByRangeReturn)
            return object;
        var message = new $root.GetHeadersByRangeReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".GetHeadersByRangeReturn.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i) {
                if (typeof object.headers[i] !== "object")
                    throw TypeError(".GetHeadersByRangeReturn.headers: object expected");
                message.headers[i] = $root.BlockHeader.fromObject(object.headers[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetHeadersByRangeReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHeadersByRangeReturn
     * @static
     * @param {GetHeadersByRangeReturn} message GetHeadersByRangeReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHeadersByRangeReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = $root.BlockHeader.toObject(message.headers[j], options);
        }
        return object;
    };

    /**
     * Converts this GetHeadersByRangeReturn to JSON.
     * @function toJSON
     * @memberof GetHeadersByRangeReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHeadersByRangeReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHeadersByRangeReturn;
})();

$root.GetPeers = (function() {

    /**
     * Properties of a GetPeers.
     * @exports IGetPeers
     * @interface IGetPeers
     * @property {number|null} [count] GetPeers count
     */

    /**
     * Constructs a new GetPeers.
     * @exports GetPeers
     * @classdesc Represents a GetPeers.
     * @implements IGetPeers
     * @constructor
     * @param {IGetPeers=} [properties] Properties to set
     */
    function GetPeers(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetPeers count.
     * @member {number} count
     * @memberof GetPeers
     * @instance
     */
    GetPeers.prototype.count = 0;

    /**
     * Creates a new GetPeers instance using the specified properties.
     * @function create
     * @memberof GetPeers
     * @static
     * @param {IGetPeers=} [properties] Properties to set
     * @returns {GetPeers} GetPeers instance
     */
    GetPeers.create = function create(properties) {
        return new GetPeers(properties);
    };

    /**
     * Encodes the specified GetPeers message. Does not implicitly {@link GetPeers.verify|verify} messages.
     * @function encode
     * @memberof GetPeers
     * @static
     * @param {IGetPeers} message GetPeers message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetPeers.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.count != null && message.hasOwnProperty("count"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.count);
        return writer;
    };

    /**
     * Encodes the specified GetPeers message, length delimited. Does not implicitly {@link GetPeers.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetPeers
     * @static
     * @param {IGetPeers} message GetPeers message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetPeers.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetPeers message from the specified reader or buffer.
     * @function decode
     * @memberof GetPeers
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetPeers} GetPeers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetPeers.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetPeers();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.count = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetPeers message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetPeers
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetPeers} GetPeers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetPeers.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetPeers message.
     * @function verify
     * @memberof GetPeers
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetPeers.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.count != null && message.hasOwnProperty("count"))
            if (!$util.isInteger(message.count))
                return "count: integer expected";
        return null;
    };

    /**
     * Creates a GetPeers message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetPeers
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetPeers} GetPeers
     */
    GetPeers.fromObject = function fromObject(object) {
        if (object instanceof $root.GetPeers)
            return object;
        var message = new $root.GetPeers();
        if (object.count != null)
            message.count = object.count >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a GetPeers message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetPeers
     * @static
     * @param {GetPeers} message GetPeers
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetPeers.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.count = 0;
        if (message.count != null && message.hasOwnProperty("count"))
            object.count = message.count;
        return object;
    };

    /**
     * Converts this GetPeers to JSON.
     * @function toJSON
     * @memberof GetPeers
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetPeers.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetPeers;
})();

$root.GetPeersReturn = (function() {

    /**
     * Properties of a GetPeersReturn.
     * @exports IGetPeersReturn
     * @interface IGetPeersReturn
     * @property {boolean|null} [success] GetPeersReturn success
     * @property {Array.<IPeer>|null} [peers] GetPeersReturn peers
     */

    /**
     * Constructs a new GetPeersReturn.
     * @exports GetPeersReturn
     * @classdesc Represents a GetPeersReturn.
     * @implements IGetPeersReturn
     * @constructor
     * @param {IGetPeersReturn=} [properties] Properties to set
     */
    function GetPeersReturn(properties) {
        this.peers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetPeersReturn success.
     * @member {boolean} success
     * @memberof GetPeersReturn
     * @instance
     */
    GetPeersReturn.prototype.success = false;

    /**
     * GetPeersReturn peers.
     * @member {Array.<IPeer>} peers
     * @memberof GetPeersReturn
     * @instance
     */
    GetPeersReturn.prototype.peers = $util.emptyArray;

    /**
     * Creates a new GetPeersReturn instance using the specified properties.
     * @function create
     * @memberof GetPeersReturn
     * @static
     * @param {IGetPeersReturn=} [properties] Properties to set
     * @returns {GetPeersReturn} GetPeersReturn instance
     */
    GetPeersReturn.create = function create(properties) {
        return new GetPeersReturn(properties);
    };

    /**
     * Encodes the specified GetPeersReturn message. Does not implicitly {@link GetPeersReturn.verify|verify} messages.
     * @function encode
     * @memberof GetPeersReturn
     * @static
     * @param {IGetPeersReturn} message GetPeersReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetPeersReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.peers != null && message.peers.length)
            for (var i = 0; i < message.peers.length; ++i)
                $root.Peer.encode(message.peers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetPeersReturn message, length delimited. Does not implicitly {@link GetPeersReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetPeersReturn
     * @static
     * @param {IGetPeersReturn} message GetPeersReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetPeersReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetPeersReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetPeersReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetPeersReturn} GetPeersReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetPeersReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetPeersReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                if (!(message.peers && message.peers.length))
                    message.peers = [];
                message.peers.push($root.Peer.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetPeersReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetPeersReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetPeersReturn} GetPeersReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetPeersReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetPeersReturn message.
     * @function verify
     * @memberof GetPeersReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetPeersReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.peers != null && message.hasOwnProperty("peers")) {
            if (!Array.isArray(message.peers))
                return "peers: array expected";
            for (var i = 0; i < message.peers.length; ++i) {
                var error = $root.Peer.verify(message.peers[i]);
                if (error)
                    return "peers." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetPeersReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetPeersReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetPeersReturn} GetPeersReturn
     */
    GetPeersReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetPeersReturn)
            return object;
        var message = new $root.GetPeersReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.peers) {
            if (!Array.isArray(object.peers))
                throw TypeError(".GetPeersReturn.peers: array expected");
            message.peers = [];
            for (var i = 0; i < object.peers.length; ++i) {
                if (typeof object.peers[i] !== "object")
                    throw TypeError(".GetPeersReturn.peers: object expected");
                message.peers[i] = $root.Peer.fromObject(object.peers[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetPeersReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetPeersReturn
     * @static
     * @param {GetPeersReturn} message GetPeersReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetPeersReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.peers = [];
        if (options.defaults)
            object.success = false;
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.peers && message.peers.length) {
            object.peers = [];
            for (var j = 0; j < message.peers.length; ++j)
                object.peers[j] = $root.Peer.toObject(message.peers[j], options);
        }
        return object;
    };

    /**
     * Converts this GetPeersReturn to JSON.
     * @function toJSON
     * @memberof GetPeersReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetPeersReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetPeersReturn;
})();

$root.GetTip = (function() {

    /**
     * Properties of a GetTip.
     * @exports IGetTip
     * @interface IGetTip
     * @property {number|Long|null} [dummy] GetTip dummy
     * @property {boolean|null} [header] GetTip header
     */

    /**
     * Constructs a new GetTip.
     * @exports GetTip
     * @classdesc Represents a GetTip.
     * @implements IGetTip
     * @constructor
     * @param {IGetTip=} [properties] Properties to set
     */
    function GetTip(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetTip dummy.
     * @member {number|Long} dummy
     * @memberof GetTip
     * @instance
     */
    GetTip.prototype.dummy = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GetTip header.
     * @member {boolean} header
     * @memberof GetTip
     * @instance
     */
    GetTip.prototype.header = false;

    /**
     * Creates a new GetTip instance using the specified properties.
     * @function create
     * @memberof GetTip
     * @static
     * @param {IGetTip=} [properties] Properties to set
     * @returns {GetTip} GetTip instance
     */
    GetTip.create = function create(properties) {
        return new GetTip(properties);
    };

    /**
     * Encodes the specified GetTip message. Does not implicitly {@link GetTip.verify|verify} messages.
     * @function encode
     * @memberof GetTip
     * @static
     * @param {IGetTip} message GetTip message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTip.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dummy != null && message.hasOwnProperty("dummy"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.dummy);
        if (message.header != null && message.hasOwnProperty("header"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.header);
        return writer;
    };

    /**
     * Encodes the specified GetTip message, length delimited. Does not implicitly {@link GetTip.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetTip
     * @static
     * @param {IGetTip} message GetTip message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTip.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetTip message from the specified reader or buffer.
     * @function decode
     * @memberof GetTip
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetTip} GetTip
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTip.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetTip();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.dummy = reader.uint64();
                break;
            case 2:
                message.header = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetTip message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetTip
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetTip} GetTip
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTip.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetTip message.
     * @function verify
     * @memberof GetTip
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetTip.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dummy != null && message.hasOwnProperty("dummy"))
            if (!$util.isInteger(message.dummy) && !(message.dummy && $util.isInteger(message.dummy.low) && $util.isInteger(message.dummy.high)))
                return "dummy: integer|Long expected";
        if (message.header != null && message.hasOwnProperty("header"))
            if (typeof message.header !== "boolean")
                return "header: boolean expected";
        return null;
    };

    /**
     * Creates a GetTip message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetTip
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetTip} GetTip
     */
    GetTip.fromObject = function fromObject(object) {
        if (object instanceof $root.GetTip)
            return object;
        var message = new $root.GetTip();
        if (object.dummy != null)
            if ($util.Long)
                (message.dummy = $util.Long.fromValue(object.dummy)).unsigned = true;
            else if (typeof object.dummy === "string")
                message.dummy = parseInt(object.dummy, 10);
            else if (typeof object.dummy === "number")
                message.dummy = object.dummy;
            else if (typeof object.dummy === "object")
                message.dummy = new $util.LongBits(object.dummy.low >>> 0, object.dummy.high >>> 0).toNumber(true);
        if (object.header != null)
            message.header = Boolean(object.header);
        return message;
    };

    /**
     * Creates a plain object from a GetTip message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetTip
     * @static
     * @param {GetTip} message GetTip
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetTip.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.dummy = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.dummy = options.longs === String ? "0" : 0;
            object.header = false;
        }
        if (message.dummy != null && message.hasOwnProperty("dummy"))
            if (typeof message.dummy === "number")
                object.dummy = options.longs === String ? String(message.dummy) : message.dummy;
            else
                object.dummy = options.longs === String ? $util.Long.prototype.toString.call(message.dummy) : options.longs === Number ? new $util.LongBits(message.dummy.low >>> 0, message.dummy.high >>> 0).toNumber(true) : message.dummy;
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = message.header;
        return object;
    };

    /**
     * Converts this GetTip to JSON.
     * @function toJSON
     * @memberof GetTip
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetTip.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetTip;
})();

$root.GetTipReturn = (function() {

    /**
     * Properties of a GetTipReturn.
     * @exports IGetTipReturn
     * @interface IGetTipReturn
     * @property {boolean|null} [success] GetTipReturn success
     * @property {Uint8Array|null} [hash] GetTipReturn hash
     * @property {number|Long|null} [height] GetTipReturn height
     * @property {number|null} [totalwork] GetTipReturn totalwork
     */

    /**
     * Constructs a new GetTipReturn.
     * @exports GetTipReturn
     * @classdesc Represents a GetTipReturn.
     * @implements IGetTipReturn
     * @constructor
     * @param {IGetTipReturn=} [properties] Properties to set
     */
    function GetTipReturn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetTipReturn success.
     * @member {boolean} success
     * @memberof GetTipReturn
     * @instance
     */
    GetTipReturn.prototype.success = false;

    /**
     * GetTipReturn hash.
     * @member {Uint8Array} hash
     * @memberof GetTipReturn
     * @instance
     */
    GetTipReturn.prototype.hash = $util.newBuffer([]);

    /**
     * GetTipReturn height.
     * @member {number|Long} height
     * @memberof GetTipReturn
     * @instance
     */
    GetTipReturn.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GetTipReturn totalwork.
     * @member {number} totalwork
     * @memberof GetTipReturn
     * @instance
     */
    GetTipReturn.prototype.totalwork = 0;

    /**
     * Creates a new GetTipReturn instance using the specified properties.
     * @function create
     * @memberof GetTipReturn
     * @static
     * @param {IGetTipReturn=} [properties] Properties to set
     * @returns {GetTipReturn} GetTipReturn instance
     */
    GetTipReturn.create = function create(properties) {
        return new GetTipReturn(properties);
    };

    /**
     * Encodes the specified GetTipReturn message. Does not implicitly {@link GetTipReturn.verify|verify} messages.
     * @function encode
     * @memberof GetTipReturn
     * @static
     * @param {IGetTipReturn} message GetTipReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTipReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.hash);
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.height);
        if (message.totalwork != null && message.hasOwnProperty("totalwork"))
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.totalwork);
        return writer;
    };

    /**
     * Encodes the specified GetTipReturn message, length delimited. Does not implicitly {@link GetTipReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetTipReturn
     * @static
     * @param {IGetTipReturn} message GetTipReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetTipReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetTipReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetTipReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetTipReturn} GetTipReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTipReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetTipReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                message.hash = reader.bytes();
                break;
            case 3:
                message.height = reader.uint64();
                break;
            case 4:
                message.totalwork = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetTipReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetTipReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetTipReturn} GetTipReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetTipReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetTipReturn message.
     * @function verify
     * @memberof GetTipReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetTipReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.totalwork != null && message.hasOwnProperty("totalwork"))
            if (typeof message.totalwork !== "number")
                return "totalwork: number expected";
        return null;
    };

    /**
     * Creates a GetTipReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetTipReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetTipReturn} GetTipReturn
     */
    GetTipReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetTipReturn)
            return object;
        var message = new $root.GetTipReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = true;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
        if (object.totalwork != null)
            message.totalwork = Number(object.totalwork);
        return message;
    };

    /**
     * Creates a plain object from a GetTipReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetTipReturn
     * @static
     * @param {GetTipReturn} message GetTipReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetTipReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.success = false;
            object.hash = options.bytes === String ? "" : [];
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            object.totalwork = 0;
        }
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
        if (message.totalwork != null && message.hasOwnProperty("totalwork"))
            object.totalwork = options.json && !isFinite(message.totalwork) ? String(message.totalwork) : message.totalwork;
        return object;
    };

    /**
     * Converts this GetTipReturn to JSON.
     * @function toJSON
     * @memberof GetTipReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetTipReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetTipReturn;
})();

$root.PutHeaders = (function() {

    /**
     * Properties of a PutHeaders.
     * @exports IPutHeaders
     * @interface IPutHeaders
     * @property {Array.<IBlockHeader>|null} [headers] PutHeaders headers
     */

    /**
     * Constructs a new PutHeaders.
     * @exports PutHeaders
     * @classdesc Represents a PutHeaders.
     * @implements IPutHeaders
     * @constructor
     * @param {IPutHeaders=} [properties] Properties to set
     */
    function PutHeaders(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutHeaders headers.
     * @member {Array.<IBlockHeader>} headers
     * @memberof PutHeaders
     * @instance
     */
    PutHeaders.prototype.headers = $util.emptyArray;

    /**
     * Creates a new PutHeaders instance using the specified properties.
     * @function create
     * @memberof PutHeaders
     * @static
     * @param {IPutHeaders=} [properties] Properties to set
     * @returns {PutHeaders} PutHeaders instance
     */
    PutHeaders.create = function create(properties) {
        return new PutHeaders(properties);
    };

    /**
     * Encodes the specified PutHeaders message. Does not implicitly {@link PutHeaders.verify|verify} messages.
     * @function encode
     * @memberof PutHeaders
     * @static
     * @param {IPutHeaders} message PutHeaders message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutHeaders.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                $root.BlockHeader.encode(message.headers[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutHeaders message, length delimited. Does not implicitly {@link PutHeaders.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutHeaders
     * @static
     * @param {IPutHeaders} message PutHeaders message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutHeaders.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutHeaders message from the specified reader or buffer.
     * @function decode
     * @memberof PutHeaders
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutHeaders} PutHeaders
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutHeaders.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutHeaders();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push($root.BlockHeader.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutHeaders message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutHeaders
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutHeaders} PutHeaders
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutHeaders.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutHeaders message.
     * @function verify
     * @memberof PutHeaders
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutHeaders.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i) {
                var error = $root.BlockHeader.verify(message.headers[i]);
                if (error)
                    return "headers." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutHeaders message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutHeaders
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutHeaders} PutHeaders
     */
    PutHeaders.fromObject = function fromObject(object) {
        if (object instanceof $root.PutHeaders)
            return object;
        var message = new $root.PutHeaders();
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".PutHeaders.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i) {
                if (typeof object.headers[i] !== "object")
                    throw TypeError(".PutHeaders.headers: object expected");
                message.headers[i] = $root.BlockHeader.fromObject(object.headers[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutHeaders message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutHeaders
     * @static
     * @param {PutHeaders} message PutHeaders
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutHeaders.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = $root.BlockHeader.toObject(message.headers[j], options);
        }
        return object;
    };

    /**
     * Converts this PutHeaders to JSON.
     * @function toJSON
     * @memberof PutHeaders
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutHeaders.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutHeaders;
})();

$root.PutHeadersReturn = (function() {

    /**
     * Properties of a PutHeadersReturn.
     * @exports IPutHeadersReturn
     * @interface IPutHeadersReturn
     * @property {Array.<IStatusChange>|null} [statusChanges] PutHeadersReturn statusChanges
     */

    /**
     * Constructs a new PutHeadersReturn.
     * @exports PutHeadersReturn
     * @classdesc Represents a PutHeadersReturn.
     * @implements IPutHeadersReturn
     * @constructor
     * @param {IPutHeadersReturn=} [properties] Properties to set
     */
    function PutHeadersReturn(properties) {
        this.statusChanges = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PutHeadersReturn statusChanges.
     * @member {Array.<IStatusChange>} statusChanges
     * @memberof PutHeadersReturn
     * @instance
     */
    PutHeadersReturn.prototype.statusChanges = $util.emptyArray;

    /**
     * Creates a new PutHeadersReturn instance using the specified properties.
     * @function create
     * @memberof PutHeadersReturn
     * @static
     * @param {IPutHeadersReturn=} [properties] Properties to set
     * @returns {PutHeadersReturn} PutHeadersReturn instance
     */
    PutHeadersReturn.create = function create(properties) {
        return new PutHeadersReturn(properties);
    };

    /**
     * Encodes the specified PutHeadersReturn message. Does not implicitly {@link PutHeadersReturn.verify|verify} messages.
     * @function encode
     * @memberof PutHeadersReturn
     * @static
     * @param {IPutHeadersReturn} message PutHeadersReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutHeadersReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.statusChanges != null && message.statusChanges.length)
            for (var i = 0; i < message.statusChanges.length; ++i)
                $root.StatusChange.encode(message.statusChanges[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PutHeadersReturn message, length delimited. Does not implicitly {@link PutHeadersReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PutHeadersReturn
     * @static
     * @param {IPutHeadersReturn} message PutHeadersReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PutHeadersReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PutHeadersReturn message from the specified reader or buffer.
     * @function decode
     * @memberof PutHeadersReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PutHeadersReturn} PutHeadersReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutHeadersReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PutHeadersReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.statusChanges && message.statusChanges.length))
                    message.statusChanges = [];
                message.statusChanges.push($root.StatusChange.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PutHeadersReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PutHeadersReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PutHeadersReturn} PutHeadersReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PutHeadersReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PutHeadersReturn message.
     * @function verify
     * @memberof PutHeadersReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PutHeadersReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.statusChanges != null && message.hasOwnProperty("statusChanges")) {
            if (!Array.isArray(message.statusChanges))
                return "statusChanges: array expected";
            for (var i = 0; i < message.statusChanges.length; ++i) {
                var error = $root.StatusChange.verify(message.statusChanges[i]);
                if (error)
                    return "statusChanges." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PutHeadersReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PutHeadersReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PutHeadersReturn} PutHeadersReturn
     */
    PutHeadersReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.PutHeadersReturn)
            return object;
        var message = new $root.PutHeadersReturn();
        if (object.statusChanges) {
            if (!Array.isArray(object.statusChanges))
                throw TypeError(".PutHeadersReturn.statusChanges: array expected");
            message.statusChanges = [];
            for (var i = 0; i < object.statusChanges.length; ++i) {
                if (typeof object.statusChanges[i] !== "object")
                    throw TypeError(".PutHeadersReturn.statusChanges: object expected");
                message.statusChanges[i] = $root.StatusChange.fromObject(object.statusChanges[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PutHeadersReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PutHeadersReturn
     * @static
     * @param {PutHeadersReturn} message PutHeadersReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PutHeadersReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.statusChanges = [];
        if (message.statusChanges && message.statusChanges.length) {
            object.statusChanges = [];
            for (var j = 0; j < message.statusChanges.length; ++j)
                object.statusChanges[j] = $root.StatusChange.toObject(message.statusChanges[j], options);
        }
        return object;
    };

    /**
     * Converts this PutHeadersReturn to JSON.
     * @function toJSON
     * @memberof PutHeadersReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PutHeadersReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PutHeadersReturn;
})();

$root.GetHash = (function() {

    /**
     * Properties of a GetHash.
     * @exports IGetHash
     * @interface IGetHash
     * @property {number|Long|null} [height] GetHash height
     */

    /**
     * Constructs a new GetHash.
     * @exports GetHash
     * @classdesc Represents a GetHash.
     * @implements IGetHash
     * @constructor
     * @param {IGetHash=} [properties] Properties to set
     */
    function GetHash(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHash height.
     * @member {number|Long} height
     * @memberof GetHash
     * @instance
     */
    GetHash.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new GetHash instance using the specified properties.
     * @function create
     * @memberof GetHash
     * @static
     * @param {IGetHash=} [properties] Properties to set
     * @returns {GetHash} GetHash instance
     */
    GetHash.create = function create(properties) {
        return new GetHash(properties);
    };

    /**
     * Encodes the specified GetHash message. Does not implicitly {@link GetHash.verify|verify} messages.
     * @function encode
     * @memberof GetHash
     * @static
     * @param {IGetHash} message GetHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHash.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.height);
        return writer;
    };

    /**
     * Encodes the specified GetHash message, length delimited. Does not implicitly {@link GetHash.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHash
     * @static
     * @param {IGetHash} message GetHash message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHash.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHash message from the specified reader or buffer.
     * @function decode
     * @memberof GetHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHash} GetHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHash.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHash();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHash message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHash
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHash} GetHash
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHash.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHash message.
     * @function verify
     * @memberof GetHash
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHash.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        return null;
    };

    /**
     * Creates a GetHash message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHash
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHash} GetHash
     */
    GetHash.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHash)
            return object;
        var message = new $root.GetHash();
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = true;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a GetHash message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHash
     * @static
     * @param {GetHash} message GetHash
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHash.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
        return object;
    };

    /**
     * Converts this GetHash to JSON.
     * @function toJSON
     * @memberof GetHash
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHash.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHash;
})();

$root.GetHashReturn = (function() {

    /**
     * Properties of a GetHashReturn.
     * @exports IGetHashReturn
     * @interface IGetHashReturn
     * @property {boolean|null} [success] GetHashReturn success
     * @property {Uint8Array|null} [hash] GetHashReturn hash
     */

    /**
     * Constructs a new GetHashReturn.
     * @exports GetHashReturn
     * @classdesc Represents a GetHashReturn.
     * @implements IGetHashReturn
     * @constructor
     * @param {IGetHashReturn=} [properties] Properties to set
     */
    function GetHashReturn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetHashReturn success.
     * @member {boolean} success
     * @memberof GetHashReturn
     * @instance
     */
    GetHashReturn.prototype.success = false;

    /**
     * GetHashReturn hash.
     * @member {Uint8Array} hash
     * @memberof GetHashReturn
     * @instance
     */
    GetHashReturn.prototype.hash = $util.newBuffer([]);

    /**
     * Creates a new GetHashReturn instance using the specified properties.
     * @function create
     * @memberof GetHashReturn
     * @static
     * @param {IGetHashReturn=} [properties] Properties to set
     * @returns {GetHashReturn} GetHashReturn instance
     */
    GetHashReturn.create = function create(properties) {
        return new GetHashReturn(properties);
    };

    /**
     * Encodes the specified GetHashReturn message. Does not implicitly {@link GetHashReturn.verify|verify} messages.
     * @function encode
     * @memberof GetHashReturn
     * @static
     * @param {IGetHashReturn} message GetHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHashReturn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.hash);
        return writer;
    };

    /**
     * Encodes the specified GetHashReturn message, length delimited. Does not implicitly {@link GetHashReturn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetHashReturn
     * @static
     * @param {IGetHashReturn} message GetHashReturn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetHashReturn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetHashReturn message from the specified reader or buffer.
     * @function decode
     * @memberof GetHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetHashReturn} GetHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHashReturn.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHashReturn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                message.hash = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetHashReturn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetHashReturn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetHashReturn} GetHashReturn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetHashReturn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetHashReturn message.
     * @function verify
     * @memberof GetHashReturn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetHashReturn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        return null;
    };

    /**
     * Creates a GetHashReturn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetHashReturn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetHashReturn} GetHashReturn
     */
    GetHashReturn.fromObject = function fromObject(object) {
        if (object instanceof $root.GetHashReturn)
            return object;
        var message = new $root.GetHashReturn();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        return message;
    };

    /**
     * Creates a plain object from a GetHashReturn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetHashReturn
     * @static
     * @param {GetHashReturn} message GetHashReturn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetHashReturn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.success = false;
            object.hash = options.bytes === String ? "" : [];
        }
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        return object;
    };

    /**
     * Converts this GetHashReturn to JSON.
     * @function toJSON
     * @memberof GetHashReturn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetHashReturn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetHashReturn;
})();

$root.StatusChange = (function() {

    /**
     * Properties of a StatusChange.
     * @exports IStatusChange
     * @interface IStatusChange
     * @property {number|null} [status] StatusChange status
     * @property {number|null} [oldStatus] StatusChange oldStatus
     */

    /**
     * Constructs a new StatusChange.
     * @exports StatusChange
     * @classdesc Represents a StatusChange.
     * @implements IStatusChange
     * @constructor
     * @param {IStatusChange=} [properties] Properties to set
     */
    function StatusChange(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StatusChange status.
     * @member {number} status
     * @memberof StatusChange
     * @instance
     */
    StatusChange.prototype.status = 0;

    /**
     * StatusChange oldStatus.
     * @member {number} oldStatus
     * @memberof StatusChange
     * @instance
     */
    StatusChange.prototype.oldStatus = 0;

    /**
     * Creates a new StatusChange instance using the specified properties.
     * @function create
     * @memberof StatusChange
     * @static
     * @param {IStatusChange=} [properties] Properties to set
     * @returns {StatusChange} StatusChange instance
     */
    StatusChange.create = function create(properties) {
        return new StatusChange(properties);
    };

    /**
     * Encodes the specified StatusChange message. Does not implicitly {@link StatusChange.verify|verify} messages.
     * @function encode
     * @memberof StatusChange
     * @static
     * @param {IStatusChange} message StatusChange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StatusChange.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.status != null && message.hasOwnProperty("status"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
        if (message.oldStatus != null && message.hasOwnProperty("oldStatus"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.oldStatus);
        return writer;
    };

    /**
     * Encodes the specified StatusChange message, length delimited. Does not implicitly {@link StatusChange.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StatusChange
     * @static
     * @param {IStatusChange} message StatusChange message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StatusChange.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StatusChange message from the specified reader or buffer.
     * @function decode
     * @memberof StatusChange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StatusChange} StatusChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StatusChange.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StatusChange();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.status = reader.int32();
                break;
            case 2:
                message.oldStatus = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StatusChange message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StatusChange
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StatusChange} StatusChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StatusChange.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StatusChange message.
     * @function verify
     * @memberof StatusChange
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StatusChange.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.status != null && message.hasOwnProperty("status"))
            if (!$util.isInteger(message.status))
                return "status: integer expected";
        if (message.oldStatus != null && message.hasOwnProperty("oldStatus"))
            if (!$util.isInteger(message.oldStatus))
                return "oldStatus: integer expected";
        return null;
    };

    /**
     * Creates a StatusChange message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StatusChange
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StatusChange} StatusChange
     */
    StatusChange.fromObject = function fromObject(object) {
        if (object instanceof $root.StatusChange)
            return object;
        var message = new $root.StatusChange();
        if (object.status != null)
            message.status = object.status | 0;
        if (object.oldStatus != null)
            message.oldStatus = object.oldStatus | 0;
        return message;
    };

    /**
     * Creates a plain object from a StatusChange message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StatusChange
     * @static
     * @param {StatusChange} message StatusChange
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StatusChange.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.status = 0;
            object.oldStatus = 0;
        }
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = message.status;
        if (message.oldStatus != null && message.hasOwnProperty("oldStatus"))
            object.oldStatus = message.oldStatus;
        return object;
    };

    /**
     * Converts this StatusChange to JSON.
     * @function toJSON
     * @memberof StatusChange
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StatusChange.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StatusChange;
})();

$root.Block = (function() {

    /**
     * Properties of a Block.
     * @exports IBlock
     * @interface IBlock
     * @property {IBlockHeader|null} [header] Block header
     * @property {Array.<ITx>|null} [txs] Block txs
     */

    /**
     * Constructs a new Block.
     * @exports Block
     * @classdesc Represents a Block.
     * @implements IBlock
     * @constructor
     * @param {IBlock=} [properties] Properties to set
     */
    function Block(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Block header.
     * @member {IBlockHeader|null|undefined} header
     * @memberof Block
     * @instance
     */
    Block.prototype.header = null;

    /**
     * Block txs.
     * @member {Array.<ITx>} txs
     * @memberof Block
     * @instance
     */
    Block.prototype.txs = $util.emptyArray;

    /**
     * Creates a new Block instance using the specified properties.
     * @function create
     * @memberof Block
     * @static
     * @param {IBlock=} [properties] Properties to set
     * @returns {Block} Block instance
     */
    Block.create = function create(properties) {
        return new Block(properties);
    };

    /**
     * Encodes the specified Block message. Does not implicitly {@link Block.verify|verify} messages.
     * @function encode
     * @memberof Block
     * @static
     * @param {IBlock} message Block message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Block.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.header != null && message.hasOwnProperty("header"))
            $root.BlockHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Block message, length delimited. Does not implicitly {@link Block.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Block
     * @static
     * @param {IBlock} message Block message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Block.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Block message from the specified reader or buffer.
     * @function decode
     * @memberof Block
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Block} Block
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Block.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Block();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.header = $root.BlockHeader.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Block message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Block
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Block} Block
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Block.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Block message.
     * @function verify
     * @memberof Block
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Block.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            var error = $root.BlockHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Block message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Block
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Block} Block
     */
    Block.fromObject = function fromObject(object) {
        if (object instanceof $root.Block)
            return object;
        var message = new $root.Block();
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".Block.header: object expected");
            message.header = $root.BlockHeader.fromObject(object.header);
        }
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".Block.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".Block.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Block message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Block
     * @static
     * @param {Block} message Block
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Block.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (options.defaults)
            object.header = null;
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.BlockHeader.toObject(message.header, options);
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this Block to JSON.
     * @function toJSON
     * @memberof Block
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Block.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Block;
})();

$root.GenesisBlock = (function() {

    /**
     * Properties of a GenesisBlock.
     * @exports IGenesisBlock
     * @interface IGenesisBlock
     * @property {IGenesisBlockHeader|null} [header] GenesisBlock header
     * @property {Array.<ITx>|null} [txs] GenesisBlock txs
     */

    /**
     * Constructs a new GenesisBlock.
     * @exports GenesisBlock
     * @classdesc Represents a GenesisBlock.
     * @implements IGenesisBlock
     * @constructor
     * @param {IGenesisBlock=} [properties] Properties to set
     */
    function GenesisBlock(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenesisBlock header.
     * @member {IGenesisBlockHeader|null|undefined} header
     * @memberof GenesisBlock
     * @instance
     */
    GenesisBlock.prototype.header = null;

    /**
     * GenesisBlock txs.
     * @member {Array.<ITx>} txs
     * @memberof GenesisBlock
     * @instance
     */
    GenesisBlock.prototype.txs = $util.emptyArray;

    /**
     * Creates a new GenesisBlock instance using the specified properties.
     * @function create
     * @memberof GenesisBlock
     * @static
     * @param {IGenesisBlock=} [properties] Properties to set
     * @returns {GenesisBlock} GenesisBlock instance
     */
    GenesisBlock.create = function create(properties) {
        return new GenesisBlock(properties);
    };

    /**
     * Encodes the specified GenesisBlock message. Does not implicitly {@link GenesisBlock.verify|verify} messages.
     * @function encode
     * @memberof GenesisBlock
     * @static
     * @param {IGenesisBlock} message GenesisBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisBlock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.header != null && message.hasOwnProperty("header"))
            $root.GenesisBlockHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GenesisBlock message, length delimited. Does not implicitly {@link GenesisBlock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenesisBlock
     * @static
     * @param {IGenesisBlock} message GenesisBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisBlock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenesisBlock message from the specified reader or buffer.
     * @function decode
     * @memberof GenesisBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenesisBlock} GenesisBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisBlock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenesisBlock();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.header = $root.GenesisBlockHeader.decode(reader, reader.uint32());
                break;
            case 3:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenesisBlock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenesisBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenesisBlock} GenesisBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisBlock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenesisBlock message.
     * @function verify
     * @memberof GenesisBlock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenesisBlock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            var error = $root.GenesisBlockHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GenesisBlock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenesisBlock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenesisBlock} GenesisBlock
     */
    GenesisBlock.fromObject = function fromObject(object) {
        if (object instanceof $root.GenesisBlock)
            return object;
        var message = new $root.GenesisBlock();
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".GenesisBlock.header: object expected");
            message.header = $root.GenesisBlockHeader.fromObject(object.header);
        }
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".GenesisBlock.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".GenesisBlock.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GenesisBlock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenesisBlock
     * @static
     * @param {GenesisBlock} message GenesisBlock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenesisBlock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (options.defaults)
            object.header = null;
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.GenesisBlockHeader.toObject(message.header, options);
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this GenesisBlock to JSON.
     * @function toJSON
     * @memberof GenesisBlock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenesisBlock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenesisBlock;
})();

$root.BlockDB = (function() {

    /**
     * Properties of a BlockDB.
     * @exports IBlockDB
     * @interface IBlockDB
     * @property {number|null} [height] BlockDB height
     * @property {IBlockHeader|null} [header] BlockDB header
     * @property {number|null} [fileNumber] BlockDB fileNumber
     * @property {number|null} [offset] BlockDB offset
     * @property {number|null} [length] BlockDB length
     * @property {number|null} [tEMA] BlockDB tEMA
     * @property {number|null} [pEMA] BlockDB pEMA
     * @property {number|null} [nextDifficulty] BlockDB nextDifficulty
     * @property {number|null} [totalWork] BlockDB totalWork
     */

    /**
     * Constructs a new BlockDB.
     * @exports BlockDB
     * @classdesc Represents a BlockDB.
     * @implements IBlockDB
     * @constructor
     * @param {IBlockDB=} [properties] Properties to set
     */
    function BlockDB(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockDB height.
     * @member {number} height
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.height = 0;

    /**
     * BlockDB header.
     * @member {IBlockHeader|null|undefined} header
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.header = null;

    /**
     * BlockDB fileNumber.
     * @member {number} fileNumber
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.fileNumber = 0;

    /**
     * BlockDB offset.
     * @member {number} offset
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.offset = 0;

    /**
     * BlockDB length.
     * @member {number} length
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.length = 0;

    /**
     * BlockDB tEMA.
     * @member {number} tEMA
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.tEMA = 0;

    /**
     * BlockDB pEMA.
     * @member {number} pEMA
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.pEMA = 0;

    /**
     * BlockDB nextDifficulty.
     * @member {number} nextDifficulty
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.nextDifficulty = 0;

    /**
     * BlockDB totalWork.
     * @member {number} totalWork
     * @memberof BlockDB
     * @instance
     */
    BlockDB.prototype.totalWork = 0;

    /**
     * Creates a new BlockDB instance using the specified properties.
     * @function create
     * @memberof BlockDB
     * @static
     * @param {IBlockDB=} [properties] Properties to set
     * @returns {BlockDB} BlockDB instance
     */
    BlockDB.create = function create(properties) {
        return new BlockDB(properties);
    };

    /**
     * Encodes the specified BlockDB message. Does not implicitly {@link BlockDB.verify|verify} messages.
     * @function encode
     * @memberof BlockDB
     * @static
     * @param {IBlockDB} message BlockDB message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockDB.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.height);
        if (message.header != null && message.hasOwnProperty("header"))
            $root.BlockHeader.encode(message.header, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.fileNumber != null && message.hasOwnProperty("fileNumber"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.fileNumber);
        if (message.offset != null && message.hasOwnProperty("offset"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.offset);
        if (message.length != null && message.hasOwnProperty("length"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.length);
        if (message.tEMA != null && message.hasOwnProperty("tEMA"))
            writer.uint32(/* id 6, wireType 1 =*/49).double(message.tEMA);
        if (message.pEMA != null && message.hasOwnProperty("pEMA"))
            writer.uint32(/* id 7, wireType 1 =*/57).double(message.pEMA);
        if (message.nextDifficulty != null && message.hasOwnProperty("nextDifficulty"))
            writer.uint32(/* id 8, wireType 1 =*/65).double(message.nextDifficulty);
        if (message.totalWork != null && message.hasOwnProperty("totalWork"))
            writer.uint32(/* id 9, wireType 1 =*/73).double(message.totalWork);
        return writer;
    };

    /**
     * Encodes the specified BlockDB message, length delimited. Does not implicitly {@link BlockDB.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockDB
     * @static
     * @param {IBlockDB} message BlockDB message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockDB.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockDB message from the specified reader or buffer.
     * @function decode
     * @memberof BlockDB
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockDB} BlockDB
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockDB.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockDB();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.uint32();
                break;
            case 2:
                message.header = $root.BlockHeader.decode(reader, reader.uint32());
                break;
            case 3:
                message.fileNumber = reader.uint32();
                break;
            case 4:
                message.offset = reader.uint32();
                break;
            case 5:
                message.length = reader.uint32();
                break;
            case 6:
                message.tEMA = reader.double();
                break;
            case 7:
                message.pEMA = reader.double();
                break;
            case 8:
                message.nextDifficulty = reader.double();
                break;
            case 9:
                message.totalWork = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BlockDB message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockDB
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockDB} BlockDB
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockDB.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockDB message.
     * @function verify
     * @memberof BlockDB
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockDB.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height))
                return "height: integer expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            var error = $root.BlockHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.fileNumber != null && message.hasOwnProperty("fileNumber"))
            if (!$util.isInteger(message.fileNumber))
                return "fileNumber: integer expected";
        if (message.offset != null && message.hasOwnProperty("offset"))
            if (!$util.isInteger(message.offset))
                return "offset: integer expected";
        if (message.length != null && message.hasOwnProperty("length"))
            if (!$util.isInteger(message.length))
                return "length: integer expected";
        if (message.tEMA != null && message.hasOwnProperty("tEMA"))
            if (typeof message.tEMA !== "number")
                return "tEMA: number expected";
        if (message.pEMA != null && message.hasOwnProperty("pEMA"))
            if (typeof message.pEMA !== "number")
                return "pEMA: number expected";
        if (message.nextDifficulty != null && message.hasOwnProperty("nextDifficulty"))
            if (typeof message.nextDifficulty !== "number")
                return "nextDifficulty: number expected";
        if (message.totalWork != null && message.hasOwnProperty("totalWork"))
            if (typeof message.totalWork !== "number")
                return "totalWork: number expected";
        return null;
    };

    /**
     * Creates a BlockDB message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockDB
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockDB} BlockDB
     */
    BlockDB.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockDB)
            return object;
        var message = new $root.BlockDB();
        if (object.height != null)
            message.height = object.height >>> 0;
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".BlockDB.header: object expected");
            message.header = $root.BlockHeader.fromObject(object.header);
        }
        if (object.fileNumber != null)
            message.fileNumber = object.fileNumber >>> 0;
        if (object.offset != null)
            message.offset = object.offset >>> 0;
        if (object.length != null)
            message.length = object.length >>> 0;
        if (object.tEMA != null)
            message.tEMA = Number(object.tEMA);
        if (object.pEMA != null)
            message.pEMA = Number(object.pEMA);
        if (object.nextDifficulty != null)
            message.nextDifficulty = Number(object.nextDifficulty);
        if (object.totalWork != null)
            message.totalWork = Number(object.totalWork);
        return message;
    };

    /**
     * Creates a plain object from a BlockDB message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockDB
     * @static
     * @param {BlockDB} message BlockDB
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockDB.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.height = 0;
            object.header = null;
            object.fileNumber = 0;
            object.offset = 0;
            object.length = 0;
            object.tEMA = 0;
            object.pEMA = 0;
            object.nextDifficulty = 0;
            object.totalWork = 0;
        }
        if (message.height != null && message.hasOwnProperty("height"))
            object.height = message.height;
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.BlockHeader.toObject(message.header, options);
        if (message.fileNumber != null && message.hasOwnProperty("fileNumber"))
            object.fileNumber = message.fileNumber;
        if (message.offset != null && message.hasOwnProperty("offset"))
            object.offset = message.offset;
        if (message.length != null && message.hasOwnProperty("length"))
            object.length = message.length;
        if (message.tEMA != null && message.hasOwnProperty("tEMA"))
            object.tEMA = options.json && !isFinite(message.tEMA) ? String(message.tEMA) : message.tEMA;
        if (message.pEMA != null && message.hasOwnProperty("pEMA"))
            object.pEMA = options.json && !isFinite(message.pEMA) ? String(message.pEMA) : message.pEMA;
        if (message.nextDifficulty != null && message.hasOwnProperty("nextDifficulty"))
            object.nextDifficulty = options.json && !isFinite(message.nextDifficulty) ? String(message.nextDifficulty) : message.nextDifficulty;
        if (message.totalWork != null && message.hasOwnProperty("totalWork"))
            object.totalWork = options.json && !isFinite(message.totalWork) ? String(message.totalWork) : message.totalWork;
        return object;
    };

    /**
     * Converts this BlockDB to JSON.
     * @function toJSON
     * @memberof BlockDB
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockDB.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockDB;
})();

$root.Txs = (function() {

    /**
     * Properties of a Txs.
     * @exports ITxs
     * @interface ITxs
     * @property {Array.<ITx>|null} [txs] Txs txs
     */

    /**
     * Constructs a new Txs.
     * @exports Txs
     * @classdesc Represents a Txs.
     * @implements ITxs
     * @constructor
     * @param {ITxs=} [properties] Properties to set
     */
    function Txs(properties) {
        this.txs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Txs txs.
     * @member {Array.<ITx>} txs
     * @memberof Txs
     * @instance
     */
    Txs.prototype.txs = $util.emptyArray;

    /**
     * Creates a new Txs instance using the specified properties.
     * @function create
     * @memberof Txs
     * @static
     * @param {ITxs=} [properties] Properties to set
     * @returns {Txs} Txs instance
     */
    Txs.create = function create(properties) {
        return new Txs(properties);
    };

    /**
     * Encodes the specified Txs message. Does not implicitly {@link Txs.verify|verify} messages.
     * @function encode
     * @memberof Txs
     * @static
     * @param {ITxs} message Txs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Txs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.txs != null && message.txs.length)
            for (var i = 0; i < message.txs.length; ++i)
                $root.Tx.encode(message.txs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Txs message, length delimited. Does not implicitly {@link Txs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Txs
     * @static
     * @param {ITxs} message Txs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Txs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Txs message from the specified reader or buffer.
     * @function decode
     * @memberof Txs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Txs} Txs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Txs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Txs();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.txs && message.txs.length))
                    message.txs = [];
                message.txs.push($root.Tx.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Txs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Txs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Txs} Txs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Txs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Txs message.
     * @function verify
     * @memberof Txs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Txs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.txs != null && message.hasOwnProperty("txs")) {
            if (!Array.isArray(message.txs))
                return "txs: array expected";
            for (var i = 0; i < message.txs.length; ++i) {
                var error = $root.Tx.verify(message.txs[i]);
                if (error)
                    return "txs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Txs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Txs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Txs} Txs
     */
    Txs.fromObject = function fromObject(object) {
        if (object instanceof $root.Txs)
            return object;
        var message = new $root.Txs();
        if (object.txs) {
            if (!Array.isArray(object.txs))
                throw TypeError(".Txs.txs: array expected");
            message.txs = [];
            for (var i = 0; i < object.txs.length; ++i) {
                if (typeof object.txs[i] !== "object")
                    throw TypeError(".Txs.txs: object expected");
                message.txs[i] = $root.Tx.fromObject(object.txs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Txs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Txs
     * @static
     * @param {Txs} message Txs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Txs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.txs = [];
        if (message.txs && message.txs.length) {
            object.txs = [];
            for (var j = 0; j < message.txs.length; ++j)
                object.txs[j] = $root.Tx.toObject(message.txs[j], options);
        }
        return object;
    };

    /**
     * Converts this Txs to JSON.
     * @function toJSON
     * @memberof Txs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Txs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Txs;
})();

$root.Tx = (function() {

    /**
     * Properties of a Tx.
     * @exports ITx
     * @interface ITx
     * @property {Uint8Array|null} [from] Tx from
     * @property {Uint8Array|null} [to] Tx to
     * @property {number|Long|null} [amount] Tx amount
     * @property {number|Long|null} [fee] Tx fee
     * @property {number|null} [nonce] Tx nonce
     * @property {Uint8Array|null} [signature] Tx signature
     * @property {number|null} [recovery] Tx recovery
     */

    /**
     * Constructs a new Tx.
     * @exports Tx
     * @classdesc Represents a Tx.
     * @implements ITx
     * @constructor
     * @param {ITx=} [properties] Properties to set
     */
    function Tx(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Tx from.
     * @member {Uint8Array} from
     * @memberof Tx
     * @instance
     */
    Tx.prototype.from = $util.newBuffer([]);

    /**
     * Tx to.
     * @member {Uint8Array} to
     * @memberof Tx
     * @instance
     */
    Tx.prototype.to = $util.newBuffer([]);

    /**
     * Tx amount.
     * @member {number|Long} amount
     * @memberof Tx
     * @instance
     */
    Tx.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Tx fee.
     * @member {number|Long} fee
     * @memberof Tx
     * @instance
     */
    Tx.prototype.fee = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Tx nonce.
     * @member {number} nonce
     * @memberof Tx
     * @instance
     */
    Tx.prototype.nonce = 0;

    /**
     * Tx signature.
     * @member {Uint8Array} signature
     * @memberof Tx
     * @instance
     */
    Tx.prototype.signature = $util.newBuffer([]);

    /**
     * Tx recovery.
     * @member {number} recovery
     * @memberof Tx
     * @instance
     */
    Tx.prototype.recovery = 0;

    /**
     * Creates a new Tx instance using the specified properties.
     * @function create
     * @memberof Tx
     * @static
     * @param {ITx=} [properties] Properties to set
     * @returns {Tx} Tx instance
     */
    Tx.create = function create(properties) {
        return new Tx(properties);
    };

    /**
     * Encodes the specified Tx message. Does not implicitly {@link Tx.verify|verify} messages.
     * @function encode
     * @memberof Tx
     * @static
     * @param {ITx} message Tx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Tx.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.from != null && message.hasOwnProperty("from"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.from);
        if (message.to != null && message.hasOwnProperty("to"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.to);
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.amount);
        if (message.fee != null && message.hasOwnProperty("fee"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.fee);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.nonce);
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.signature);
        if (message.recovery != null && message.hasOwnProperty("recovery"))
            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.recovery);
        return writer;
    };

    /**
     * Encodes the specified Tx message, length delimited. Does not implicitly {@link Tx.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Tx
     * @static
     * @param {ITx} message Tx message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Tx.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Tx message from the specified reader or buffer.
     * @function decode
     * @memberof Tx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Tx} Tx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Tx.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Tx();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.from = reader.bytes();
                break;
            case 2:
                message.to = reader.bytes();
                break;
            case 3:
                message.amount = reader.uint64();
                break;
            case 4:
                message.fee = reader.uint64();
                break;
            case 5:
                message.nonce = reader.uint32();
                break;
            case 6:
                message.signature = reader.bytes();
                break;
            case 7:
                message.recovery = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Tx message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Tx
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Tx} Tx
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Tx.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Tx message.
     * @function verify
     * @memberof Tx
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Tx.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.from != null && message.hasOwnProperty("from"))
            if (!(message.from && typeof message.from.length === "number" || $util.isString(message.from)))
                return "from: buffer expected";
        if (message.to != null && message.hasOwnProperty("to"))
            if (!(message.to && typeof message.to.length === "number" || $util.isString(message.to)))
                return "to: buffer expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        if (message.fee != null && message.hasOwnProperty("fee"))
            if (!$util.isInteger(message.fee) && !(message.fee && $util.isInteger(message.fee.low) && $util.isInteger(message.fee.high)))
                return "fee: integer|Long expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce))
                return "nonce: integer expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                return "signature: buffer expected";
        if (message.recovery != null && message.hasOwnProperty("recovery"))
            if (!$util.isInteger(message.recovery))
                return "recovery: integer expected";
        return null;
    };

    /**
     * Creates a Tx message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Tx
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Tx} Tx
     */
    Tx.fromObject = function fromObject(object) {
        if (object instanceof $root.Tx)
            return object;
        var message = new $root.Tx();
        if (object.from != null)
            if (typeof object.from === "string")
                $util.base64.decode(object.from, message.from = $util.newBuffer($util.base64.length(object.from)), 0);
            else if (object.from.length)
                message.from = object.from;
        if (object.to != null)
            if (typeof object.to === "string")
                $util.base64.decode(object.to, message.to = $util.newBuffer($util.base64.length(object.to)), 0);
            else if (object.to.length)
                message.to = object.to;
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = true;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber(true);
        if (object.fee != null)
            if ($util.Long)
                (message.fee = $util.Long.fromValue(object.fee)).unsigned = true;
            else if (typeof object.fee === "string")
                message.fee = parseInt(object.fee, 10);
            else if (typeof object.fee === "number")
                message.fee = object.fee;
            else if (typeof object.fee === "object")
                message.fee = new $util.LongBits(object.fee.low >>> 0, object.fee.high >>> 0).toNumber(true);
        if (object.nonce != null)
            message.nonce = object.nonce >>> 0;
        if (object.signature != null)
            if (typeof object.signature === "string")
                $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
            else if (object.signature.length)
                message.signature = object.signature;
        if (object.recovery != null)
            message.recovery = object.recovery >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a Tx message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Tx
     * @static
     * @param {Tx} message Tx
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Tx.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.from = options.bytes === String ? "" : [];
            object.to = options.bytes === String ? "" : [];
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.fee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.fee = options.longs === String ? "0" : 0;
            object.nonce = 0;
            object.signature = options.bytes === String ? "" : [];
            object.recovery = 0;
        }
        if (message.from != null && message.hasOwnProperty("from"))
            object.from = options.bytes === String ? $util.base64.encode(message.from, 0, message.from.length) : options.bytes === Array ? Array.prototype.slice.call(message.from) : message.from;
        if (message.to != null && message.hasOwnProperty("to"))
            object.to = options.bytes === String ? $util.base64.encode(message.to, 0, message.to.length) : options.bytes === Array ? Array.prototype.slice.call(message.to) : message.to;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber(true) : message.amount;
        if (message.fee != null && message.hasOwnProperty("fee"))
            if (typeof message.fee === "number")
                object.fee = options.longs === String ? String(message.fee) : message.fee;
            else
                object.fee = options.longs === String ? $util.Long.prototype.toString.call(message.fee) : options.longs === Number ? new $util.LongBits(message.fee.low >>> 0, message.fee.high >>> 0).toNumber(true) : message.fee;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
        if (message.recovery != null && message.hasOwnProperty("recovery"))
            object.recovery = message.recovery;
        return object;
    };

    /**
     * Converts this Tx to JSON.
     * @function toJSON
     * @memberof Tx
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Tx.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Tx;
})();

$root.TxDB = (function() {

    /**
     * Properties of a TxDB.
     * @exports ITxDB
     * @interface ITxDB
     * @property {Uint8Array|null} [hash] TxDB hash
     * @property {Uint8Array|null} [blockHash] TxDB blockHash
     * @property {number|null} [blockHeight] TxDB blockHeight
     * @property {number|null} [txNumber] TxDB txNumber
     */

    /**
     * Constructs a new TxDB.
     * @exports TxDB
     * @classdesc Represents a TxDB.
     * @implements ITxDB
     * @constructor
     * @param {ITxDB=} [properties] Properties to set
     */
    function TxDB(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TxDB hash.
     * @member {Uint8Array} hash
     * @memberof TxDB
     * @instance
     */
    TxDB.prototype.hash = $util.newBuffer([]);

    /**
     * TxDB blockHash.
     * @member {Uint8Array} blockHash
     * @memberof TxDB
     * @instance
     */
    TxDB.prototype.blockHash = $util.newBuffer([]);

    /**
     * TxDB blockHeight.
     * @member {number} blockHeight
     * @memberof TxDB
     * @instance
     */
    TxDB.prototype.blockHeight = 0;

    /**
     * TxDB txNumber.
     * @member {number} txNumber
     * @memberof TxDB
     * @instance
     */
    TxDB.prototype.txNumber = 0;

    /**
     * Creates a new TxDB instance using the specified properties.
     * @function create
     * @memberof TxDB
     * @static
     * @param {ITxDB=} [properties] Properties to set
     * @returns {TxDB} TxDB instance
     */
    TxDB.create = function create(properties) {
        return new TxDB(properties);
    };

    /**
     * Encodes the specified TxDB message. Does not implicitly {@link TxDB.verify|verify} messages.
     * @function encode
     * @memberof TxDB
     * @static
     * @param {ITxDB} message TxDB message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TxDB.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hash);
        if (message.blockHash != null && message.hasOwnProperty("blockHash"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.blockHash);
        if (message.blockHeight != null && message.hasOwnProperty("blockHeight"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.blockHeight);
        if (message.txNumber != null && message.hasOwnProperty("txNumber"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.txNumber);
        return writer;
    };

    /**
     * Encodes the specified TxDB message, length delimited. Does not implicitly {@link TxDB.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TxDB
     * @static
     * @param {ITxDB} message TxDB message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TxDB.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TxDB message from the specified reader or buffer.
     * @function decode
     * @memberof TxDB
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TxDB} TxDB
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TxDB.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TxDB();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.bytes();
                break;
            case 2:
                message.blockHash = reader.bytes();
                break;
            case 3:
                message.blockHeight = reader.uint32();
                break;
            case 4:
                message.txNumber = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TxDB message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TxDB
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TxDB} TxDB
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TxDB.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TxDB message.
     * @function verify
     * @memberof TxDB
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TxDB.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        if (message.blockHash != null && message.hasOwnProperty("blockHash"))
            if (!(message.blockHash && typeof message.blockHash.length === "number" || $util.isString(message.blockHash)))
                return "blockHash: buffer expected";
        if (message.blockHeight != null && message.hasOwnProperty("blockHeight"))
            if (!$util.isInteger(message.blockHeight))
                return "blockHeight: integer expected";
        if (message.txNumber != null && message.hasOwnProperty("txNumber"))
            if (!$util.isInteger(message.txNumber))
                return "txNumber: integer expected";
        return null;
    };

    /**
     * Creates a TxDB message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TxDB
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TxDB} TxDB
     */
    TxDB.fromObject = function fromObject(object) {
        if (object instanceof $root.TxDB)
            return object;
        var message = new $root.TxDB();
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        if (object.blockHash != null)
            if (typeof object.blockHash === "string")
                $util.base64.decode(object.blockHash, message.blockHash = $util.newBuffer($util.base64.length(object.blockHash)), 0);
            else if (object.blockHash.length)
                message.blockHash = object.blockHash;
        if (object.blockHeight != null)
            message.blockHeight = object.blockHeight >>> 0;
        if (object.txNumber != null)
            message.txNumber = object.txNumber >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a TxDB message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TxDB
     * @static
     * @param {TxDB} message TxDB
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TxDB.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.hash = options.bytes === String ? "" : [];
            object.blockHash = options.bytes === String ? "" : [];
            object.blockHeight = 0;
            object.txNumber = 0;
        }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        if (message.blockHash != null && message.hasOwnProperty("blockHash"))
            object.blockHash = options.bytes === String ? $util.base64.encode(message.blockHash, 0, message.blockHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.blockHash) : message.blockHash;
        if (message.blockHeight != null && message.hasOwnProperty("blockHeight"))
            object.blockHeight = message.blockHeight;
        if (message.txNumber != null && message.hasOwnProperty("txNumber"))
            object.txNumber = message.txNumber;
        return object;
    };

    /**
     * Converts this TxDB to JSON.
     * @function toJSON
     * @memberof TxDB
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TxDB.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TxDB;
})();

$root.GenesisBlockHeader = (function() {

    /**
     * Properties of a GenesisBlockHeader.
     * @exports IGenesisBlockHeader
     * @interface IGenesisBlockHeader
     * @property {Array.<Uint8Array>|null} [previousHash] GenesisBlockHeader previousHash
     * @property {Uint8Array|null} [merkleRoot] GenesisBlockHeader merkleRoot
     * @property {Uint8Array|null} [stateRoot] GenesisBlockHeader stateRoot
     * @property {number|null} [difficulty] GenesisBlockHeader difficulty
     * @property {number|Long|null} [timeStamp] GenesisBlockHeader timeStamp
     * @property {number|Long|null} [nonce] GenesisBlockHeader nonce
     * @property {Uint8Array|null} [miner] GenesisBlockHeader miner
     */

    /**
     * Constructs a new GenesisBlockHeader.
     * @exports GenesisBlockHeader
     * @classdesc Represents a GenesisBlockHeader.
     * @implements IGenesisBlockHeader
     * @constructor
     * @param {IGenesisBlockHeader=} [properties] Properties to set
     */
    function GenesisBlockHeader(properties) {
        this.previousHash = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenesisBlockHeader previousHash.
     * @member {Array.<Uint8Array>} previousHash
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.previousHash = $util.emptyArray;

    /**
     * GenesisBlockHeader merkleRoot.
     * @member {Uint8Array} merkleRoot
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.merkleRoot = $util.newBuffer([]);

    /**
     * GenesisBlockHeader stateRoot.
     * @member {Uint8Array} stateRoot
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.stateRoot = $util.newBuffer([]);

    /**
     * GenesisBlockHeader difficulty.
     * @member {number} difficulty
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.difficulty = 0;

    /**
     * GenesisBlockHeader timeStamp.
     * @member {number|Long} timeStamp
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.timeStamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GenesisBlockHeader nonce.
     * @member {number|Long} nonce
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * GenesisBlockHeader miner.
     * @member {Uint8Array} miner
     * @memberof GenesisBlockHeader
     * @instance
     */
    GenesisBlockHeader.prototype.miner = $util.newBuffer([]);

    /**
     * Creates a new GenesisBlockHeader instance using the specified properties.
     * @function create
     * @memberof GenesisBlockHeader
     * @static
     * @param {IGenesisBlockHeader=} [properties] Properties to set
     * @returns {GenesisBlockHeader} GenesisBlockHeader instance
     */
    GenesisBlockHeader.create = function create(properties) {
        return new GenesisBlockHeader(properties);
    };

    /**
     * Encodes the specified GenesisBlockHeader message. Does not implicitly {@link GenesisBlockHeader.verify|verify} messages.
     * @function encode
     * @memberof GenesisBlockHeader
     * @static
     * @param {IGenesisBlockHeader} message GenesisBlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisBlockHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.previousHash != null && message.previousHash.length)
            for (var i = 0; i < message.previousHash.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.previousHash[i]);
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.merkleRoot);
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.stateRoot);
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.difficulty);
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.timeStamp);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.nonce);
        if (message.miner != null && message.hasOwnProperty("miner"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.miner);
        return writer;
    };

    /**
     * Encodes the specified GenesisBlockHeader message, length delimited. Does not implicitly {@link GenesisBlockHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenesisBlockHeader
     * @static
     * @param {IGenesisBlockHeader} message GenesisBlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisBlockHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenesisBlockHeader message from the specified reader or buffer.
     * @function decode
     * @memberof GenesisBlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenesisBlockHeader} GenesisBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisBlockHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenesisBlockHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.previousHash && message.previousHash.length))
                    message.previousHash = [];
                message.previousHash.push(reader.bytes());
                break;
            case 2:
                message.merkleRoot = reader.bytes();
                break;
            case 3:
                message.stateRoot = reader.bytes();
                break;
            case 4:
                message.difficulty = reader.uint32();
                break;
            case 5:
                message.timeStamp = reader.uint64();
                break;
            case 6:
                message.nonce = reader.uint64();
                break;
            case 7:
                message.miner = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenesisBlockHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenesisBlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenesisBlockHeader} GenesisBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisBlockHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenesisBlockHeader message.
     * @function verify
     * @memberof GenesisBlockHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenesisBlockHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.previousHash != null && message.hasOwnProperty("previousHash")) {
            if (!Array.isArray(message.previousHash))
                return "previousHash: array expected";
            for (var i = 0; i < message.previousHash.length; ++i)
                if (!(message.previousHash[i] && typeof message.previousHash[i].length === "number" || $util.isString(message.previousHash[i])))
                    return "previousHash: buffer[] expected";
        }
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            if (!(message.merkleRoot && typeof message.merkleRoot.length === "number" || $util.isString(message.merkleRoot)))
                return "merkleRoot: buffer expected";
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            if (!(message.stateRoot && typeof message.stateRoot.length === "number" || $util.isString(message.stateRoot)))
                return "stateRoot: buffer expected";
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            if (!$util.isInteger(message.difficulty))
                return "difficulty: integer expected";
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            if (!$util.isInteger(message.timeStamp) && !(message.timeStamp && $util.isInteger(message.timeStamp.low) && $util.isInteger(message.timeStamp.high)))
                return "timeStamp: integer|Long expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                return "nonce: integer|Long expected";
        if (message.miner != null && message.hasOwnProperty("miner"))
            if (!(message.miner && typeof message.miner.length === "number" || $util.isString(message.miner)))
                return "miner: buffer expected";
        return null;
    };

    /**
     * Creates a GenesisBlockHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenesisBlockHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenesisBlockHeader} GenesisBlockHeader
     */
    GenesisBlockHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.GenesisBlockHeader)
            return object;
        var message = new $root.GenesisBlockHeader();
        if (object.previousHash) {
            if (!Array.isArray(object.previousHash))
                throw TypeError(".GenesisBlockHeader.previousHash: array expected");
            message.previousHash = [];
            for (var i = 0; i < object.previousHash.length; ++i)
                if (typeof object.previousHash[i] === "string")
                    $util.base64.decode(object.previousHash[i], message.previousHash[i] = $util.newBuffer($util.base64.length(object.previousHash[i])), 0);
                else if (object.previousHash[i].length)
                    message.previousHash[i] = object.previousHash[i];
        }
        if (object.merkleRoot != null)
            if (typeof object.merkleRoot === "string")
                $util.base64.decode(object.merkleRoot, message.merkleRoot = $util.newBuffer($util.base64.length(object.merkleRoot)), 0);
            else if (object.merkleRoot.length)
                message.merkleRoot = object.merkleRoot;
        if (object.stateRoot != null)
            if (typeof object.stateRoot === "string")
                $util.base64.decode(object.stateRoot, message.stateRoot = $util.newBuffer($util.base64.length(object.stateRoot)), 0);
            else if (object.stateRoot.length)
                message.stateRoot = object.stateRoot;
        if (object.difficulty != null)
            message.difficulty = object.difficulty >>> 0;
        if (object.timeStamp != null)
            if ($util.Long)
                (message.timeStamp = $util.Long.fromValue(object.timeStamp)).unsigned = true;
            else if (typeof object.timeStamp === "string")
                message.timeStamp = parseInt(object.timeStamp, 10);
            else if (typeof object.timeStamp === "number")
                message.timeStamp = object.timeStamp;
            else if (typeof object.timeStamp === "object")
                message.timeStamp = new $util.LongBits(object.timeStamp.low >>> 0, object.timeStamp.high >>> 0).toNumber(true);
        if (object.nonce != null)
            if ($util.Long)
                (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
            else if (typeof object.nonce === "string")
                message.nonce = parseInt(object.nonce, 10);
            else if (typeof object.nonce === "number")
                message.nonce = object.nonce;
            else if (typeof object.nonce === "object")
                message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
        if (object.miner != null)
            if (typeof object.miner === "string")
                $util.base64.decode(object.miner, message.miner = $util.newBuffer($util.base64.length(object.miner)), 0);
            else if (object.miner.length)
                message.miner = object.miner;
        return message;
    };

    /**
     * Creates a plain object from a GenesisBlockHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenesisBlockHeader
     * @static
     * @param {GenesisBlockHeader} message GenesisBlockHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenesisBlockHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.previousHash = [];
        if (options.defaults) {
            object.merkleRoot = options.bytes === String ? "" : [];
            object.stateRoot = options.bytes === String ? "" : [];
            object.difficulty = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timeStamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timeStamp = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nonce = options.longs === String ? "0" : 0;
            object.miner = options.bytes === String ? "" : [];
        }
        if (message.previousHash && message.previousHash.length) {
            object.previousHash = [];
            for (var j = 0; j < message.previousHash.length; ++j)
                object.previousHash[j] = options.bytes === String ? $util.base64.encode(message.previousHash[j], 0, message.previousHash[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.previousHash[j]) : message.previousHash[j];
        }
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            object.merkleRoot = options.bytes === String ? $util.base64.encode(message.merkleRoot, 0, message.merkleRoot.length) : options.bytes === Array ? Array.prototype.slice.call(message.merkleRoot) : message.merkleRoot;
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            object.stateRoot = options.bytes === String ? $util.base64.encode(message.stateRoot, 0, message.stateRoot.length) : options.bytes === Array ? Array.prototype.slice.call(message.stateRoot) : message.stateRoot;
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            object.difficulty = message.difficulty;
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            if (typeof message.timeStamp === "number")
                object.timeStamp = options.longs === String ? String(message.timeStamp) : message.timeStamp;
            else
                object.timeStamp = options.longs === String ? $util.Long.prototype.toString.call(message.timeStamp) : options.longs === Number ? new $util.LongBits(message.timeStamp.low >>> 0, message.timeStamp.high >>> 0).toNumber(true) : message.timeStamp;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (typeof message.nonce === "number")
                object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
            else
                object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
        if (message.miner != null && message.hasOwnProperty("miner"))
            object.miner = options.bytes === String ? $util.base64.encode(message.miner, 0, message.miner.length) : options.bytes === Array ? Array.prototype.slice.call(message.miner) : message.miner;
        return object;
    };

    /**
     * Converts this GenesisBlockHeader to JSON.
     * @function toJSON
     * @memberof GenesisBlockHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenesisBlockHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenesisBlockHeader;
})();

$root.BlockHeader = (function() {

    /**
     * Properties of a BlockHeader.
     * @exports IBlockHeader
     * @interface IBlockHeader
     * @property {Array.<Uint8Array>|null} [previousHash] BlockHeader previousHash
     * @property {Uint8Array|null} [merkleRoot] BlockHeader merkleRoot
     * @property {Uint8Array|null} [stateRoot] BlockHeader stateRoot
     * @property {number|null} [difficulty] BlockHeader difficulty
     * @property {number|Long|null} [timeStamp] BlockHeader timeStamp
     * @property {number|Long|null} [nonce] BlockHeader nonce
     * @property {Uint8Array|null} [miner] BlockHeader miner
     */

    /**
     * Constructs a new BlockHeader.
     * @exports BlockHeader
     * @classdesc Represents a BlockHeader.
     * @implements IBlockHeader
     * @constructor
     * @param {IBlockHeader=} [properties] Properties to set
     */
    function BlockHeader(properties) {
        this.previousHash = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockHeader previousHash.
     * @member {Array.<Uint8Array>} previousHash
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.previousHash = $util.emptyArray;

    /**
     * BlockHeader merkleRoot.
     * @member {Uint8Array} merkleRoot
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.merkleRoot = $util.newBuffer([]);

    /**
     * BlockHeader stateRoot.
     * @member {Uint8Array} stateRoot
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.stateRoot = $util.newBuffer([]);

    /**
     * BlockHeader difficulty.
     * @member {number} difficulty
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.difficulty = 0;

    /**
     * BlockHeader timeStamp.
     * @member {number|Long} timeStamp
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.timeStamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * BlockHeader nonce.
     * @member {number|Long} nonce
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * BlockHeader miner.
     * @member {Uint8Array} miner
     * @memberof BlockHeader
     * @instance
     */
    BlockHeader.prototype.miner = $util.newBuffer([]);

    /**
     * Creates a new BlockHeader instance using the specified properties.
     * @function create
     * @memberof BlockHeader
     * @static
     * @param {IBlockHeader=} [properties] Properties to set
     * @returns {BlockHeader} BlockHeader instance
     */
    BlockHeader.create = function create(properties) {
        return new BlockHeader(properties);
    };

    /**
     * Encodes the specified BlockHeader message. Does not implicitly {@link BlockHeader.verify|verify} messages.
     * @function encode
     * @memberof BlockHeader
     * @static
     * @param {IBlockHeader} message BlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.previousHash != null && message.previousHash.length)
            for (var i = 0; i < message.previousHash.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.previousHash[i]);
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.merkleRoot);
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.stateRoot);
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.difficulty);
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.timeStamp);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.nonce);
        if (message.miner != null && message.hasOwnProperty("miner"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.miner);
        return writer;
    };

    /**
     * Encodes the specified BlockHeader message, length delimited. Does not implicitly {@link BlockHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockHeader
     * @static
     * @param {IBlockHeader} message BlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockHeader message from the specified reader or buffer.
     * @function decode
     * @memberof BlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockHeader} BlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.previousHash && message.previousHash.length))
                    message.previousHash = [];
                message.previousHash.push(reader.bytes());
                break;
            case 2:
                message.merkleRoot = reader.bytes();
                break;
            case 3:
                message.stateRoot = reader.bytes();
                break;
            case 4:
                message.difficulty = reader.double();
                break;
            case 5:
                message.timeStamp = reader.uint64();
                break;
            case 6:
                message.nonce = reader.uint64();
                break;
            case 7:
                message.miner = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BlockHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockHeader} BlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockHeader message.
     * @function verify
     * @memberof BlockHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.previousHash != null && message.hasOwnProperty("previousHash")) {
            if (!Array.isArray(message.previousHash))
                return "previousHash: array expected";
            for (var i = 0; i < message.previousHash.length; ++i)
                if (!(message.previousHash[i] && typeof message.previousHash[i].length === "number" || $util.isString(message.previousHash[i])))
                    return "previousHash: buffer[] expected";
        }
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            if (!(message.merkleRoot && typeof message.merkleRoot.length === "number" || $util.isString(message.merkleRoot)))
                return "merkleRoot: buffer expected";
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            if (!(message.stateRoot && typeof message.stateRoot.length === "number" || $util.isString(message.stateRoot)))
                return "stateRoot: buffer expected";
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            if (typeof message.difficulty !== "number")
                return "difficulty: number expected";
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            if (!$util.isInteger(message.timeStamp) && !(message.timeStamp && $util.isInteger(message.timeStamp.low) && $util.isInteger(message.timeStamp.high)))
                return "timeStamp: integer|Long expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                return "nonce: integer|Long expected";
        if (message.miner != null && message.hasOwnProperty("miner"))
            if (!(message.miner && typeof message.miner.length === "number" || $util.isString(message.miner)))
                return "miner: buffer expected";
        return null;
    };

    /**
     * Creates a BlockHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockHeader} BlockHeader
     */
    BlockHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockHeader)
            return object;
        var message = new $root.BlockHeader();
        if (object.previousHash) {
            if (!Array.isArray(object.previousHash))
                throw TypeError(".BlockHeader.previousHash: array expected");
            message.previousHash = [];
            for (var i = 0; i < object.previousHash.length; ++i)
                if (typeof object.previousHash[i] === "string")
                    $util.base64.decode(object.previousHash[i], message.previousHash[i] = $util.newBuffer($util.base64.length(object.previousHash[i])), 0);
                else if (object.previousHash[i].length)
                    message.previousHash[i] = object.previousHash[i];
        }
        if (object.merkleRoot != null)
            if (typeof object.merkleRoot === "string")
                $util.base64.decode(object.merkleRoot, message.merkleRoot = $util.newBuffer($util.base64.length(object.merkleRoot)), 0);
            else if (object.merkleRoot.length)
                message.merkleRoot = object.merkleRoot;
        if (object.stateRoot != null)
            if (typeof object.stateRoot === "string")
                $util.base64.decode(object.stateRoot, message.stateRoot = $util.newBuffer($util.base64.length(object.stateRoot)), 0);
            else if (object.stateRoot.length)
                message.stateRoot = object.stateRoot;
        if (object.difficulty != null)
            message.difficulty = Number(object.difficulty);
        if (object.timeStamp != null)
            if ($util.Long)
                (message.timeStamp = $util.Long.fromValue(object.timeStamp)).unsigned = true;
            else if (typeof object.timeStamp === "string")
                message.timeStamp = parseInt(object.timeStamp, 10);
            else if (typeof object.timeStamp === "number")
                message.timeStamp = object.timeStamp;
            else if (typeof object.timeStamp === "object")
                message.timeStamp = new $util.LongBits(object.timeStamp.low >>> 0, object.timeStamp.high >>> 0).toNumber(true);
        if (object.nonce != null)
            if ($util.Long)
                (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
            else if (typeof object.nonce === "string")
                message.nonce = parseInt(object.nonce, 10);
            else if (typeof object.nonce === "number")
                message.nonce = object.nonce;
            else if (typeof object.nonce === "object")
                message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
        if (object.miner != null)
            if (typeof object.miner === "string")
                $util.base64.decode(object.miner, message.miner = $util.newBuffer($util.base64.length(object.miner)), 0);
            else if (object.miner.length)
                message.miner = object.miner;
        return message;
    };

    /**
     * Creates a plain object from a BlockHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockHeader
     * @static
     * @param {BlockHeader} message BlockHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.previousHash = [];
        if (options.defaults) {
            object.merkleRoot = options.bytes === String ? "" : [];
            object.stateRoot = options.bytes === String ? "" : [];
            object.difficulty = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timeStamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timeStamp = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nonce = options.longs === String ? "0" : 0;
            object.miner = options.bytes === String ? "" : [];
        }
        if (message.previousHash && message.previousHash.length) {
            object.previousHash = [];
            for (var j = 0; j < message.previousHash.length; ++j)
                object.previousHash[j] = options.bytes === String ? $util.base64.encode(message.previousHash[j], 0, message.previousHash[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.previousHash[j]) : message.previousHash[j];
        }
        if (message.merkleRoot != null && message.hasOwnProperty("merkleRoot"))
            object.merkleRoot = options.bytes === String ? $util.base64.encode(message.merkleRoot, 0, message.merkleRoot.length) : options.bytes === Array ? Array.prototype.slice.call(message.merkleRoot) : message.merkleRoot;
        if (message.stateRoot != null && message.hasOwnProperty("stateRoot"))
            object.stateRoot = options.bytes === String ? $util.base64.encode(message.stateRoot, 0, message.stateRoot.length) : options.bytes === Array ? Array.prototype.slice.call(message.stateRoot) : message.stateRoot;
        if (message.difficulty != null && message.hasOwnProperty("difficulty"))
            object.difficulty = options.json && !isFinite(message.difficulty) ? String(message.difficulty) : message.difficulty;
        if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
            if (typeof message.timeStamp === "number")
                object.timeStamp = options.longs === String ? String(message.timeStamp) : message.timeStamp;
            else
                object.timeStamp = options.longs === String ? $util.Long.prototype.toString.call(message.timeStamp) : options.longs === Number ? new $util.LongBits(message.timeStamp.low >>> 0, message.timeStamp.high >>> 0).toNumber(true) : message.timeStamp;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (typeof message.nonce === "number")
                object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
            else
                object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
        if (message.miner != null && message.hasOwnProperty("miner"))
            object.miner = options.bytes === String ? $util.base64.encode(message.miner, 0, message.miner.length) : options.bytes === Array ? Array.prototype.slice.call(message.miner) : message.miner;
        return object;
    };

    /**
     * Converts this BlockHeader to JSON.
     * @function toJSON
     * @memberof BlockHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockHeader;
})();

$root.Peer = (function() {

    /**
     * Properties of a Peer.
     * @exports IPeer
     * @interface IPeer
     * @property {string|null} [host] Peer host
     * @property {number|null} [port] Peer port
     * @property {number|Long|null} [lastSeen] Peer lastSeen
     * @property {number|null} [failCount] Peer failCount
     * @property {number|Long|null} [lastAttempt] Peer lastAttempt
     * @property {boolean|null} [active] Peer active
     * @property {number|null} [currentQueue] Peer currentQueue
     * @property {number|null} [successCount] Peer successCount
     */

    /**
     * Constructs a new Peer.
     * @exports Peer
     * @classdesc Represents a Peer.
     * @implements IPeer
     * @constructor
     * @param {IPeer=} [properties] Properties to set
     */
    function Peer(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Peer host.
     * @member {string} host
     * @memberof Peer
     * @instance
     */
    Peer.prototype.host = "";

    /**
     * Peer port.
     * @member {number} port
     * @memberof Peer
     * @instance
     */
    Peer.prototype.port = 0;

    /**
     * Peer lastSeen.
     * @member {number|Long} lastSeen
     * @memberof Peer
     * @instance
     */
    Peer.prototype.lastSeen = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Peer failCount.
     * @member {number} failCount
     * @memberof Peer
     * @instance
     */
    Peer.prototype.failCount = 0;

    /**
     * Peer lastAttempt.
     * @member {number|Long} lastAttempt
     * @memberof Peer
     * @instance
     */
    Peer.prototype.lastAttempt = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Peer active.
     * @member {boolean} active
     * @memberof Peer
     * @instance
     */
    Peer.prototype.active = false;

    /**
     * Peer currentQueue.
     * @member {number} currentQueue
     * @memberof Peer
     * @instance
     */
    Peer.prototype.currentQueue = 0;

    /**
     * Peer successCount.
     * @member {number} successCount
     * @memberof Peer
     * @instance
     */
    Peer.prototype.successCount = 0;

    /**
     * Creates a new Peer instance using the specified properties.
     * @function create
     * @memberof Peer
     * @static
     * @param {IPeer=} [properties] Properties to set
     * @returns {Peer} Peer instance
     */
    Peer.create = function create(properties) {
        return new Peer(properties);
    };

    /**
     * Encodes the specified Peer message. Does not implicitly {@link Peer.verify|verify} messages.
     * @function encode
     * @memberof Peer
     * @static
     * @param {IPeer} message Peer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Peer.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.host != null && message.hasOwnProperty("host"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.host);
        if (message.port != null && message.hasOwnProperty("port"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.port);
        if (message.lastSeen != null && message.hasOwnProperty("lastSeen"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.lastSeen);
        if (message.failCount != null && message.hasOwnProperty("failCount"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.failCount);
        if (message.lastAttempt != null && message.hasOwnProperty("lastAttempt"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.lastAttempt);
        if (message.active != null && message.hasOwnProperty("active"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.active);
        if (message.currentQueue != null && message.hasOwnProperty("currentQueue"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.currentQueue);
        if (message.successCount != null && message.hasOwnProperty("successCount"))
            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.successCount);
        return writer;
    };

    /**
     * Encodes the specified Peer message, length delimited. Does not implicitly {@link Peer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Peer
     * @static
     * @param {IPeer} message Peer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Peer.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Peer message from the specified reader or buffer.
     * @function decode
     * @memberof Peer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Peer} Peer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Peer.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Peer();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.host = reader.string();
                break;
            case 2:
                message.port = reader.uint32();
                break;
            case 3:
                message.lastSeen = reader.uint64();
                break;
            case 4:
                message.failCount = reader.uint32();
                break;
            case 5:
                message.lastAttempt = reader.uint64();
                break;
            case 6:
                message.active = reader.bool();
                break;
            case 7:
                message.currentQueue = reader.int32();
                break;
            case 8:
                message.successCount = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Peer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Peer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Peer} Peer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Peer.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Peer message.
     * @function verify
     * @memberof Peer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Peer.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.host != null && message.hasOwnProperty("host"))
            if (!$util.isString(message.host))
                return "host: string expected";
        if (message.port != null && message.hasOwnProperty("port"))
            if (!$util.isInteger(message.port))
                return "port: integer expected";
        if (message.lastSeen != null && message.hasOwnProperty("lastSeen"))
            if (!$util.isInteger(message.lastSeen) && !(message.lastSeen && $util.isInteger(message.lastSeen.low) && $util.isInteger(message.lastSeen.high)))
                return "lastSeen: integer|Long expected";
        if (message.failCount != null && message.hasOwnProperty("failCount"))
            if (!$util.isInteger(message.failCount))
                return "failCount: integer expected";
        if (message.lastAttempt != null && message.hasOwnProperty("lastAttempt"))
            if (!$util.isInteger(message.lastAttempt) && !(message.lastAttempt && $util.isInteger(message.lastAttempt.low) && $util.isInteger(message.lastAttempt.high)))
                return "lastAttempt: integer|Long expected";
        if (message.active != null && message.hasOwnProperty("active"))
            if (typeof message.active !== "boolean")
                return "active: boolean expected";
        if (message.currentQueue != null && message.hasOwnProperty("currentQueue"))
            if (!$util.isInteger(message.currentQueue))
                return "currentQueue: integer expected";
        if (message.successCount != null && message.hasOwnProperty("successCount"))
            if (!$util.isInteger(message.successCount))
                return "successCount: integer expected";
        return null;
    };

    /**
     * Creates a Peer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Peer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Peer} Peer
     */
    Peer.fromObject = function fromObject(object) {
        if (object instanceof $root.Peer)
            return object;
        var message = new $root.Peer();
        if (object.host != null)
            message.host = String(object.host);
        if (object.port != null)
            message.port = object.port >>> 0;
        if (object.lastSeen != null)
            if ($util.Long)
                (message.lastSeen = $util.Long.fromValue(object.lastSeen)).unsigned = true;
            else if (typeof object.lastSeen === "string")
                message.lastSeen = parseInt(object.lastSeen, 10);
            else if (typeof object.lastSeen === "number")
                message.lastSeen = object.lastSeen;
            else if (typeof object.lastSeen === "object")
                message.lastSeen = new $util.LongBits(object.lastSeen.low >>> 0, object.lastSeen.high >>> 0).toNumber(true);
        if (object.failCount != null)
            message.failCount = object.failCount >>> 0;
        if (object.lastAttempt != null)
            if ($util.Long)
                (message.lastAttempt = $util.Long.fromValue(object.lastAttempt)).unsigned = true;
            else if (typeof object.lastAttempt === "string")
                message.lastAttempt = parseInt(object.lastAttempt, 10);
            else if (typeof object.lastAttempt === "number")
                message.lastAttempt = object.lastAttempt;
            else if (typeof object.lastAttempt === "object")
                message.lastAttempt = new $util.LongBits(object.lastAttempt.low >>> 0, object.lastAttempt.high >>> 0).toNumber(true);
        if (object.active != null)
            message.active = Boolean(object.active);
        if (object.currentQueue != null)
            message.currentQueue = object.currentQueue | 0;
        if (object.successCount != null)
            message.successCount = object.successCount | 0;
        return message;
    };

    /**
     * Creates a plain object from a Peer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Peer
     * @static
     * @param {Peer} message Peer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Peer.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.host = "";
            object.port = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.lastSeen = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.lastSeen = options.longs === String ? "0" : 0;
            object.failCount = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.lastAttempt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.lastAttempt = options.longs === String ? "0" : 0;
            object.active = false;
            object.currentQueue = 0;
            object.successCount = 0;
        }
        if (message.host != null && message.hasOwnProperty("host"))
            object.host = message.host;
        if (message.port != null && message.hasOwnProperty("port"))
            object.port = message.port;
        if (message.lastSeen != null && message.hasOwnProperty("lastSeen"))
            if (typeof message.lastSeen === "number")
                object.lastSeen = options.longs === String ? String(message.lastSeen) : message.lastSeen;
            else
                object.lastSeen = options.longs === String ? $util.Long.prototype.toString.call(message.lastSeen) : options.longs === Number ? new $util.LongBits(message.lastSeen.low >>> 0, message.lastSeen.high >>> 0).toNumber(true) : message.lastSeen;
        if (message.failCount != null && message.hasOwnProperty("failCount"))
            object.failCount = message.failCount;
        if (message.lastAttempt != null && message.hasOwnProperty("lastAttempt"))
            if (typeof message.lastAttempt === "number")
                object.lastAttempt = options.longs === String ? String(message.lastAttempt) : message.lastAttempt;
            else
                object.lastAttempt = options.longs === String ? $util.Long.prototype.toString.call(message.lastAttempt) : options.longs === Number ? new $util.LongBits(message.lastAttempt.low >>> 0, message.lastAttempt.high >>> 0).toNumber(true) : message.lastAttempt;
        if (message.active != null && message.hasOwnProperty("active"))
            object.active = message.active;
        if (message.currentQueue != null && message.hasOwnProperty("currentQueue"))
            object.currentQueue = message.currentQueue;
        if (message.successCount != null && message.hasOwnProperty("successCount"))
            object.successCount = message.successCount;
        return object;
    };

    /**
     * Converts this Peer to JSON.
     * @function toJSON
     * @memberof Peer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Peer.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Peer;
})();

$root.DBState = (function() {

    /**
     * Properties of a DBState.
     * @exports IDBState
     * @interface IDBState
     * @property {IAccount|null} [account] DBState account
     * @property {IStateNode|null} [node] DBState node
     * @property {number|null} [refCount] DBState refCount
     */

    /**
     * Constructs a new DBState.
     * @exports DBState
     * @classdesc Represents a DBState.
     * @implements IDBState
     * @constructor
     * @param {IDBState=} [properties] Properties to set
     */
    function DBState(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DBState account.
     * @member {IAccount|null|undefined} account
     * @memberof DBState
     * @instance
     */
    DBState.prototype.account = null;

    /**
     * DBState node.
     * @member {IStateNode|null|undefined} node
     * @memberof DBState
     * @instance
     */
    DBState.prototype.node = null;

    /**
     * DBState refCount.
     * @member {number} refCount
     * @memberof DBState
     * @instance
     */
    DBState.prototype.refCount = 0;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * DBState state.
     * @member {"account"|"node"|"refCount"|undefined} state
     * @memberof DBState
     * @instance
     */
    Object.defineProperty(DBState.prototype, "state", {
        get: $util.oneOfGetter($oneOfFields = ["account", "node", "refCount"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new DBState instance using the specified properties.
     * @function create
     * @memberof DBState
     * @static
     * @param {IDBState=} [properties] Properties to set
     * @returns {DBState} DBState instance
     */
    DBState.create = function create(properties) {
        return new DBState(properties);
    };

    /**
     * Encodes the specified DBState message. Does not implicitly {@link DBState.verify|verify} messages.
     * @function encode
     * @memberof DBState
     * @static
     * @param {IDBState} message DBState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DBState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.account != null && message.hasOwnProperty("account"))
            $root.Account.encode(message.account, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.node != null && message.hasOwnProperty("node"))
            $root.StateNode.encode(message.node, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.refCount != null && message.hasOwnProperty("refCount"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.refCount);
        return writer;
    };

    /**
     * Encodes the specified DBState message, length delimited. Does not implicitly {@link DBState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DBState
     * @static
     * @param {IDBState} message DBState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DBState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DBState message from the specified reader or buffer.
     * @function decode
     * @memberof DBState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DBState} DBState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DBState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DBState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.account = $root.Account.decode(reader, reader.uint32());
                break;
            case 2:
                message.node = $root.StateNode.decode(reader, reader.uint32());
                break;
            case 3:
                message.refCount = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DBState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DBState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DBState} DBState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DBState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DBState message.
     * @function verify
     * @memberof DBState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DBState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.account != null && message.hasOwnProperty("account")) {
            properties.state = 1;
            {
                var error = $root.Account.verify(message.account);
                if (error)
                    return "account." + error;
            }
        }
        if (message.node != null && message.hasOwnProperty("node")) {
            if (properties.state === 1)
                return "state: multiple values";
            properties.state = 1;
            {
                var error = $root.StateNode.verify(message.node);
                if (error)
                    return "node." + error;
            }
        }
        if (message.refCount != null && message.hasOwnProperty("refCount")) {
            if (properties.state === 1)
                return "state: multiple values";
            properties.state = 1;
            if (!$util.isInteger(message.refCount))
                return "refCount: integer expected";
        }
        return null;
    };

    /**
     * Creates a DBState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DBState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DBState} DBState
     */
    DBState.fromObject = function fromObject(object) {
        if (object instanceof $root.DBState)
            return object;
        var message = new $root.DBState();
        if (object.account != null) {
            if (typeof object.account !== "object")
                throw TypeError(".DBState.account: object expected");
            message.account = $root.Account.fromObject(object.account);
        }
        if (object.node != null) {
            if (typeof object.node !== "object")
                throw TypeError(".DBState.node: object expected");
            message.node = $root.StateNode.fromObject(object.node);
        }
        if (object.refCount != null)
            message.refCount = object.refCount >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a DBState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DBState
     * @static
     * @param {DBState} message DBState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DBState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.account != null && message.hasOwnProperty("account")) {
            object.account = $root.Account.toObject(message.account, options);
            if (options.oneofs)
                object.state = "account";
        }
        if (message.node != null && message.hasOwnProperty("node")) {
            object.node = $root.StateNode.toObject(message.node, options);
            if (options.oneofs)
                object.state = "node";
        }
        if (message.refCount != null && message.hasOwnProperty("refCount")) {
            object.refCount = message.refCount;
            if (options.oneofs)
                object.state = "refCount";
        }
        return object;
    };

    /**
     * Converts this DBState to JSON.
     * @function toJSON
     * @memberof DBState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DBState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DBState;
})();

$root.Account = (function() {

    /**
     * Properties of an Account.
     * @exports IAccount
     * @interface IAccount
     * @property {number|Long|null} [balance] Account balance
     * @property {number|null} [nonce] Account nonce
     */

    /**
     * Constructs a new Account.
     * @exports Account
     * @classdesc Represents an Account.
     * @implements IAccount
     * @constructor
     * @param {IAccount=} [properties] Properties to set
     */
    function Account(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Account balance.
     * @member {number|Long} balance
     * @memberof Account
     * @instance
     */
    Account.prototype.balance = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Account nonce.
     * @member {number} nonce
     * @memberof Account
     * @instance
     */
    Account.prototype.nonce = 0;

    /**
     * Creates a new Account instance using the specified properties.
     * @function create
     * @memberof Account
     * @static
     * @param {IAccount=} [properties] Properties to set
     * @returns {Account} Account instance
     */
    Account.create = function create(properties) {
        return new Account(properties);
    };

    /**
     * Encodes the specified Account message. Does not implicitly {@link Account.verify|verify} messages.
     * @function encode
     * @memberof Account
     * @static
     * @param {IAccount} message Account message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Account.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.balance != null && message.hasOwnProperty("balance"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.balance);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.nonce);
        return writer;
    };

    /**
     * Encodes the specified Account message, length delimited. Does not implicitly {@link Account.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Account
     * @static
     * @param {IAccount} message Account message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Account.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Account message from the specified reader or buffer.
     * @function decode
     * @memberof Account
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Account} Account
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Account.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Account();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.balance = reader.uint64();
                break;
            case 2:
                message.nonce = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Account message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Account
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Account} Account
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Account.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Account message.
     * @function verify
     * @memberof Account
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Account.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.balance != null && message.hasOwnProperty("balance"))
            if (!$util.isInteger(message.balance) && !(message.balance && $util.isInteger(message.balance.low) && $util.isInteger(message.balance.high)))
                return "balance: integer|Long expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce))
                return "nonce: integer expected";
        return null;
    };

    /**
     * Creates an Account message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Account
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Account} Account
     */
    Account.fromObject = function fromObject(object) {
        if (object instanceof $root.Account)
            return object;
        var message = new $root.Account();
        if (object.balance != null)
            if ($util.Long)
                (message.balance = $util.Long.fromValue(object.balance)).unsigned = true;
            else if (typeof object.balance === "string")
                message.balance = parseInt(object.balance, 10);
            else if (typeof object.balance === "number")
                message.balance = object.balance;
            else if (typeof object.balance === "object")
                message.balance = new $util.LongBits(object.balance.low >>> 0, object.balance.high >>> 0).toNumber(true);
        if (object.nonce != null)
            message.nonce = object.nonce >>> 0;
        return message;
    };

    /**
     * Creates a plain object from an Account message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Account
     * @static
     * @param {Account} message Account
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Account.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.balance = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.balance = options.longs === String ? "0" : 0;
            object.nonce = 0;
        }
        if (message.balance != null && message.hasOwnProperty("balance"))
            if (typeof message.balance === "number")
                object.balance = options.longs === String ? String(message.balance) : message.balance;
            else
                object.balance = options.longs === String ? $util.Long.prototype.toString.call(message.balance) : options.longs === Number ? new $util.LongBits(message.balance.low >>> 0, message.balance.high >>> 0).toNumber(true) : message.balance;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        return object;
    };

    /**
     * Converts this Account to JSON.
     * @function toJSON
     * @memberof Account
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Account.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Account;
})();

$root.StateNode = (function() {

    /**
     * Properties of a StateNode.
     * @exports IStateNode
     * @interface IStateNode
     * @property {Array.<INodeRef>|null} [nodeRefs] StateNode nodeRefs
     */

    /**
     * Constructs a new StateNode.
     * @exports StateNode
     * @classdesc Represents a StateNode.
     * @implements IStateNode
     * @constructor
     * @param {IStateNode=} [properties] Properties to set
     */
    function StateNode(properties) {
        this.nodeRefs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StateNode nodeRefs.
     * @member {Array.<INodeRef>} nodeRefs
     * @memberof StateNode
     * @instance
     */
    StateNode.prototype.nodeRefs = $util.emptyArray;

    /**
     * Creates a new StateNode instance using the specified properties.
     * @function create
     * @memberof StateNode
     * @static
     * @param {IStateNode=} [properties] Properties to set
     * @returns {StateNode} StateNode instance
     */
    StateNode.create = function create(properties) {
        return new StateNode(properties);
    };

    /**
     * Encodes the specified StateNode message. Does not implicitly {@link StateNode.verify|verify} messages.
     * @function encode
     * @memberof StateNode
     * @static
     * @param {IStateNode} message StateNode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StateNode.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nodeRefs != null && message.nodeRefs.length)
            for (var i = 0; i < message.nodeRefs.length; ++i)
                $root.NodeRef.encode(message.nodeRefs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified StateNode message, length delimited. Does not implicitly {@link StateNode.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StateNode
     * @static
     * @param {IStateNode} message StateNode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StateNode.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StateNode message from the specified reader or buffer.
     * @function decode
     * @memberof StateNode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StateNode} StateNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StateNode.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StateNode();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.nodeRefs && message.nodeRefs.length))
                    message.nodeRefs = [];
                message.nodeRefs.push($root.NodeRef.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StateNode message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StateNode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StateNode} StateNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StateNode.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StateNode message.
     * @function verify
     * @memberof StateNode
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StateNode.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nodeRefs != null && message.hasOwnProperty("nodeRefs")) {
            if (!Array.isArray(message.nodeRefs))
                return "nodeRefs: array expected";
            for (var i = 0; i < message.nodeRefs.length; ++i) {
                var error = $root.NodeRef.verify(message.nodeRefs[i]);
                if (error)
                    return "nodeRefs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a StateNode message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StateNode
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StateNode} StateNode
     */
    StateNode.fromObject = function fromObject(object) {
        if (object instanceof $root.StateNode)
            return object;
        var message = new $root.StateNode();
        if (object.nodeRefs) {
            if (!Array.isArray(object.nodeRefs))
                throw TypeError(".StateNode.nodeRefs: array expected");
            message.nodeRefs = [];
            for (var i = 0; i < object.nodeRefs.length; ++i) {
                if (typeof object.nodeRefs[i] !== "object")
                    throw TypeError(".StateNode.nodeRefs: object expected");
                message.nodeRefs[i] = $root.NodeRef.fromObject(object.nodeRefs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a StateNode message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StateNode
     * @static
     * @param {StateNode} message StateNode
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StateNode.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.nodeRefs = [];
        if (message.nodeRefs && message.nodeRefs.length) {
            object.nodeRefs = [];
            for (var j = 0; j < message.nodeRefs.length; ++j)
                object.nodeRefs[j] = $root.NodeRef.toObject(message.nodeRefs[j], options);
        }
        return object;
    };

    /**
     * Converts this StateNode to JSON.
     * @function toJSON
     * @memberof StateNode
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StateNode.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StateNode;
})();

$root.NodeRef = (function() {

    /**
     * Properties of a NodeRef.
     * @exports INodeRef
     * @interface INodeRef
     * @property {Uint8Array|null} [address] NodeRef address
     * @property {Uint8Array|null} [child] NodeRef child
     */

    /**
     * Constructs a new NodeRef.
     * @exports NodeRef
     * @classdesc Represents a NodeRef.
     * @implements INodeRef
     * @constructor
     * @param {INodeRef=} [properties] Properties to set
     */
    function NodeRef(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NodeRef address.
     * @member {Uint8Array} address
     * @memberof NodeRef
     * @instance
     */
    NodeRef.prototype.address = $util.newBuffer([]);

    /**
     * NodeRef child.
     * @member {Uint8Array} child
     * @memberof NodeRef
     * @instance
     */
    NodeRef.prototype.child = $util.newBuffer([]);

    /**
     * Creates a new NodeRef instance using the specified properties.
     * @function create
     * @memberof NodeRef
     * @static
     * @param {INodeRef=} [properties] Properties to set
     * @returns {NodeRef} NodeRef instance
     */
    NodeRef.create = function create(properties) {
        return new NodeRef(properties);
    };

    /**
     * Encodes the specified NodeRef message. Does not implicitly {@link NodeRef.verify|verify} messages.
     * @function encode
     * @memberof NodeRef
     * @static
     * @param {INodeRef} message NodeRef message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NodeRef.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.address);
        if (message.child != null && message.hasOwnProperty("child"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.child);
        return writer;
    };

    /**
     * Encodes the specified NodeRef message, length delimited. Does not implicitly {@link NodeRef.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NodeRef
     * @static
     * @param {INodeRef} message NodeRef message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NodeRef.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NodeRef message from the specified reader or buffer.
     * @function decode
     * @memberof NodeRef
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NodeRef} NodeRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NodeRef.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NodeRef();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.address = reader.bytes();
                break;
            case 2:
                message.child = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NodeRef message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NodeRef
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NodeRef} NodeRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NodeRef.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NodeRef message.
     * @function verify
     * @memberof NodeRef
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NodeRef.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!(message.address && typeof message.address.length === "number" || $util.isString(message.address)))
                return "address: buffer expected";
        if (message.child != null && message.hasOwnProperty("child"))
            if (!(message.child && typeof message.child.length === "number" || $util.isString(message.child)))
                return "child: buffer expected";
        return null;
    };

    /**
     * Creates a NodeRef message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NodeRef
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NodeRef} NodeRef
     */
    NodeRef.fromObject = function fromObject(object) {
        if (object instanceof $root.NodeRef)
            return object;
        var message = new $root.NodeRef();
        if (object.address != null)
            if (typeof object.address === "string")
                $util.base64.decode(object.address, message.address = $util.newBuffer($util.base64.length(object.address)), 0);
            else if (object.address.length)
                message.address = object.address;
        if (object.child != null)
            if (typeof object.child === "string")
                $util.base64.decode(object.child, message.child = $util.newBuffer($util.base64.length(object.child)), 0);
            else if (object.child.length)
                message.child = object.child;
        return message;
    };

    /**
     * Creates a plain object from a NodeRef message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NodeRef
     * @static
     * @param {NodeRef} message NodeRef
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NodeRef.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.address = options.bytes === String ? "" : [];
            object.child = options.bytes === String ? "" : [];
        }
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = options.bytes === String ? $util.base64.encode(message.address, 0, message.address.length) : options.bytes === Array ? Array.prototype.slice.call(message.address) : message.address;
        if (message.child != null && message.hasOwnProperty("child"))
            object.child = options.bytes === String ? $util.base64.encode(message.child, 0, message.child.length) : options.bytes === Array ? Array.prototype.slice.call(message.child) : message.child;
        return object;
    };

    /**
     * Converts this NodeRef to JSON.
     * @function toJSON
     * @memberof NodeRef
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NodeRef.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NodeRef;
})();

module.exports = $root;
