import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import { getCombosQueryParamsSchema } from "@/adapters/controllers/combo/schemas/GetCombosSchema";
import { GetCombosPresenter } from "@/adapters/presenters/combo/GetCombosPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { GetCombosUseCaseResponseDTO } from "@/core/useCases/combo/dto/GetCombosUseCaseDTO";

import { makeCombo } from "../../factories/MakeCombo";

// Mocking the schema
vi.mock("@/adapters/controllers/combo/schemas/GetCombosSchema", () => ({
  getCombosQueryParamsSchema: z.object({
    page: z.number().min(1),
    pageSize: z.number().min(1),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: GetCombosPresenter;

describe("GetCombosPresenter", () => {
  const queryMock = getCombosQueryParamsSchema.parse({
    page: 1,
    pageSize: 10,
  });

  beforeEach(() => {
    req = {
      query: queryMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new GetCombosPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request query to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        params: new PaginationParams(queryMock.page, queryMock.pageSize),
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
        data: [makeCombo()],
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      });

      const useCaseResponse: GetCombosUseCaseResponseDTO = {
        paginationResponse,
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      const expectedConvertedViewModel = paginationResponse.toResponse((p) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
      }));

      expect(result).toEqual(expectedConvertedViewModel);
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const paginationResponse = new PaginationResponse({
        currentPage: 1,
        data: [makeCombo()],
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      });

      const useCaseResponse: GetCombosUseCaseResponseDTO = {
        paginationResponse,
      };

      await presenter.sendResponse(res, useCaseResponse);

      const expectedConvertedViewModel = paginationResponse.toResponse((p) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
      }));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedConvertedViewModel);
    });
  });
});
