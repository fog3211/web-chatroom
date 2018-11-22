// 验证账号
const checkUserName = (rule, value, callback) => {
  if (value === "" || value.trim() === "") {
    callback(new Error("请输入账号"));
  } else {
    callback();
  }
};
// 验证密码
const checkPassword = (rule, value, callback) => {
  if (value === "" || value.trim() === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
// this.form.password 此处有坑
// 验证密码一致
// const checkRePassword = (rule, value, callback) => {
//   if (value === "" || value.trim() === "") {
//     callback(new Error("请输入密码"));
//   } else {
//     if (value !== this.form.password) {
//       callback(new Error("两次密码不一致"));
//     } else {
//       callback();
//     }
//   }
// };

// 最小长度限制
const minRule = {
  min: 6,
  message: "密码长度最少为6位",
  trigger: "blur"
};

// 最大长度限制
const maxRule = {
  max: 16,
  message: "密码长度最多为16位",
  trigger: "blur"
};

export {
  checkUserName,
  checkPassword,
  minRule,
  maxRule,
}
