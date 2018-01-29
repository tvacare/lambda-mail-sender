/**
 *
 * +----------------------------------+
 * |  Thiago Vacare                   |
 * |  01/2018                         |
 * +----------------------------------+
 *
 * */

"use strict";

const Nodemailer = require('nodemailer');
const Nunjucks = require('nunjucks');

require('dotenv').config();

const sqsQueue = process.env.SQS_QUEUE;

module.exports = {

    getSQSMessage: (SQS) => {
        return SQS.receiveMessage({
            QueueUrl: sqsQueue,
            WaitTimeSeconds: process.env.SQS_WAIT_TIME,
            MaxNumberOfMessages: process.env.SQS_MAX_MESSAGES
        }).promise()
    },

    deleteSQSMessage: (SQS, receiptHandle) => {
        const params = {
            QueueUrl: sqsQueue,
            ReceiptHandle: receiptHandle
        };
        return SQS.deleteMessage(params)
          .promise()
          .then((msg) => {
              console.log('Message deleted', msg);
          });
    },

    sendSNSEmail: (mailTo, subject, template) => {
        const transporter = Nodemailer.createTransport({
            host: process.env.SES_SMTP_HOST,
            port: process.env.SES_SMTP_PORT,
            secure: process.env.SES_SMTP_SECURE,
            auth: {
                user: process.env.SES_SMTP_USER,
                pass: process.env.SES_SMTP_PASS
            }
        });

        const mailOptions = {
            from: `${process.env.SES_EMAIL_FROM_ALIAS}<${process.env.SES_EMAIL_FROM}>`,
            to: mailTo,
            subject: subject,
            html: template
        };

        console.log('Sending email');
        return transporter.sendMail(mailOptions).then(() => console.log('Email was sent'));
    },

    getSESTemplate: (SES, templateName, token) => {
        const baseUrl = process.env.BASE_URL;
        const protocol = process.env.PROTOCOL;

        return SES.getTemplate({TemplateName: templateName})
          .promise()
          .then(response => {
              const template = response.Template ? response.Template.HtmlPart : null;
              if (template) {
                  return Nunjucks.renderString(template, {protocol, baseUrl, token});
              }
          })
    }
};