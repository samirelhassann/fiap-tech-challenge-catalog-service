import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import {
  editProductPathParametersSchema,
  editProductPayloadSchema,
} from "@/adapters/controllers/product/schema/EditProductSchema";
import { EditProductPresenter } from "@/adapters/presenters/product/EditProductPresenter";
import { EditProductUseCaseResponseDTO } from "@/core/useCases/product/dto/EditProductUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/product/schema/EditProductSchema", () => ({
  editProductPathParametersSchema: z.object({
    id: z.string().uuid(),
  }),
  editProductPayloadSchema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: EditProductPresenter;

describe("EditProductPresenter", () => {
  const paramsMock = editProductPathParametersSchema.parse({
    id: faker.string.uuid(),
  });

  const bodyMock = editProductPayloadSchema.parse({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    category: faker.commerce.department(),
  });

  beforeEach(() => {
    req = {
      params: paramsMock,
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new EditProductPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request params and body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        id: paramsMock.id,
        name: bodyMock.name,
        description: bodyMock.description,
        price: bodyMock.price,
        category: bodyMock.category,
      });
    });

    it("should handle invalid params or body and throw error", () => {
      req.params = {};
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const useCaseResponse: EditProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual({
        id: useCaseResponse.product.id.toString(),
        name: useCaseResponse.product.name,
        description: useCaseResponse.product.description,
        price: useCaseResponse.product.price,
        category: useCaseResponse.product.category.name,
        createdAt: useCaseResponse.product.createdAt.toISOString(),
        updatedAt: useCaseResponse.product.updatedAt?.toISOString(),
      });
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const useCaseResponse: EditProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        id: useCaseResponse.product.id.toString(),
        name: useCaseResponse.product.name,
        description: useCaseResponse.product.description,
        price: useCaseResponse.product.price,
        category: useCaseResponse.product.category.name,
        createdAt: useCaseResponse.product.createdAt.toISOString(),
        updatedAt: useCaseResponse.product.updatedAt?.toISOString(),
      });
    });
  });
});
