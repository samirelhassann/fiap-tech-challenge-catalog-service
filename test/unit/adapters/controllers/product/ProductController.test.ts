import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { ProductController } from "@/adapters/controllers/product/ProductController";
import { CreateProductPresenter } from "@/adapters/presenters/product/CreateProductPresenter";
import { EditProductPresenter } from "@/adapters/presenters/product/EditProductPresenter";
import { GetProductByIdPresenter } from "@/adapters/presenters/product/GetProductByIdPresenter";
import { GetProductsPresenter } from "@/adapters/presenters/product/GetProductsPresenter";
import { InactivateProductPresenter } from "@/adapters/presenters/product/InactivateProductPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Product } from "@/core/domain/entities/Product";
import {
  CreateProductUseCaseRequestDTO,
  CreateProductUseCaseResponseDTO,
} from "@/core/useCases/product/dto/CreateProductUseCaseDTO";
import {
  EditProductUseCaseRequestDTO,
  EditProductUseCaseResponseDTO,
} from "@/core/useCases/product/dto/EditProductUseCaseDTO";
import {
  GetProductByIdUseCaseRequestDTO,
  GetProductByIdUseCaseResponseDTO,
} from "@/core/useCases/product/dto/GetProductByIdUseCaseDTO";
import {
  GetProductsUseCaseRequestDTO,
  GetProductsUseCaseResponseDTO,
} from "@/core/useCases/product/dto/GetProductsUseCaseDTO";
import {
  InactiveProductUseCaseRequestDTO,
  InactiveProductUseCaseResponseDTO,
} from "@/core/useCases/product/dto/InactiveProductUseCaseDTO";
import { IProductUseCase } from "@/core/useCases/product/IProductUseCase";
import { faker } from "@faker-js/faker";

import { makeProduct } from "../../factories/MakeProduct";

let req: FastifyRequest;
let res: FastifyReply;
let controller: ProductController;
let productUseCase: IProductUseCase;
let getProductsPresenter: GetProductsPresenter;
let getProductByIdPresenter: GetProductByIdPresenter;
let createProductPresenter: CreateProductPresenter;
let editProductPresenter: EditProductPresenter;
let inactivateProductPresenter: InactivateProductPresenter;

beforeEach(() => {
  productUseCase = {
    getProducts: vi.fn(),
    getProductById: vi.fn(),
    createProduct: vi.fn(),
    editProduct: vi.fn(),
    inactiveProduct: vi.fn(),
  };

  getProductsPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  getProductByIdPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  createProductPresenter = {
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  editProductPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  inactivateProductPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  controller = new ProductController(
    productUseCase,
    getProductsPresenter,
    getProductByIdPresenter,
    createProductPresenter,
    editProductPresenter,
    inactivateProductPresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("ProductController", () => {
  describe("getProducts", () => {
    it("should call getProducts use case and send response", async () => {
      const useCaseRequest: GetProductsUseCaseRequestDTO = {
        params: new PaginationParams(1, 10),
        includeInactive: faker.datatype.boolean(),
        category: faker.lorem.word(),
      };

      const useCaseResponse: GetProductsUseCaseResponseDTO = {
        paginationResponse: new PaginationResponse<Product>({
          data: [makeProduct()],
          totalItems: faker.number.int(),
          currentPage: faker.number.int(),
          pageSize: faker.number.int(),
          totalPages: faker.number.int(),
        }),
      };

      vi.spyOn(getProductsPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(productUseCase, "getProducts").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.getProducts(req, res);

      expect(productUseCase.getProducts).toHaveBeenCalled();
      expect(getProductsPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(productUseCase, "getProducts").mockRejectedValueOnce(error);

      await controller.getProducts(req, res);

      expect(getProductsPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("getProductById", () => {
    it("should call getProductById use case and send response", async () => {
      const useCaseRequest: GetProductByIdUseCaseRequestDTO = {
        id: faker.string.uuid(),
      };
      const useCaseResponse: GetProductByIdUseCaseResponseDTO = {
        product: makeProduct(),
      };

      vi.spyOn(
        getProductByIdPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(productUseCase, "getProductById").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.getProductById(req, res);

      expect(productUseCase.getProductById).toHaveBeenCalled();
      expect(getProductByIdPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(productUseCase, "getProductById").mockRejectedValueOnce(error);

      await controller.getProductById(req, res);

      expect(getProductByIdPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("createProduct", () => {
    it("should call createProduct use case and send response", async () => {
      const useCaseRequest: CreateProductUseCaseRequestDTO = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        category: faker.lorem.word(),
      };
      const useCaseResponse: CreateProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      vi.spyOn(
        createProductPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(productUseCase, "createProduct").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.createProduct(req, res);

      expect(productUseCase.createProduct).toHaveBeenCalled();
      expect(createProductPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(productUseCase, "createProduct").mockRejectedValueOnce(error);

      await controller.createProduct(req, res);

      expect(createProductPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("editProduct", () => {
    it("should call editProduct use case and send response", async () => {
      const useCaseRequest: EditProductUseCaseRequestDTO = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        price: faker.number.float(),
        category: faker.lorem.word(),
      };
      const useCaseResponse: EditProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      vi.spyOn(editProductPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(productUseCase, "editProduct").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.editProduct(req, res);

      expect(productUseCase.editProduct).toHaveBeenCalled();
      expect(editProductPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(productUseCase, "editProduct").mockRejectedValueOnce(error);

      await controller.editProduct(req, res);

      expect(editProductPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("inactivateProduct", () => {
    it("should call inactivateProduct use case and send response", async () => {
      const useCaseRequest: InactiveProductUseCaseRequestDTO = {
        id: faker.string.uuid(),
      };
      const useCaseResponse: InactiveProductUseCaseResponseDTO = {
        product: makeProduct(),
      };

      vi.spyOn(
        inactivateProductPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(productUseCase, "inactiveProduct").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.inactivateProduct(req, res);

      expect(productUseCase.inactiveProduct).toHaveBeenCalled();
      expect(inactivateProductPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(productUseCase, "inactiveProduct").mockRejectedValueOnce(error);

      await controller.inactivateProduct(req, res);

      expect(
        inactivateProductPresenter.convertErrorResponse
      ).toHaveBeenCalledWith(error, res);
    });
  });
});
