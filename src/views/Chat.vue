<template>
  <div class="container">
    <div class="chat">
      <ul
        class="showMessage"
        id="showMessage"
      >
        <li
          v-for="item in items"
          class="news-container"
          :class="item.newsContainerClass"
        >
          <span
            class="nickName before"
            v-show="item.nickName!==userName"
          >
            {{item.nickName}}
          </span>
          <div
            class="news"
            :class="item.newsClass"
          >
            {{item.data}}
          </div>
          <span
            class="nickName after"
            v-show="item.nickName===userName"
          >
            {{item.nickName}}
          </span>
        </li>
      </ul>
      <div class="sendMessage">
        <Input
          type="textarea"
          v-model="say"
          placeholder="说点什么吧"
          class="sendMessage-input"
          :autosize="{minRows:1,maxRows:6}"
        >
        </Input>
        <Button
          type="primary"
          @click="handleSubmit"
          class="sendMessage-btn"
        >发送</Button>
      </div>
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
        this.$Message.error("连接已断开,请刷新重试!");
        // console.log("当前转态无法通讯");
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
          nickName: name,
          data: str
        };
        this.items.push(obj);
      } else {
        let obj = {
          newsClass: "news-other",
          newsContainerClass: "news-container-other",
          nickName: name,
          data: str
        };
        this.items.push(obj);
      }
      $("#showMessage").scrollTop($("#showMessage")[0].scrollHeight + 500);
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
  min-width: 375px;
  position: absolute;
  background-color: #9be4d8;
}
.chat {
  width: 375px;
  height: 780px;
  background-color: coral;
  border-radius: 15px;
  margin: 60px auto 0;
  background: #d4f3ed;
  .news-container {
    position: relative;
    display: flex;
    padding: 15px 0;
    font-size: 16px;
    .news {
      margin: 0 40px;
      padding: 10px;
      position: relative;
      display: inline-block;
      max-width: 70%;
      min-width: 15%;
      text-align: center;
      word-wrap: break-word;
      &-other {
        border-radius: 0 20px 20px 20px;
        background-color: #ffffff;
      }
      &-mine {
        border-radius: 20px 20px 0 20px;
        background-color: #44d7cd;
        color: #ffffff;
      }
      &-system {
        padding: 5px;
        border-radius: 5px;
        background-color: rgb(236, 235, 235);
        font-size: 12px;
        color: dimgray;
      }
    }

    .nickName {
      font-size: 12px;
      color: #9e9797;
      padding: 0 10px;
      position: absolute;
      border:1px solid rgb(224, 224, 224);
    }

    .before {
      color: #f0b535;
      top: -5px;
    }
    .after {
     color: #361bd1;
      bottom: -5px;
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

  .showMessage {
    overflow: auto;
    height: 750px;
    padding-top: 20px;
    /*滚动条样式*/
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      background: #d4f3ed;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      background: rgba(104, 96, 96, 0.2);
    }
  }

  .sendMessage {
    border-top: 1px solid #9e9797;
    display: flex;
    &-input {
      flex: 1;
    }
    &-btn {
      flex: 0 0 50px;
    }
  }
}
</style>