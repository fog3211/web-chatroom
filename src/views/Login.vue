<template>
    <div class="login" id="login">
        <Card title="欢迎登录" :bordered="false" icon="ios-contact" class="login-card">
            <div class="form-con">
                <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleLogin">
                    <FormItem prop="userName" class="form-item">
                        <Input v-model="form.userName" placeholder="请输入用户名" size="large">
                        <span slot="prepend">
                            <Icon size="20" type="ios-person"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="password" class="form-item">
                        <Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
                        <span slot="prepend">
                            <Icon size="20" type="md-lock"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <p class="login-tip" >账号：admin，密码：123456</p>
                    <FormItem class="btnGroop">
                        <Button @click.native.prevent="handleRegister" type="info" class="submitBtn">注册</Button>
                        <Button @click.native.prevent="handleLogin" type="primary" class="submitBtn" :loading="loading">登录</Button>
                        <Button @click.native.prevent="handleForgetPassword" type="warning" class="submitBtn">忘记密码</Button>
                    </FormItem>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
import axios from "axios";
import md5 from 'js-md5';
import {
    checkUserName,
    checkPassword,
    minRule,
    maxRule
} from "@/common/checkRules";

export default {
    data() {
        return {
            form: {
                userName: "",
                password: ""
            },
            loading: false,
            rules: {
                userName: [{ validator: checkUserName, trigger: "blur" }],
                password: [
                    minRule,
                    maxRule,
                    { validator: checkPassword, trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        handleRegister() {
            this.$router.push("/register");
        },
        handleForgetPassword() {
            this.$router.push("/forgetpwd");
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let sendForm={
                         userName: this.form.userName,
                         password: md5(this.form.userName)
                    };
                    axios
                        .post("http://localhost:3000/login", sendForm)
                        .then(res => {
                            this.loading = false;
                            // console.log(res.data);
                            if (res.data === "success") {
                                sessionStorage.setItem(
                                    "user",
                                    this.form.userName
                                );
                                this.$Message.success("登录成功");
                                this.$router.push({path:"/chat"});
                            } else if (res.data === "none") {
                                this.$Message.error("用户不存在!");
                            } else {
                                this.$Message.error("密码错误!");
                            }
                        })
                        .catch(error => {
                            this.loading = false;
                            // console.log(error);
                        });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.login {
    height: 100%;
    width: 100%;
    position: absolute;
    background-image: url("../assets/images/login-bg.jpg");
    background-size: cover;
    background-position: center;
    &-card {
        // text-align: center;
        position: absolute;
        right: 160px;
        top: 30%;
        width: 360px;
        .form-con {
            padding-top: 15px;
            .btnGroop {
                margin: 0 auto;
                .submitBtn {
                    width: 75px;
                    margin: 0 13px;
                }
            }
            .form-item {
                padding-top: 5px;
                padding-bottom: 10px;
            }
            .login-tip {
                font-size: 12px;
                text-align: center;
                color: #808080;
                padding-bottom: 15px;
                letter-spacing: 2px;
            }
        }
    }
}
</style>
