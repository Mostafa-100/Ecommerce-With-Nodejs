const request = require("supertest");
const app = require("../app");

jest.mock("../services/productService");
const productService = require("../services/productService");

describe("GET /products", () => {
  it("should return default products", async () => {
    const fakeProducts = [
      { name: "A1", price: 22.99 },
      { name: "A2", price: 19.99 },
    ];

    productService.fetchProducts.mockResolvedValue(fakeProducts);

    const response = await request(app).get("/api/v1/products");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(fakeProducts);
    expect(productService.fetchProducts).toHaveBeenCalledWith(10, 0, -1);
  });
});

describe("GET /products/:id", () => {
  it("should return product with the id", async () => {
    const fakeProduct = { name: "my prod", price: 38.99 };

    productService.fetchOneProduct.mockResolvedValue(fakeProduct);

    const response = await request(app).get("/api/v1/products/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(fakeProduct);
    expect(productService.fetchOneProduct).toHaveBeenCalledWith(1);
  });
});
