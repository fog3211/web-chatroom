<template>
  <div class="container">
    <div class="chat">
      <Input
        type="text"
        v-model="say"
        placeholder="说点什么吧"
        @keydown.enter.native="handleSubmit"
      >
      </Input>
      <Button
        type="primary"
        @click="handleSubmit"
      >发送</Button>
      <ul>
        <li
          v-for="item in items"
          class="news-container"
          :class="item.newsContainerClass"
        >
          <div
            class="news"
            :class="item.newsClass"
          >
            {{item.data}}
          </div>
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
      items: []
    };
  },
  methods: {
    handleSubmit() {
      if (!this.say) {
        this.$Message.error("消息不能为空!");
        return false;
      }
      if (this.websocket.readyState !== 1) {
        // this.websocket = new WebSocket("ws://localhost:3001/");
        console.log("当前转态无法通讯");
      }
      var msg = {
        name: this.userName,
        data: this.say
      };
      this.websocket.send(JSON.stringify(msg));
      this.say = "";
    },
    showMessage(str, type, name) {
      // console.log(type);
      if (type === "broadcast") {
        let obj = {
          newsClass: "news-system",
          newsContainerClass: "news-container-system",
          data: str
        };
        this.items.push(obj);
      } else if (name === this.userName) {
        let obj = {
          newsClass: "news-mine",
          newsContainerClass: "news-container-mine",
          data: str
        };
        this.items.push(obj);
      } else {
        let obj = {
          newsClass: "news-other",
          newsContainerClass: "news-container-other",
          data: str
        };
        this.items.push(obj);
      }
    },
    websocketInit() {
      this.websocket.onopen = () => {
        // console.log("websocket open");
        var str = {
          name: this.userName,
          data: ""
        };
        this.websocket.send(JSON.stringify(str));
      };
      this.websocket.onclose = function() {
        // console.log("websocket close");
      };
      this.websocket.onmessage = e => {
        var mes = JSON.parse(e.data);
        // console.log(mes);
        if (mes) {
          this.showMessage(mes.data, mes.type, mes.name);
        }
      };
    }
  },
  mounted() {
    this.websocketInit();
    this.userName = sessionStorage.getItem("user");
  },
  created() {
    this.websocket = new WebSocket("ws://localhost:3001/");
  }
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: #9be4d8;
}
.chat {
  width: 500px;
  height: 800px;
  background: #d4f3ed;
  .news-container {
    display: flex;
    padding: 10px 20px;
    font-size: 16px;
    .news {
      padding: 10px;
      display: inline-block;
      // overflow: hidden;
      &-other {
        border-radius: 0 15px 15px 15px;
        background-color: #ffffff;
      }
      &-mine {
        border-radius: 20px 15px 0 15px;
        background-color: #44d7cd;
      }
      &-system {
        padding: 5px;
        border-radius: 5px;
        background-color:rgb(228, 221, 221);
        font-size: 12px;
        color: dimgray;
      }
    }
  }
  .news-container-system {
    justify-content: center;
    text-align: center;
  }
  .news-container-mine {
    justify-content: flex-end;
  }
  .news-container-other {
    justify-content: flex-start;
  }
}
</style>