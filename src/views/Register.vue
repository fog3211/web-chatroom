<template>
    <div class="register">
        <Card title="注册页面" :bordered="false" icon="ios-contact" class="register-card">
            <div class="form-con">
                <Form ref="registerForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
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
                        <Button @click.native.prevent="handleSubmit" type="primary" long class="submitBtn">提交</Button>
                        <Button @click.native.prevent="handleBackLogin" type="info" long class="">返回登录</Button>
                    </FormItem>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>

export default {
    data() {
        return {
            form: {
                userName: "super_admin",
                password: "123456"
            }
        };
    },
    methods: {
        handleSubmit() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.$emit("on-success-valid", {
                        userName: this.form.userName,
                        password: this.form.password
                    });
                }
            });
        },
        handleBackLogin(){
            this.$router.push("/login");
        }
    }
};
</script>

<style lang="less" scoped>
.register {
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
            .submitBtn{
                margin-bottom: 10px;
            }
        }
    }
}
</style>
