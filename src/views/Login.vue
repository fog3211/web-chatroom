<template>
    <div class="login">
        <Card title="欢迎登录" :bordered="false" icon="ios-contact" class="login-card">
            <div class="form-con">
                <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
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
                    <FormItem>
                        <Button @click.native.prevent="handleRegister" type="info" long class="submitBtn">注册</Button>
                        <Button @click.native.prevent="handleLogin" type="primary" long class="">登录</Button>
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
            logining: false,
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
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    axios
                        .post("http://localhost:3000/login", this.form)
                        .then(res => {
                            if (res.data === "success") {
                                this.$Message.success("登录成功");
                            } else {
                                this.$Message.error("登录失败!");
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        }
    },
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
            .submitBtn {
                margin-bottom: 10px;
            }
        }
    }
}
</style>
