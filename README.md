# Demo of secure browser upload to S3

This is a supplement to the article [Simplifying Browser Uploads By Bypassing The Middleman](https://medium.com/@akshay.g174_68301/simplifying-browser-uploads-by-bypassing-the-middleman-b7fdbab63d67)

## How to run

You will need [Node.js](https://nodejs.org).

* Get an AWS account

* Create an S3 bucket

* Create a new user in IAM Role Management who can upload video to your bucket. Save this generated key pair.

* Edit config file (at ./config/config.js) with your configuration.

Sample config:

```
{
    accessKey: "AKIOPGTA25GJRUVB26QW",
    secretKey: "3WqBjXT4vAJUwGv5RbzASpljioHTINnLFK87",
    bucket: "my-bucket.ninetyone.com",
    region: "us-west-1"
};
```

* Then run:

```
node server.js
```

and finally open [http://localhost:3030](http://localhost:3030) in your browser.
