import { WebSocketServer, WebSocket } from "ws"; // TypeError: ws.Server is not a constructor

let wss: WebSocketServer | null;
const clients = new Set<WebSocket>();

export const initWss = (server: any) => {
	wss = new WebSocketServer({ server, path: "/ws" });

	wss.on("connection", (ws: WebSocket) => {
		clients.add(ws);
		ws.on("close", () => {
			clients.delete(ws);
		});
	});
};

export const broadcast = (data: any) => {
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};