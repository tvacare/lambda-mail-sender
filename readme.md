# TimeHi-Serverless-Mail-Sender

## Getting Started

- see the .env.example, create a new file called '.env' where you should include your configurations
- install the dependencies
- Deploy it using serverless or aws sdk

```
Create a SQS Queue - send a message to this queue with the following data:
{
   "template": "template-name",
   "mailTo": "email@email.com",
   "subject": "new email",
   "context": "params"
}
```
```
Test it usign SNS - publishing a new message to the topic which triggers the lambda function
For more: check logs on AWS Cloudwatch

*λ

```

## Author
@tvacare
