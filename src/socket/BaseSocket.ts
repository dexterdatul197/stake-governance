// @ts-ignore
import io from 'socket.io-client';
import eventBus from 'src/event/event-bus';
import { SocketEvent } from 'src/socket/SocketEvent';
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
      transports: ['websocket']
      // query: {
      //   // authorization: accessToken,
      // },
    });
    this.listenTransactionEvent();
    this.listenTVLDataEvent();
  }

  listenTransactionEvent(): void {
    this.socket.on('staking_history', (data: any) => {
      eventBus.dispatch(SocketEvent.transactionUpdated, data);
    });
  }

  listenTVLDataEvent(): void {
    this.socket.on('tvl_data', (data: any) => {
      eventBus.dispatch(SocketEvent.tvlDataUpdate, data);
    })
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
