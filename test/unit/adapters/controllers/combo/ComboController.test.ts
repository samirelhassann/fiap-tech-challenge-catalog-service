import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { ComboController } from "@/adapters/controllers/combo/ComboController";
import { CreateComboPresenter } from "@/adapters/presenters/combo/CreateComboPresenter";
import { GetComboByIdPresenter } from "@/adapters/presenters/combo/GetComboByIdPresenter";
import { GetCombosPresenter } from "@/adapters/presenters/combo/GetCombosPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Combo } from "@/core/domain/entities/Combo";
import {
  CreateComboUseCaseRequestDTO,
  CreateComboUseCaseResponseDTO,
} from "@/core/useCases/combo/dto/CreateComboUseCaseDTO";
import {
  GetComboByIdUseCaseRequestDTO,
  GetComboByIdUseCaseResponseDTO,
} from "@/core/useCases/combo/dto/GetComboByIdUseCaseDTO";
import {
  GetCombosUseCaseRequestDTO,
  GetCombosUseCaseResponseDTO,
} from "@/core/useCases/combo/dto/GetCombosUseCaseDTO";
import { IComboUseCase } from "@/core/useCases/combo/IComboUseCase";
import { faker } from "@faker-js/faker";

import { makeCombo } from "../../factories/MakeCombo";
import { makeProduct } from "../../factories/MakeProduct";

let req: FastifyRequest;
let res: FastifyReply;
let controller: ComboController;
let comboUseCase: IComboUseCase;
let getCombosPresenter: GetCombosPresenter;
let getComboByIdPresenter: GetComboByIdPresenter;
let createComboPresenter: CreateComboPresenter;

beforeEach(() => {
  comboUseCase = {
    getCombos: vi.fn(),
    getComboById: vi.fn(),
    createCombo: vi.fn(),
  };

  getCombosPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  getComboByIdPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  createComboPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  controller = new ComboController(
    comboUseCase,
    getCombosPresenter,
    getComboByIdPresenter,
    createComboPresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("ComboController", () => {
  describe("getCombos", () => {
    it("should call getCombos use case and send response", async () => {
      const useCaseRequest: GetCombosUseCaseRequestDTO = {
        params: new PaginationParams(1, 10),
      };
      const useCaseResponse: GetCombosUseCaseResponseDTO = {
        paginationResponse: new PaginationResponse<Combo>({
          data: [makeCombo()],
          currentPage: faker.number.int(),
          pageSize: faker.number.int(),
          totalItems: faker.number.int(),
          totalPages: faker.number.int(),
        }),
      };

      vi.spyOn(getCombosPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(comboUseCase, "getCombos").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.getCombos(req, res);

      expect(comboUseCase.getCombos).toHaveBeenCalled();
      expect(getCombosPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(comboUseCase, "getCombos").mockRejectedValueOnce(error);

      await controller.getCombos(req, res);

      expect(getCombosPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("getComboById", () => {
    it("should call getComboById use case and send response", async () => {
      const useCaseRequest: GetComboByIdUseCaseRequestDTO = {
        id: faker.string.uuid(),
      };
      const useCaseResponse: GetComboByIdUseCaseResponseDTO = {
        combo: makeCombo(),
        productDetails: [makeProduct()],
      };

      vi.spyOn(
        getComboByIdPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(comboUseCase, "getComboById").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.getComboById(req, res);

      expect(comboUseCase.getComboById).toHaveBeenCalled();
      expect(getComboByIdPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(comboUseCase, "getComboById").mockRejectedValueOnce(error);

      await controller.getComboById(req, res);

      expect(getComboByIdPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("createCombo", () => {
    it("should call createCombo use case and send response", async () => {
      const useCaseRequest: CreateComboUseCaseRequestDTO = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        dessertId: faker.string.uuid(),
        drinkId: faker.string.uuid(),
        sandwichId: faker.string.uuid(),
      };
      const useCaseResponse: CreateComboUseCaseResponseDTO = {
        combo: makeCombo(),
        productDetails: [makeProduct()],
      };

      vi.spyOn(createComboPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(comboUseCase, "createCombo").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.createCombo(req, res);

      expect(comboUseCase.createCombo).toHaveBeenCalled();
      expect(createComboPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(comboUseCase, "createCombo").mockRejectedValueOnce(error);

      await controller.createCombo(req, res);

      expect(createComboPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });
});
