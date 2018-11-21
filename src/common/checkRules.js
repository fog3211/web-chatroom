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
    if (value.length < 6) {
      callback(new Error("密码不能小于6位"));
    } else if (value.length > 16) {
      callback(new Error("密码不能大于16位"));
    }
    callback();
  }
};
// this.form.password 此处有坑
// 验证密码一致
// const checkRePassword = (rule, value, callback) => {
//   if (value === "" || value.trim() === "") {
//     callback(new Error("请输入密码"));
//   } else {
//     if (value.length < 6) {
//       callback(new Error("密码不能小于6位"));
//     } else if (value.length > 16) {
//       callback(new Error("密码不能大于16位"));
//     } else if (value !== this.form.password) {
//       callback(new Error("两次密码不一致"));
//     } else {
//       callback();
//     }
//   }
// };

export {
  checkUserName,
  checkPassword
}
