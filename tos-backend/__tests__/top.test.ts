import request from 'supertest'
import { app, server } from '../index'
import mongoose from 'mongoose';


const dbclose = async () => { await mongoose.disconnect() }

afterAll((done) => {

  server.close(done);
  dbclose();
});

describe("GET /", () => {
  it("should return a text", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "local" });
  });
})
