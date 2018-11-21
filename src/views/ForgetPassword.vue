<template>
    <div class="forgetPassword">
        <Card title="重置密码" :bordered="false" icon="ios-contact" class="forgetPassword-card">
            <div class="form-con">
                <Form ref="forgetPasswordForm" :model="form" :rules="rules" @keydown.enter.native="handleforgetPassword">
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
                    <FormItem prop="rePassword">
                        <Input type="password" v-model="form.rePassword" placeholder="请再次输入密码">
                        <span slot="prepend">
                            <Icon :size="16" type="md-lock"></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <Button @click.native.prevent="handleforgetPassword" type="primary" long class="submitBtn" :loading="loading">重置密码</Button>
                    <Button @click.native.prevent="handleBackLogin" type="info" long class="">返回登录</Button>
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
            loading: false,
            form: {
                userName: "",
                password: "",
                rePassword: ""
            },
            rules: {
                userName: [{ validator: checkUserName, trigger: "blur" }],
                password: [{ validator: checkPassword, trigger: "blur" }],
                rePassword: [{ validator: checkPassword, trigger: "blur" }]
            }
        };
    },
    methods: {
        handleforgetPassword() {
            this.$refs.forgetPasswordForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    axios
                        .post("http://localhost:3000/forgetPassword", this.form)
                        .then(res => {
                            this.loading = false;
                            if (res.data === "success") {
                                this.$Message.success("修改成功,请前往登录");
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
        }
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
