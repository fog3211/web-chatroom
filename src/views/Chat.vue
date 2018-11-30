<template>
  <div class="container">
    <div class="chat">
 <Input type="text" v-model="say" placeholder="说点什么吧" @keydown.enter.native="handleSubmit">
    </Input>
    <Button type="primary"  @click="handleSubmit" >发送</Button>
    <ul>
      <li v-for="item in items">
        {{item}}
      </li>
    </ul>
    </div>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: null,
      websocket: null,
      say: "",
      items: [],
    };
  },
  methods: {
    handleSubmit() {
      if (!this.say) {
        this.$Message.error("消息不能为空!");
        return false;
      }
      if(this.websocket.readyState!==1){
       this.websocket=new WebSocket("ws://localhost:3001/");
      }
      var msg = {
        name: this.userName,
        data: this.say
      };
      this.websocket.send(JSON.stringify(msg));
      this.say = "";
    },
    showMessage(str, type) {
      // console.log(type);
      if (type !== "broadcast") {
        this.items.push(str);
      } else {
        this.items.push("broadcast"+str);
      }
    },
    websocketInit() {
      this.websocket.onopen = () => {
        // console.log("websocket open");
        var str = {
          name: this.userName,
          data: ''
        };
        this.websocket.send(JSON.stringify(str));
      };
      this.websocket.onclose = function() {
        // console.log("websocket close");
      };
      this.websocket.onmessage = e => {
        var mes = JSON.parse(e.data);
         console.log(mes);
        if(mes.name){
            this.showMessage(mes.data, mes.type,mes.name);
        }else{
            this.showMessage(mes.data, mes.type);
        }
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
.container{
    height: 100%;
    width: 100%;
    position: absolute;
    background-color:#9BE4D8;
}
.chat{
  width: 500px;
  height: 500px;  
 background-color:#E8F9F6;
 /* background: linear-gradient(rgba(194, 245, 237, 0.233) 0, transparent); */
 background: linear-gradient( rgba(200, 255, 0, 0), rgb(255, 0, 212)); /* 标准的语法 */
}
</style>