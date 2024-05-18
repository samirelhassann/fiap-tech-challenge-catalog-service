import request, { Response } from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { createProductPayloadSchema } from "@/adapters/controllers/product/schema/CreateProductSchema";
import { makeProductRepository } from "@/adapters/repositories/PrismaRepositoryFactory";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { app } from "@/drivers/webserver/app";
import { faker } from "@faker-js/faker";
import { makeProduct } from "@test/unit/adapters/factories/MakeProduct";
import { getRandomEnumValue } from "@test/unit/utils/GetRandomEnumValue";
import { generateAdminToken } from "@test/utils/GenerateAdminToken";

type CreateProductPayload = z.infer<typeof createProductPayloadSchema>;

let adminToken: string;

describe("Feature: Retrieve a list of users", () => {
  let response: Response;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // Scenario: Retrieve a paginated list of products
  // When I request a paginated list of products
  // Then I should receive a paginated list of products
  describe("Scenario: Retrieve a paginated list of products", () => {
    beforeAll(async () => {
      const productRepository = makeProductRepository();

      await Promise.all(
        Array.from({ length: 10 }, async () => {
          await productRepository.create(makeProduct({}));
        })
      );
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("When I request a paginated list of products", async () => {
      response = await request(app.server)
        .get("/catalog-service/products")
        .query({ page: 1, pageSize: 10 });
    });

    it("Then I should receive a paginated list of products", () => {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.totalItems).toBe(10);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.pageSize).toBe(10);
      expect(response.body.pagination.totalPages).toBe(1);
    });
  });

  // Scenario: Retrieve a specific product by id
  // When I request a specific product by id
  // Then I should receive a specific product
  describe("Scenario: Retrieve a specific product by id", () => {
    let productId: string;

    beforeAll(async () => {
      const productRepository = makeProductRepository();

      const product = makeProduct({});
      const createdProduct = await productRepository.create(product);

      productId = createdProduct.id.toString();
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("When I request a specific product by id", async () => {
      response = await request(app.server).get(
        `/catalog-service/products/${productId}`
      );
    });

    it("Then I should receive a specific product", () => {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({});
    });
  });

  // Scenario: Retrieve a specific product by id that does not exist
  // When I request a specific product by id that does not exist
  // Then I should receive a not found response
  describe("Scenario: Retrieve a specific product by id that does not exist", () => {
    let productId: string;

    beforeAll(() => {
      productId = faker.string.uuid();
    });

    it("When I request a specific product by id that does not exist", async () => {
      response = await request(app.server).get(
        `/catalog-service/products/${productId}`
      );
    });

    it("Then I should receive a not found response", () => {
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: "product not found.",
      });
    });
  });

  // Scenario: Create a product
  // Given that i am a ADMIN authenticated user
  // When I request to create a product
  // Then I should receive a successful response
  describe("Scenario: Create a product", () => {
    let productPayload: CreateProductPayload;

    beforeAll(() => {
      productPayload = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        category: getRandomEnumValue(CategoriesEnum),
      };
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("Given that i am a ADMIN authenticated user", async () => {
      adminToken = generateAdminToken();
    });

    it("When I request to create a product", async () => {
      response = await request(app.server)
        .post("/catalog-service/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload);
    });

    it("Then I should receive a successful response", () => {
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({});
    });
  });

  // Scenario: Create a product with existing name
  // Given that i am a ADMIN authenticated user
  // When I request to create a product with an existing name
  // Then I should receive a conflict response
  describe("Scenario: Create a product with existing name", () => {
    let productPayload: CreateProductPayload;

    beforeAll(async () => {
      const productRepository = makeProductRepository();

      const product = makeProduct({});
      await productRepository.create(product);

      productPayload = {
        name: product.name,
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        category: getRandomEnumValue(CategoriesEnum),
      };
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("Given that i am a ADMIN authenticated user", async () => {
      adminToken = generateAdminToken();
    });

    it("When I request to create a product with an existing name", async () => {
      response = await request(app.server)
        .post("/catalog-service/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload);
    });

    it("Then I should receive a conflict response", () => {
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: "please inform another name.",
      });
    });
  });

  // Scenario: Edit a product
  // Given that i am a ADMIN authenticated user
  // When I request to edit a product
  // Then I should receive a successful response
  describe("Scenario: Edit a product", () => {
    let productId: string;
    let productPayload: CreateProductPayload;

    beforeAll(async () => {
      const productRepository = makeProductRepository();

      const product = makeProduct({});
      const createdProduct = await productRepository.create(product);

      productId = createdProduct.id.toString();

      productPayload = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        category: getRandomEnumValue(CategoriesEnum),
      };
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("Given that i am a ADMIN authenticated user", async () => {
      adminToken = generateAdminToken();
    });

    it("When I request to edit a product", async () => {
      response = await request(app.server)
        .put(`/catalog-service/products/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload);
    });

    it("Then I should receive a successful response", () => {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({});
    });
  });

  // Scenario: Delete a Product
  // Given that i am a ADMIN authenticated user
  // When I request to delete a product
  // Then I should receive a successful response
  describe("Scenario: Delete a Product", () => {
    let productId: string;

    beforeAll(async () => {
      const productRepository = makeProductRepository();

      const product = makeProduct({});
      const createdProduct = await productRepository.create(product);

      productId = createdProduct.id.toString();
    });

    afterAll(async () => {
      await prisma.product.deleteMany();
    });

    it("Given that i am a ADMIN authenticated user", async () => {
      adminToken = generateAdminToken();
    });

    it("When I request to delete a product", async () => {
      response = await request(app.server)
        .delete(`/catalog-service/products/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    });

    it("Then I should receive a successful response", () => {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({});
    });
  });
});
