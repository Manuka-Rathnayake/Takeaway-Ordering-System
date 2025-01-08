import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '../../index';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create mock menu items
  await mongoose.connection.collection('menuitems').insertMany([
    { _id: new mongoose.Types.ObjectId('64b2e27e1b5dff0dc8948c1e'), name: 'Burger', price: 5.99 },
    { _id: new mongoose.Types.ObjectId('64b2e27e1b5dff0dc8948c1f'), name: 'Fries', price: 2.99 },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Order Integration Tests', () => {
  const mockToken = 'Bearer mock-jwt-token'; // Mock token
  let createdOrderId: string;

  it('should fetch all orders', async () => {
    const response = await request(app)
      .get('/orders/all')
      .set('Authorization', mockToken);

    console.log('Fetch All Orders Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // it('should add a new order', async () => {
  //   const newOrder = {
  //     customerNumber: '12345',
  //     customerName: 'John Doe',
  //     menuItem: [
  //       { id: '64b2e27e1b5dff0dc8948c1e', quantity: 2 },
  //       { id: '64b2e27e1b5dff0dc8948c1f', quantity: 1 },
  //     ],
  //     status: 'pending',
  //     discount: 0,
  //     isPaid: true,
  //     paymentMethod: 'cash',
  //   };

  //   const response = await request(app)
  //     .post('/orders/add')
  //     .set('Authorization', mockToken)
  //     .send(newOrder);

  //   console.log('Add Order Response:', response.body);
  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty('data');
  //   createdOrderId = response.body.data._id;
  //   expect(createdOrderId).toBeDefined();
  // });

  // it('should fetch an order by ID', async () => {
  //   const response = await request(app)
  //     .get(`/orders/${createdOrderId}`)
  //     .set('Authorization', mockToken);

  //   console.log('Fetch Order by ID Response:', response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('data');
  //   expect(response.body.data.customerName).toBe('John Doe');
  // });

  // it('should update an order', async () => {
  //   const updatedOrder = {
  //     customerName: 'Jane Doe',
  //     status: 'processing',
  //     discount: 5,
  //   };

  //   const response = await request(app)
  //     .put(`/orders/${createdOrderId}`)
  //     .set('Authorization', mockToken)
  //     .send(updatedOrder);

  //   console.log('Update Order Response:', response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('data');
  //   expect(response.body.data.customerName).toBe('Jane Doe');
  //   expect(response.body.data.status).toBe('processing');
  //   expect(response.body.data.discount).toBe(5);
  // });

  // it('should delete an order', async () => {
  //   const response = await request(app)
  //     .delete(`/orders/${createdOrderId}`)
  //     .set('Authorization', mockToken);

  //   console.log('Delete Order Response:', response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('msg', 'Order deleted successfully');
  // });
});
