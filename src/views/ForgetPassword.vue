<template>
    <div class="forgetPassword">
        <Card title="重置密码" :bordered="false" icon="ios-contact" class="forgetPassword-card">
            <div class="form-con">
                <Form ref="forgetPasswordForm" :model="form" :rules="rules" @keydown.enter.native="handleforgetPassword">
                    <FormItem prop="userName">
                        <Input v-model="form.userName" placeholder="请输入用户名">
                        <span slot="prepend">
                            <Icon :size="20" type="ios-person"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
                        <span slot="prepend">
                            <Icon :size="20" type="md-lock"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="rePassword">
                        <Input type="password" v-model="form.rePassword" placeholder="请再次输入密码" size="large">
                        <span slot="prepend">
                            <Icon :size="20" type="md-lock"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <FormItem prop="identify" class="identify">
                        <Input v-model="form.identify" placeholder="请输入验证码" class="identifyInput" size="large"></Input>
                        <Identify :identifyCode="identifyCode" @click.native.prevent="refreshIdentify" class="identifyArea"></Identify>
                    </FormItem>
                    <Button @click.native.prevent="handleforgetPassword" type="warning" long class="submitBtn" :loading="loading">重置密码</Button>
                    <Button @click.native.prevent="handleBackLogin" type="primary" long class="">返回登录</Button>
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
import util from "@/common/utils";
import Identify from "_c/Identify";

export default {
    components: {
        Identify
    },
    data() {
        // 验证密码一致
        const checkRePassword = (rule, value, callback) => {
            if (value === "" || value.trim() === "") {
                callback(new Error("请输入密码"));
            } else {
                if (value !== this.form.password) {
                    callback(new Error("两次密码不一致"));
                } else {
                    callback();
                }
            }
        };
        // 校验验证码
        const checkIdentify = (rule, value, callback) => {
            if (value === "" || value.trim() === "") {
                callback(new Error("请输入验证码"));
            } else if (value === this.identifyCode) {
                callback();
            } else {
                callback(new Error("验证码错误"));
            }
        };
        return {
            loading: false,
            form: {
                userName: "",
                password: "",
                rePassword: "",
                identify: ""
            },
            identifyCodes: "1234567890",
            identifyCode: "",
            rules: {
                userName: [{ validator: checkUserName, trigger: "blur" }],
                password: [
                    minRule,
                    maxRule,
                    { validator: checkPassword, trigger: "blur" }
                ],
                rePassword: [
                    minRule,
                    maxRule,
                    { validator: checkRePassword, trigger: "blur" }
                ],
                identify: [{ validator: checkIdentify, trigger: "blur" }]
            }
        };
    },
    methods: {
        handleforgetPassword() {
            this.$refs.forgetPasswordForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                     let sendForm={
                         userName: this.form.userName,
                         password: md5(this.form.password)
                    };
                    axios
                        .post("http://localhost:3000/forgetpassword", sendForm)
                        .then(res => {
                            this.loading = false;
                            this.refreshIdentify();
                            if (res.data === "success") {
                                this.$Message.success("修改成功,请登录");
                                this.$router.push("/login");
                            } else if (res.data === "none") {
                                this.$Message.error("用户名不存在!");
                            } else {
                                this.$Message.error("修改失败!");
                            }
                        })
                        .catch(error => {
                            this.loading = false;
                            console.log(error);
                        });
                }
            });
        },
        handleBackLogin() {
            this.$router.push("/login");
        },
        refreshIdentify() {
            this.form.identify = "";
            this.identifyCode = util.makeCode(this.identifyCodes, 4);
        }
    },
    mounted() {
        this.identifyCode = util.makeCode(this.identifyCodes, 4);
    }
};
</script>

<style lang="less" scoped>
.forgetPassword {
    height: 100%;
    width: 100%;
    position: absolute;
    background-image: url("../assets/images/login-bg.jpg");
    background-size: cover;
    background-position: center;
    &-card {
        position: absolute;
        right: 160px;
        top: 30%;
        width: 360px;
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
            .identify {
                .identifyInput {
                    vertical-align: top;
                    display: inline-block;
                    width: 200px;
                }
                .identifyArea {
                    display: inline-block;
                    height: 36px;
                    padding-left: 10px;
                }
            }
        }
    }
}
</style>
