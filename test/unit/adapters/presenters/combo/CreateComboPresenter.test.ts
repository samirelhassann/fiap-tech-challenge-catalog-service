import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { createComboPayloadSchema } from "@/adapters/controllers/combo/schemas/CreateComboSchema";
import { CreateComboPresenter } from "@/adapters/presenters/combo/CreateComboPresenter";
import { CreateComboUseCaseResponseDTO } from "@/core/useCases/combo/dto/CreateComboUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeCombo } from "../../factories/MakeCombo";
import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/combo/schemas/CreateComboSchema", () => ({
  createComboPayloadSchema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    productIds: z.array(z.string().uuid()),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: CreateComboPresenter;

describe("CreateComboPresenter", () => {
  const bodyMock = createComboPayloadSchema.parse({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    productIds: [faker.string.uuid(), faker.string.uuid()],
  });

  beforeEach(() => {
    req = {
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new CreateComboPresenter();
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

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const useCaseResponse: CreateComboUseCaseResponseDTO = {
        combo: makeCombo(),
        productDetails: [makeProduct()],
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual({
        id: useCaseResponse.combo.id.toString(),
        name: useCaseResponse.combo.name,
        description: useCaseResponse.combo.description,
        price: useCaseResponse.combo.price,
        createdAt: useCaseResponse.combo.createdAt.toISOString(),
        updatedAt: useCaseResponse.combo.updatedAt?.toISOString(),
        products: useCaseResponse.productDetails.map((product) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category.name,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt?.toISOString(),
        })),
      });
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const useCaseResponse: CreateComboUseCaseResponseDTO = {
        combo: makeCombo(),
        productDetails: [makeProduct()],
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        id: useCaseResponse.combo.id.toString(),
        name: useCaseResponse.combo.name,
        description: useCaseResponse.combo.description,
        price: useCaseResponse.combo.price,
        createdAt: useCaseResponse.combo.createdAt.toISOString(),
        updatedAt: useCaseResponse.combo.updatedAt?.toISOString(),
        products: useCaseResponse.productDetails.map((product) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category.name,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt?.toISOString(),
        })),
      });
    });
  });
});
