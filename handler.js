/**
 *
 * +----------------------------------+
 * |  Thiago Vacare                   |
 * |  01/2018                         |
 * +----------------------------------+
 *
 * */

'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');

const {getSQSMessage} = require('./helper');
const {deleteSQSMessage} = require('./helper');
const {sendSNSEmail} = require('./helper');
const {getSESTemplate} = require('./helper');

require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_REGION
});

AWS.config.setPromisesDependency(Promise);

module.exports.sender = (event, context, callback) => {
    const SES = new AWS.SES();
    const SQS = new AWS.SQS();

    return getSQSMessage(SQS)
      .then(msg => {
          console.log('Reading message', msg);

          if (msg.Messages) {
              let [message] = msg.Messages;

              if (message && message.Body) {
                  const body = JSON.parse(message.Body);

                  return getSESTemplate(SES, body.template, body.context)
                    .then(template => {
                        template = template || '';
                        sendSNSEmail(body.mailTo, body.subject, template);
                        return message;
                    });
              }
          }
      })
      .then(message => {

          if (message) {
              const receiptHandle = message.ReceiptHandle;
              deleteSQSMessage(SQS, receiptHandle)
          }
      })
      .catch(err => {
          throw new Error(err)
      });
};