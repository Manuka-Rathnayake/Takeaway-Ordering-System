import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '../../index';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a mock Ingredient
  await mongoose.connection.collection('ingredients').insertOne({
    _id: new mongoose.Types.ObjectId('64b2e27e1b5dff0dc8948c1e'),
    name: 'Test Ingredient',
    unitSymbol: 'kilogram',
    stockLevel: { unit: 500, unitSymbol: 'kilogram' },
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Stock Update Integration Tests', () => {
  const mockToken = 'Bearer mock-jwt-token'; // Mock token
  let createdStockUpdateId: string;
  const ingredientId = '64b2e27e1b5dff0dc8948c1e'; // Use a valid hardcoded ObjectId

  it('should fetch all stock updates', async () => {
    const response = await request(app)
      .get('/stockupdate/all')
      .set('Authorization', mockToken);

    console.log('Fetch All Stock Updates Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true); // Ensure data is an array
  });

  it('should add a new stock update', async () => {
    const newStockUpdate = {
      ingredientId,
      quantity: 100,
      updateType: 'addition',
      productBrand: 'BrandX',
      stockedUnit: { unit: 100, unitSymbol: 'kilogram' },
    };

    const response = await request(app)
      .post('/stockupdate/add')
      .set('Authorization', mockToken)
      .send(newStockUpdate);

    console.log('Add Stock Update Response:', response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('stockUpdate');
    createdStockUpdateId = response.body.stockUpdate._id;
    expect(createdStockUpdateId).toBeDefined();
  });

  it('should fetch stock updates by ingredient', async () => {
    const response = await request(app)
      .get(`/stockupdate/ingredient/${ingredientId}`)
      .set('Authorization', mockToken);

    console.log('Fetch Stock Updates by Ingredient Response:', response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Response is an array, not an object
    expect(response.body.length).toBeGreaterThan(0); // Ensure updates exist for the ingredient
  });

  it('should update a stock update', async () => {
    const updatedStockUpdate = {
      quantity: 150,
      updateType: 'adjustment',
      productBrand: 'BrandX Updated',
      stockedUnit: { unit: 150, unitSymbol: 'kilogram' },
    };

    const response = await request(app)
      .put(`/stockupdate/${createdStockUpdateId}`)
      .set('Authorization', mockToken)
      .send(updatedStockUpdate);

    console.log('Update Stock Update Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', createdStockUpdateId); // Validate ID matches
    expect(response.body.stockedUnit.unit.$numberDecimal).toBe('150'); // Check updated quantity
    expect(response.body.productBrand).toBe('BrandX Updated'); // Check updated brand
  });

  it('should delete a stock update', async () => {
    const response = await request(app)
      .delete(`/stockupdate/${createdStockUpdateId}`)
      .set('Authorization', mockToken);

    console.log('Delete Stock Update Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Stock update deleted successfully');
  });
});
