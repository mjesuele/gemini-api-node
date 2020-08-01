"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
exports.default = ({ key, secret, payload, }) => {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(`base64`);
    const signature = crypto_1.default
        .createHmac(`sha384`, secret)
        .update(encodedPayload)
        .digest(`hex`);
    console.log({ key, payload, encodedPayload, signature });
    return {
        headers: {
            "Content-Length": 0,
            "Conent-Type": "text/plain",
            "X-GEMINI-APIKEY": key,
            "X-GEMINI-PAYLOAD": encodedPayload,
            "X-GEMINI-SIGNATURE": signature,
            "Cache-Control": "no-cache",
        },
    };
};
//# sourceMappingURL=createRequestConfig.js.map