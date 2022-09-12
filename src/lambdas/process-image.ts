import { APIGatewayProxyResult, APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import jimp from "jimp";

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
});

const s3 = new AWS.S3();

interface Params {
  greyscale?: string;
  invert?: string;
}

/** Example lambda: GET /dev/image?name=John */
export const handler: APIGatewayProxyHandler = async (event) => {
  const params: Params = event.queryStringParameters || {};
  const optionVals = ["true", "false", undefined];

  let convertedParams = {
    greyscale: params.greyscale == "true" ? true : false,
    invert: params.invert == "true" ? true : false,
  };

  const image = await s3
    .getObject({ Bucket: "dado-playground-images", Key: "dado-logo.png" })
    .promise();

  const imageBuffer = Buffer.from(image.Body as string, "base64");

  const imageJimp = await jimp.read(imageBuffer);

  if (convertedParams.greyscale == true) {
    imageJimp.greyscale();
  }
  if (convertedParams.invert == true) {
    imageJimp.invert();
  }

  const imageBufferResized = await imageJimp.getBufferAsync(jimp.MIME_PNG);

  if (
    !optionVals.includes(params.greyscale) ||
    !optionVals.includes(params.invert)
  ) {
    const body = `Bad Request: Invalid parameters.`;
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/html",
      },
      body: `<h1>${body}</h1>`,
    };
  } else {
    const response: APIGatewayProxyResult = {
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
