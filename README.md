# Demo of secure browser upload to S3

This is a supplement to the article [Simplifying Browser Uploads By Bypassing The Middleman](https://medium.com/@akshay.g174_68301/simplifying-browser-uploads-by-bypassing-the-middleman-b7fdbab63d67)

## How to run

You will need [Node.js](https://nodejs.org).

Get an AWS account
Create an S3 bucket
Create a new user in IAM Role Management who can upload video to your bucket
generate a key pair (refer to the article for details),
then run:



``` shell
node server.js
```

and finally open [http://localhost:3030](http://localhost:3030) in your browser.
