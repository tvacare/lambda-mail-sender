# Lambda-Mail-Sender λ

## Getting Started

- See the .env.example and create a new file called '.env' where you should include your environment variables
- Install the dependencies
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
Test it using SNS - publish a new message to the topic that triggers the lambda function
For more: check logs on AWS cloudwatch

```

*** Before testing this lambda function you must configure your AWS SNS, SQS and SES services

## Author
* **Thiago Vacare**
