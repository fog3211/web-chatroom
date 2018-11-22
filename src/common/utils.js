export default {
  // 制作验证码字符串
  makeCode(code, l) {
    let str = '';
    for (let i = 0; i < l; i++) {
      str += code[
        Math.floor(Math.random() * code.length)
        // Math.floor(Math.random() * (max - min) + min);
      ];
    }
    return str;
  }
}
