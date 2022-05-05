"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const jimp_1 = __importDefault(require("jimp"));
aws_sdk_1.default.config.update({
    accessKeyId: "AKIATYDRR7MGN5W3M2CF",
    secretAccessKey: "6VPFU8Yw+3oBOwHVLX9moErc4pVBEAvEhNY2vQJp",
    region: "us-east-1",
});
const s3 = new aws_sdk_1.default.S3();
/** Example lambda: GET /dev/image?name=John */
const handler = async (event) => {
    const params = event.queryStringParameters || {};
    const optionVals = ["true", "false", undefined];
    let convertedParams = {
        greyscale: params.greyscale == "true" ? true : false,
        invert: params.invert == "true" ? true : false,
    };
    const image = await s3
        .getObject({ Bucket: "dado-playground-images", Key: "dado-logo.png" })
        .promise();
    const imageBuffer = Buffer.from(image.Body, "base64");
    const imageJimp = await jimp_1.default.read(imageBuffer);
    if (convertedParams.greyscale == true) {
        imageJimp.greyscale();
    }
    if (convertedParams.invert == true) {
        imageJimp.invert();
    }
    const imageBufferResized = await imageJimp.getBufferAsync(jimp_1.default.MIME_PNG);
    if (!optionVals.includes(params.greyscale) ||
        !optionVals.includes(params.invert)) {
        const body = `Bad Request: Invalid parameters.`;
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "text/html",
            },
            body: `<h1>${body}</h1>`,
        };
    }
    else {
        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "image/png",
            },
            body: imageBufferResized.toString("base64"),
            isBase64Encoded: true,
        };
        return response;
    }
};
exports.handler = handler;
//# sourceMappingURL=process-image.js.map