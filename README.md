# Task

Create a AWS Lambda function that can perform miscellaneous operations on an image located in our public s3 bucket and return the manipulated image to the caller. 

The S3 URI for the image is:
`s3://dado-playground-images/dado-logo.png`.

The Lambda function should allow the caller to conditionally manipulate the image given query string parameters (such as `greyscale=true`)

# Setup

* yarn install
* yarn run sls offline

# Tips
* To return binary media from an AWS Lambda function, the response must be base64 encoded.
  - See AWS Docs: [Return binary media from a Lambda proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/lambda-proxy-binary-media.html)
* [AWS JS SDK Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
* [jimp Docs](https://www.npmjs.com/package/jimp)