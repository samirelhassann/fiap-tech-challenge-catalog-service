import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { getComboByIdPathParamsSchema } from "@/adapters/controllers/combo/schemas/GetComboByIdSchema";
import { GetComboByIdPresenter } from "@/adapters/presenters/combo/GetComboByIdPresenter";
import { GetComboByIdUseCaseResponseDTO } from "@/core/useCases/combo/dto/GetComboByIdUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeCombo } from "../../factories/MakeCombo";
import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/combo/schemas/GetComboByIdSchema", () => ({
  getComboByIdPathParamsSchema: z.object({
    id: z.string().uuid(),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: GetComboByIdPresenter;

describe("GetComboByIdPresenter", () => {
  const paramsMock = getComboByIdPathParamsSchema.parse({
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

    presenter = new GetComboByIdPresenter();
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
      const useCaseResponse: GetComboByIdUseCaseResponseDTO = {
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
      const useCaseResponse: GetComboByIdUseCaseResponseDTO = {
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
