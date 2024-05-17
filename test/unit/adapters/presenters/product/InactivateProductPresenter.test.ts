import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { inactiveProductPathParametersSchema } from "@/adapters/controllers/product/schema/InactiveProducSchema";
import { InactivateProductPresenter } from "@/adapters/presenters/product/InactivateProductPresenter";
import { InactiveProductUseCaseResponseDTO } from "@/core/useCases/product/dto/InactiveProductUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/product/schema/InactiveProducSchema", () => ({
  inactiveProductPathParametersSchema: z.object({
    id: z.string().uuid(),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: InactivateProductPresenter;

describe("InactivateProductPresenter", () => {
  const paramsMock = inactiveProductPathParametersSchema.parse({
    id: faker.string.uuid(),
  });

  beforeEach(() => {
    req = {
      params: paramsMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new InactivateProductPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request params to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        id: paramsMock.id,
      });
    });

    it("should handle invalid params and throw error", () => {
      req.params = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const useCaseResponse: InactiveProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual({
        id: useCaseResponse.product.id.toString(),
        name: useCaseResponse.product.name,
        description: useCaseResponse.product.description,
        price: useCaseResponse.product.price,
        active: useCaseResponse.product.active,
        category: useCaseResponse.product.category.name,
        createdAt: useCaseResponse.product.createdAt.toISOString(),
        updatedAt: useCaseResponse.product.updatedAt?.toISOString(),
      });
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const useCaseResponse: InactiveProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        id: useCaseResponse.product.id.toString(),
        name: useCaseResponse.product.name,
        description: useCaseResponse.product.description,
        price: useCaseResponse.product.price,
        active: useCaseResponse.product.active,
        category: useCaseResponse.product.category.name,
        createdAt: useCaseResponse.product.createdAt.toISOString(),
        updatedAt: useCaseResponse.product.updatedAt?.toISOString(),
      });
    });
  });
});
