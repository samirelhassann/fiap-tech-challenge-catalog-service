import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { createProductPayloadSchema } from "@/adapters/controllers/product/schema/CreateProductSchema";
import { CreateProductPresenter } from "@/adapters/presenters/product/CreateProductPresenter";
import { CreateProductUseCaseResponseDTO } from "@/core/useCases/product/dto/CreateProductUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/product/schema/CreateProductSchema", () => ({
  createProductPayloadSchema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: CreateProductPresenter;

describe("CreateProductPresenter", () => {
  const bodyMock = createProductPayloadSchema.parse({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    category: faker.commerce.department(),
  });

  beforeEach(() => {
    req = {
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new CreateProductPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual(bodyMock);
    });

    it("should handle invalid body and throw error", () => {
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 201", async () => {
      const useCaseResponse: CreateProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
