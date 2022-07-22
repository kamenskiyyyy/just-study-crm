const { PaytureInPay } = require("payture-official/apiLib/InPay");
const {
  PAYTURE_URL,
  PAYTURE_TERMINAL_PASSWORD,
  PAYTURE_TERMINAL_USD,
} = require("../config");

const inPayEn = new PaytureInPay(PAYTURE_URL, {
  Key: PAYTURE_TERMINAL_USD,
  Password: PAYTURE_TERMINAL_PASSWORD,
});

exports.paytureEnInit = (data) =>
  new Promise((resolve, reject) => {
    inPayEn.init(data, function (error, response, body, responseObject) {
      if (error) reject(error);

      resolve(responseObject);
    });
  });

exports.paytureEnStatus = (orderId) =>
  new Promise((resolve, reject) => {
    inPayEn.payStatus(
      orderId,
      function (error, response, body, responseObject) {
        if (error) reject(error);

        resolve(responseObject);
      }
    );
  });

exports.paytureEnPay = (sessionId) =>
  new Promise((resolve, reject) => {
    inPayEn.pay(sessionId, function (error, response, body, responseObject) {
      if (error) reject(error);

      resolve(responseObject);
    });
  });
