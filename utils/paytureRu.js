const { PaytureInPay } = require("payture-official/apiLib/InPay");
const {
  PAYTURE_URL,
  PAYTURE_TERMINAL_RUB,
  PAYTURE_TERMINAL_PASSWORD,
} = require("../config");

const inPayRu = new PaytureInPay(PAYTURE_URL, {
  Key: PAYTURE_TERMINAL_RUB,
  Password: PAYTURE_TERMINAL_PASSWORD,
});

exports.paytureRuInit = (data) =>
  new Promise((resolve, reject) => {
    inPayRu.init(data, function (error, response, body, responseObject) {
      if (error) reject(error);

      resolve(responseObject);
    });
  });

exports.paytureRuStatus = (orderId) =>
  new Promise((resolve, reject) => {
    inPayRu.payStatus(
      orderId,
      function (error, response, body, responseObject) {
        if (error) reject(error);

        resolve(responseObject);
      }
    );
  });

exports.paytureRuPay = (sessionId) =>
  new Promise((resolve, reject) => {
    inPayRu.pay(sessionId, function (error, response, body, responseObject) {
      if (error) reject(error);

      resolve(responseObject);
    });
  });
