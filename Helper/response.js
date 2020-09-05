const moment = require("moment");
module.exports = {
  doFormat: (code, message, datas) => {
    let data = datas ? datas : false;
    return {
      code: code,
      message: message,
      datas: data,
    };
  },
  dateNow: () => {
    return moment().format();
  },
};
