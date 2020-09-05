const yup = require("yup");

module.exports = {
  registerModel: () => {
    return yup.object().shape({
      username: yup
        .string()
        .min(5)
        .matches(
          /^[a-zA-Z0-9]*$/gm,
          "Username must be format alphanumeric without space"
        )
        .required(),
      password: yup
        .string()
        .min(7)
        .required()
        .matches(
          /^[a-zA-Z0-9]*$/gm,
          "Password must be format alphanumeric without space"
        ),
      store_name: yup.string().required(),
      owner_name: yup.string().required(),
    });
  },
  loginModel: () => {
    return yup.object().shape({
      username: yup.string().min(5).required(),
      password: yup
        .string()
        .min(7)
        .required()
        .matches(
          /^[a-zA-Z0-9]*$/gm,
          "Password must be format alphanumeric without space"
        ),
    });
  },
};
