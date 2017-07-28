const request = require('request-promise');
const keys = require('../config/keys');

const MANDRILL_BASE_URL = 'https://mandrillapp.com/api/1.0';
const SEND_ENDPOINT = '/messages/send.json';

/**
 * Sends a Mail through Mandrill.
 * Api: https://mandrillapp.com/api/docs/messages.html
 */
const sendEmail = async (to, subject, text) => {
  const result = await request.post({
    url: `${MANDRILL_BASE_URL}${SEND_ENDPOINT}`,
    method: 'POST',
    json: true,
    body: {
      message: {
        to: [{ email: to }],
        subject: subject,
        text: text,
        from_email: keys.MAIL_FROM_ADDRESS,
      },
      key: keys.MANDRILL_API_KEY,
    },
  });
  if (!Array.isArray(result) && result.status && result.status === 'error') {
    throw new Error(`Send email error, code: ${result.message}, message: ${result.code}`);
  }
  return result;
};

exports.sendVerifyAccountEmail = async (to, url) => {
  const text = `
    You are receiving this email because you (or someone else) have requested the creation of a new account.\n\n
    Please click on the following link, or paste it into your browser to complete the process:\n
    ${url}\n
    If you did not request this, please ignore this email.\n
  `;
  await sendEmail(to, 'Confirm your account', text);
};

exports.sendPasswordResetEmail = async (to, url) => {
  const text = `
    You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n
    Please click on the following link, or paste it into your browser to complete the process:\n
    ${url}\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n
  `;
  await sendEmail(to, 'Password reset', text);
};
