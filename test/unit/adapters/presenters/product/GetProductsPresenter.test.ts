import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { getProductsQueryParamsSchema } from "@/adapters/controllers/product/schema/GetProductsSchema";
import { GetProductsPresenter } from "@/adapters/presenters/product/GetProductsPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { GetProductsUseCaseResponseDTO } from "@/core/useCases/product/dto/GetProductsUseCaseDTO";
import { faker } from "@faker-js/faker";

import { makeProduct } from "../../factories/MakeProduct";

// Mocking the schema
vi.mock("@/adapters/controllers/product/schema/GetProductsSchema", () => ({
  getProductsQueryParamsSchema: z.object({
    page: z.number().min(1),
    pageSize: z.number().min(1),
    category: z.string().optional(),
    includeInactive: z.boolean().optional(),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: GetProductsPresenter;

describe("GetProductsPresenter", () => {
  const queryMock = getProductsQueryParamsSchema.parse({
    page: 1,
    pageSize: 10,
    category: faker.commerce.department(),
    includeInactive: false,
  });

  beforeEach(() => {
    req = {
      query: queryMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new GetProductsPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request query to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        params: new PaginationParams(queryMock.page, queryMock.pageSize),
        category: queryMock.category,
        includeInactive: queryMock.includeInactive,
      });
    });

    it("should handle invalid query and throw error", () => {
      req.query = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const paginationResponse = new PaginationResponse({
        currentPage: 1,
        data: [makeProduct()],
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      });

      const useCaseResponse: GetProductsUseCaseResponseDTO = {
        paginationResponse,
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      const expectedViewModel = paginationResponse.toResponse((product) => ({
        id: product.id.toString(),
        name: product.name,
        active: product.active,
        description: product.description,
        price: product.price,
        category: product.category.name,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
      }));

      expect(result).toEqual(expectedViewModel);
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const paginationResponse = new PaginationResponse({
        currentPage: 1,
        data: [makeProduct()],
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      });

      const useCaseResponse: GetProductsUseCaseResponseDTO = {
        paginationResponse,
      };

      await presenter.sendResponse(res, useCaseResponse);

      const expectedViewModel = paginationResponse.toResponse((product) => ({
        id: product.id.toString(),
        name: product.name,
        active: product.active,
        description: product.description,
        price: product.price,
        category: product.category.name,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
      }));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedViewModel);
    });
  });
});
