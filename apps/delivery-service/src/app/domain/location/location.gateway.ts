// import {
//     WebSocketGateway,
//     SubscribeMessage,
//     MessageBody,
//     WebSocketServer,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     ConnectedSocket,
//   } from '@nestjs/websockets';
//   import { Server, Socket } from 'socket.io';
//   import { Logger, ValidationPipe } from '@nestjs/common';
// import { LocationUpdateDto } from './dto/location-update.dto';

//   @WebSocketGateway({
//     cors: {
//       origin: '*', // In production, specify your allowed origins
//     },
//   })
//   export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
//     private readonly logger = new Logger(LocationGateway.name);

//     @WebSocketServer()
//     server: Server;

//     // Keep track of connected clients
//     private connectedClients: Map<string, Socket> = new Map();
//     // Keep track of clients in each order room
//     private orderRooms: Map<string, Set<string>> = new Map();

//     handleConnection(client: Socket) {
//       const deliveryId = client.handshake.headers.deliveryid as string;
//       if (!deliveryId) {
//         this.logger.warn('Client connected without deliveryId, disconnecting');
//         client.disconnect();
//         return;
//       }

//       this.logger.log(`Client connected: ${deliveryId}`);
//       this.connectedClients.set(deliveryId, client);
//     }

//     handleDisconnect(client: Socket) {
//       const deliveryId = client.handshake.headers.deliveryid as string;
//       if (deliveryId) {
//         this.logger.log(`Client disconnected: ${deliveryId}`);
//         this.connectedClients.delete(deliveryId);

//         // Remove delivery from all order rooms
//         for (const [roomId, deliverys] of this.orderRooms.entries()) {
//           if (deliverys.has(deliveryId)) {
//             deliverys.delete(deliveryId);
//             // Clean up empty rooms
//             if (deliverys.size === 0) {
//               this.orderRooms.delete(roomId);
//             }
//           }
//         }
//       }
//     }

//     @SubscribeMessage('join_order_room')
//     handleJoinRoom(
//       @ConnectedSocket() client: Socket,
//       @MessageBody() data: { orderId: string; deliveryId: string; orderType: string }
//     ) {
//       const { orderId, deliveryId, orderType } = data;
//       const roomId = `order:${orderId}`;

//       this.logger.log(`delivery ${deliveryId} joining room ${roomId} as ${orderType}`);

//       // Join Socket.IO room
//       client.join(roomId);

//       // Keep track of deliverys in this room
//       if (!this.orderRooms.has(roomId)) {
//         this.orderRooms.set(roomId, new Set());
//       }
//       this.orderRooms.get(roomId).add(deliveryId);

//       // Broadcast to room that delivery has joined
//       this.server.to(roomId).emit('delivery_joined_order', {
//         deliveryId,
//         orderType,
//         timestamp: new Date().toISOString(),
//       });

//       return { success: true, roomId };
//     }

//     @SubscribeMessage('location_update')
//     handleLocationUpdate(
//       @ConnectedSocket() client: Socket,
//       @MessageBody(new ValidationPipe()) locationUpdate: LocationUpdateDto
//     ) {
//       const { orderId, deliveryId, orderType } = locationUpdate;
//       const roomId = `order:${orderId}`;

//       this.logger.debug(`Location update from ${deliveryId} for order ${orderId}`);

//       // Store the latest location (you could add a database here)
//       // For example, using Redis or a simple in-memory store

//       // Broadcast location update to everyone in the order room
//       this.server.to(roomId).emit('location_updated', locationUpdate);

//       return { success: true };
//     }
//   }
