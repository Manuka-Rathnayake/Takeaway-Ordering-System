import { WebSocket } from "ws";

interface wsusers {
  userId: string;
  section: string;
  wsConn: WebSocket;
}


export class WSclientQueue {
  private users: wsusers[];

  constructor() {
    this.users = [];
  }

  broadcast(sections: string[], eventType: string, data: any) {
    const message = JSON.stringify({ type: eventType, data });

    this.users
      .filter(user => sections.includes(user.section))
      .forEach(user => {
        try {
          user.wsConn.send(message);
        } catch (error) {
          console.error(`Failed to send to ${user.userId}`, error);
          this.removeClient(user.userId);
        }
      });
  }

  sectionBySend(section: string[], data: any) {
    try {
      const clientws = this.users.filter(item => section.includes(item.section))
      clientws.forEach((wsusers) => {
        wsusers.wsConn.send(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  addClient(userId: string, section: string, ws: WebSocket) {
    const client = { userId, section, wsConn: ws };
    this.users.push(client);
    console.log(this.users)
    this.broadcast(["kitchen", "admin"], "notification", `${userId} is connected [Admin]`)
    ws.on('close', () => {
      console.log(`${userId} disconnected`)
      this.removeClient(userId)
    });
    ws.on('error', () => this.removeClient(userId));
  }

  removeClient(userId: string) {
    this.users = this.users.filter(user => user.userId !== userId);
  }

  getClientsInSection(section: string): wsusers[] {
    return this.users.filter(user => user.section === section);
  }

}

export const WSclient = new WSclientQueue();
