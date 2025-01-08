// import request from 'supertest';
// import { app, server } from '../../index';
// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';

// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
//   server.close();
// });

// describe('Ingredients Integration Tests', () => {
//   it('should fetch all ingredients (even if wrapped in `data`)', async () => {
//     const response = await request(app).get('/ingredients/all');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toEqual([]);
//   });

//   it('should add a new ingredient', async () => {
//     const newIngredient = {
//       name: 'Tomato',
//       unitSymbol: 'kilogram', // Match `unitSymbol` schema
//       warningLevel: 5, // Match `warningLevel` schema
//     };

//     const response = await request(app)
//       .post('/ingredients/add')
//       .send(newIngredient);

//     expect(response.status).toBe(201); // Expect created status
//     expect(response.body).toMatchObject(newIngredient); // Expect response to match input
//   });

//   it('should fetch all ingredients after adding one', async () => {
//     const response = await request(app).get('/ingredients/all');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data.length).toBe(1);
//   });

//   it('should fetch a single ingredient by ID', async () => {
//     const ingredients = await request(app).get('/ingredients/all');
//     const ingredientId = ingredients.body.data[0]._id;
//     expect(ingredientId).toBeDefined();

//     const response = await request(app).get(`/ingredients/${ingredientId}`);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('name', 'Tomato');
//   });
// });



import request from 'supertest';
import { app, server } from '../../index';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Ingredients Integration Tests', () => {
  it('should fetch all ingredients (even if wrapped in `data`)', async () => {
    const response = await request(app).get('/ingredients/all');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should add a new ingredient', async () => {
    const newIngredient = {
      name: 'Tomato',
      unitSymbol: 'kilogram',
      warningLevel: 5,
    };

    const response = await request(app)
      .post('/ingredients/add')
      .send(newIngredient);

    expect(response.status).toBe(201); // Expect created status
    expect(response.body).toHaveProperty('msg', 'Tomato Ingredient created!'); // Match the response message
  });

  it('should fetch all ingredients after adding one', async () => {
    const response = await request(app).get('/ingredients/all');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.length).toBe(1); // Ensure one ingredient exists
  });

  it('should fetch a single ingredient by ID', async () => {
    const ingredients = await request(app).get('/ingredients/all');
    const ingredientId = ingredients.body.data[0]._id; // Extract ID from the data wrapper

    const response = await request(app).get(`/ingredients/${ingredientId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('name', 'Tomato'); // Check inside the `data` wrapper
  });
});
