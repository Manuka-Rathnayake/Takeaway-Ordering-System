import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '../../index';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create mock ingredients
  await mongoose.connection.collection('ingredients').insertMany([
    { _id: new mongoose.Types.ObjectId('64b2e27e1b5dff0dc8948c1e'), name: 'Cheese', stockLevel: { unit: 100, unitSymbol: 'grams' } },
    { _id: new mongoose.Types.ObjectId('64b2e27e1b5dff0dc8948c1f'), name: 'Tomato', stockLevel: { unit: 50, unitSymbol: 'grams' } },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Menu Item Integration Tests', () => {
  const mockToken = 'Bearer mock-jwt-token'; // Mock token
  let createdMenuItemId: string;

  it('should fetch all menu items', async () => {
    const response = await request(app)
      .get('/menuitems/all')
      .set('Authorization', mockToken);

    console.log('Fetch All Menu Items Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should add a new menu item', async () => {
    const newMenuItem = {
      name: 'Pizza',
      price: 12.99,
      des: 'Delicious cheese pizza',
      ingredients: JSON.stringify([
        { id: '64b2e27e1b5dff0dc8948c1e', stockLevel: { unit: 100, unitSymbol: 'grams' } },
        { id: '64b2e27e1b5dff0dc8948c1f', stockLevel: { unit: 50, unitSymbol: 'grams' } },
      ]),
    };

    const response = await request(app)
      .post('/menuitems/add')
      .set('Authorization', mockToken)
      .send(newMenuItem);

    console.log('Add Menu Item Response:', response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    createdMenuItemId = response.body.data._id;
    expect(createdMenuItemId).toBeDefined();
  });

  it('should fetch a menu item by ID', async () => {
    const response = await request(app)
      .get(`/menuitems/${createdMenuItemId}`)
      .set('Authorization', mockToken);

    console.log('Fetch Menu Item by ID Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toBe('Pizza');
  });

  it('should update a menu item', async () => {
    const updatedMenuItem = {
      name: 'Updated Pizza',
      price: 15.99,
    };

    const response = await request(app)
      .put(`/menuitems/${createdMenuItemId}`)
      .set('Authorization', mockToken)
      .send(updatedMenuItem);

    console.log('Update Menu Item Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toBe('Updated Pizza');
    expect(response.body.data.price.$numberDecimal).toBe('15.99');
  });

  it('should delete a menu item', async () => {
    const response = await request(app)
      .delete(`/menuitems/${createdMenuItemId}`)
      .set('Authorization', mockToken);

    console.log('Delete Menu Item Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'Menu Item deleted successfully');
  });
});
