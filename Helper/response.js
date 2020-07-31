module.exports = {
  doFormat: (code, message, datas) => {
    let data = datas ? datas : false;
    return {
      code: code,
      message: message,
      data: data,
    };
  },
};
