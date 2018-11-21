<template>
    <div class="login">
        <Card title="欢迎登录" :bordered="false" icon="ios-contact" class="login-card">
            <div class="form-con">
                <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleLogin">
                    <FormItem prop="userName">
                        <Input v-model="form.userName" placeholder="请输入用户名">
                        <span slot="prepend">
                            <Icon :size="16" type="ios-person"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="form.password" placeholder="请输入密码">
                        <span slot="prepend">
                            <Icon :size="16" type="md-lock"></Icon>
                        </span>
                        </Input>
                    </FormItem>
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
import { checkUserName, checkPassword } from "@/common/checkRules";

export default {
    data() {
        return {
            form: {
                userName: "admin",
                password: "123456"
            },
            loading: false,
            rules: {
                userName: [{ validator: checkUserName, trigger: "blur" }],
                password: [{ validator: checkPassword, trigger: "blur" }]
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
                    axios
                        .post("http://localhost:3000/login", this.form)
                        .then(res => {
                            this.loading = false;
                            // console.log(res.data);
                            if (res.data === "success") {
                                this.$Message.success("登录成功");
                            } else if (res.data === "none") {
                                this.$Message.error("用户不存在!");
                            } else {
                                this.$Message.error("密码错误!");
                            }
                        })
                        .catch(error => {
                            this.loading = false;
                            console.log(error);
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
        width: 300px;
        &-header {
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con {
            padding-top: 10px;
            .btnGroop {
                margin: 0 auto;
                .submitBtn {
                    width: 75px;
                    margin: 0 5px;
                }
            }
        }
    }
}
</style>
