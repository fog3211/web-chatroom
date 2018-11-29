<template>
  <div>
    <Input type="text" v-model="say" placeholder="说点什么吧" >
    </Input>
    <Button type="primary"  @click="handleSubmit" >发送</Button>
    <ul>
      <li v-for="item in items">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: null,
      websocket: null,
      say: "",
      items: ["hello aaa", "hello bbb", "hello ccc"]
    };
  },
  methods: {
    handleSubmit() {
      if (!this.say) {
        this.$Message.error("消息不能为空!");
        return;
      }
      var msg = {
        name: this.userName,
        data: this.say
      };
      this.websocket.send(JSON.stringify(msg));
      this.say = "";
    },
    showMessage(str, type) {
      if (type !== "me") {
        this.items.push(str);
      } else {
        this.items.push("str");
      }
    },
    websocketInit() {
      this.websocket.onopen = () => {
        // console.log("websocket open");
        var str = {
          name: this.userName,
          data: "this is  a data"
        };
        this.websocket.send(JSON.stringify(str));
      };
      this.websocket.onclose = function() {
        // console.log("websocket close");
      };
      this.websocket.onmessage = e => {
        var mes = JSON.parse(e.data);
        console.log(mes.name);
        this.showMessage(mes.data, mes.type);
      };
    }
  },
  mounted() {
    this.websocketInit();
    this.userName = sessionStorage.getItem("user");
    
  },
  created(){
    this.websocket=new WebSocket("ws://localhost:3001/");
  }
};
</script>

<style scoped>
</style>