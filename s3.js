const crypto = require('crypto');
const { config } = require('./config/config');
const { getDateString, addOffsetToDate } = require('./helpers/date');

let getS3UploadParams = (params) => {
    return {
        endpoint_url: `http://${config.bucket}.s3.amazonaws.com`,
        params: getUploadParams(params)
    };
};

let getUploadParams = (params) => {
    let filename = crypto.randomBytes(16).toString('hex');
    let credential = getAmazonCredential();
    let policy = getPolicyDocument(filename, credential, params);
    let policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');

    return {
        key: filename,
        acl: 'public-read',
        success_action_status: '201',
        policy: policyBase64,
        'content-type': params.contentType,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': credential,
        'x-amz-date': getDateString() + 'T000000Z',
        'x-amz-signature': s3UploadSignature(policyBase64)
    };
};

let getAmazonCredential = () => {
    return [config.accessKey,
        getDateString(),
        config.region,
        's3/aws4_request'
    ].join('/');
};

let getPolicyDocument = (filename, credential, params) => {
    return {
        expiration: addOffsetToDate(1 * 60 * 60 * 1000).toISOString(),
        conditions: [
            { key: filename },
            { acl: 'public-read' },
            { success_action_status: '201' },
            { bucket: config.bucket },
            ['content-length-range', 0, 10485760], //limit to 10MB files
            ['starts-with', '$Content-Type', params.contentType],
            { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
            { 'x-amz-credential': credential },
            { 'x-amz-date': getDateString() + 'T000000Z' }
        ]
    };
};

let hmac = (key, string) => {
  let hmac = require('crypto').createHmac('sha256', key);
  hmac.end(string);
  return hmac.read();
}

let s3UploadSignature = (policyBase64) => {
  let dateKey = hmac(`AWS4${config.secretKey}`, getDateString());
  let dateRegionKey = hmac(dateKey, config.region);
  let dateRegionServiceKey = hmac(dateRegionKey, 's3');
  let signingKey = hmac(dateRegionServiceKey, 'aws4_request');
  return hmac(signingKey, policyBase64).toString('hex');
}

module.exports = { getS3UploadParams };
