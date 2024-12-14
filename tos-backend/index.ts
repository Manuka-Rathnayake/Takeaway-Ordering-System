import express, { Request, Response } from 'express';
import http, { IncomingMessage } from "http";
import morgan from 'morgan';
import authRoute from './src/routes/auth'
import dotenv from 'dotenv';
import connectDB from './src/db/conn';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './src/middleware/auth';
import { WebSocket } from 'ws';
import { WSclient } from './src/utils/wsutil';
import { payload, wsAuth } from './src/utils/roleauth';
import { wsEventHandler, WSPayload } from './src/routes/ws';
import ingredientsRoute from './src/routes/ingredients';
import menuItemRoute from './src/routes/menuItem';
import orderRoute from './src/routes/order';
import stockUpdateRoute from './src/routes/stockUpdate';

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({ noServer: true })
const port = process.env.PORT || 6300;

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
// app.use(authMiddleware)


// WebSoket Upgrade
server.on('upgrade', (request: IncomingMessage, socket, head) => {
  const user = wsAuth(request);
  console.log("hi mf")

  if (user == undefined) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, user);
  });
});

// WebSocket connection handler
wss.on("connection", (ws: WebSocket, req: IncomingMessage, user: payload) => {
  console.log('WebSocket connected for user:', user);
  WSclient.addClient(user.id, user.section, ws);

  ws.on("message", (msg: string) => {
    const payload = JSON.parse(msg) as WSPayload
    wsEventHandler(payload)
  });

});

/* routers */
app.use('/auth', authRoute)
app.use('/ingredients', ingredientsRoute)
app.use('/menuitems', menuItemRoute)
app.use('/orders', orderRoute)
app.use('/stockupdate', stockUpdateRoute)

app.get('/ping', authMiddleware("admin"), (req: Request, res: Response) => {
  return res.status(200).json({ health: 1 })
});


server.listen(port, () => {
  console.log(`Server is running | ${port}`)
});



export { app, server };
