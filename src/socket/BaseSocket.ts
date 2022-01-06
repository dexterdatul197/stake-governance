// @ts-ignore
import io from "socket.io-client";
import eventBus from "src/event/event-bus";
import { SocketEvent } from "src/socket/SocketEvent";
import store from "src/store/store";
export class BaseSocket {
  private static instance: BaseSocket;
  // @ts-ignore
  private socket;

  public static getInstance(): BaseSocket {
    if (!BaseSocket.instance) {
      BaseSocket.instance = new BaseSocket();
    }

    return BaseSocket.instance;
  }

  public connect(): void {
    // const accessToken = getCookieStorage('access_token');
    this.socket = io(`${process.env.REACT_APP_BASE_SOCKET}`, {
      transports: ["websocket"],
      // query: {
      //   // authorization: accessToken,
      // },
    });
    this.listenTransactionEvent();
    console.log("abcdcddd");
    this.socket.on("connect", (data: any) => {
      console.log("connect", data);
    });
    this.socket.on("disconnect", (data: any) => {
      console.log("disconnect", data);
    });

    this.socket.on("error", (data: any) => {
      console.log("error", data);
    });

    this.socket.on("reconnect", (data: any) => {
      console.log("reconnect", data);
    });
  }

  listenTransactionEvent(): void {
    this.socket.on("transactions", (data: any) => {
      eventBus.dispatch(SocketEvent.transactionUpdated, data);
    });
  }

  public reconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect();
  }

  disconnectSocket(): void {
    this.socket.disconnect();
  }
}
