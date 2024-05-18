import { describe, it, expect, beforeEach, vi } from "vitest";

import { PrismaProductToDomainConverter } from "@/adapters/repositories/converters/PrismaProductToDomainConverter";
import { PrismaProductRepository } from "@/adapters/repositories/PrismaProductRepository";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Product } from "@/core/domain/entities/Product";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { Category } from "@/core/domain/valueObjects/Category";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { Product as RepositoryProduct } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { makeProduct } from "../factories/MakeProduct";
import { makeRepositoryProduct } from "../factories/repository/MakeRepositoryProduct";

vi.mock("@/drivers/db/prisma/config/prisma", () => ({
  prisma: {
    product: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock(
  "@/adapters/repositories/converters/PrismaProductToDomainConverter",
  () => ({
    PrismaProductToDomainConverter: {
      convert: vi.fn(),
    },
  })
);

let repository: PrismaProductRepository;
let product: RepositoryProduct;

beforeEach(() => {
  repository = new PrismaProductRepository();
  product = makeRepositoryProduct();
});

describe("PrismaProductRepository", () => {
  describe("findMany", () => {
    it("should find many products with pagination", async () => {
      const products = [product];
      const paginationParams = new PaginationParams(1, 10);

      vi.mocked(prisma.product.count).mockResolvedValueOnce(1);
      vi.mocked(prisma.product.findMany).mockResolvedValueOnce(products);

      const result = await repository.findMany(paginationParams, false);

      expect(prisma.product.count).toHaveBeenCalled();
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { active: true },
        take: 10,
        skip: 0,
      });
      expect(result).toEqual(
        new PaginationResponse<Product>({
          data: products.map((c) => PrismaProductToDomainConverter.convert(c)),
          totalItems: 1,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
        })
      );
    });
  });

  describe("findByName", () => {
    it("should find product by name", async () => {
      vi.mocked(prisma.product.findFirst).mockResolvedValueOnce(product);

      const result = await repository.findByName("Test Product");

      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { name: "Test Product" },
      });
      expect(result).toEqual(PrismaProductToDomainConverter.convert(product));
    });

    it("should return null if product not found", async () => {
      vi.mocked(prisma.product.findFirst).mockResolvedValueOnce(null);

      const result = await repository.findByName("Test Product");

      expect(result).toBeNull();
    });
  });

  describe("findByIdAndCategory", () => {
    it("should find product by id and category", async () => {
      const category = new Category({
        name: CategoriesEnum.DESSERT,
      });
      vi.mocked(prisma.product.findFirst).mockResolvedValueOnce(product);

      const result = await repository.findByIdAndCategory("1", category);

      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: "1", category: category.name },
      });
      expect(result).toEqual(PrismaProductToDomainConverter.convert(product));
    });

    it("should return null if product not found", async () => {
      const category = new Category({
        name: CategoriesEnum.DESSERT,
      });
      vi.mocked(prisma.product.findFirst).mockResolvedValueOnce(null);

      const result = await repository.findByIdAndCategory("1", category);

      expect(result).toBeNull();
    });
  });

  describe("findManyByIds", () => {
    it("should find many products by ids", async () => {
      const products = [product];
      const ids = [product.id];

      vi.mocked(prisma.product.findMany).mockResolvedValueOnce(products);

      const result = await repository.findManyByIds(ids);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
      });
      expect(result).toEqual(
        products.map((c) => PrismaProductToDomainConverter.convert(c))
      );
    });
  });

  describe("findById", () => {
    it("should find product by id", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(product);

      const result = await repository.findById(product.id);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(result).toEqual(PrismaProductToDomainConverter.convert(product));
    });

    it("should return null if product not found", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findById(product.id);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new product", async () => {
      const productEntity = makeProduct();
      vi.mocked(prisma.product.create).mockResolvedValueOnce(product);

      const result = await repository.create(productEntity);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: productEntity.name,
          description: productEntity.description,
          active: productEntity.active,
          price: productEntity.price,
          category: productEntity.category.name,
        },
      });
      expect(result).toEqual(PrismaProductToDomainConverter.convert(product));
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      const productToUpdate = makeProduct();
      const updatedProduct = makeRepositoryProduct({
        name: productToUpdate.name,
        description: productToUpdate.description,
        active: productToUpdate.active,
        price: new Decimal(productToUpdate.price),
        category: productToUpdate.category.name,
      });

      vi.mocked(prisma.product.update).mockResolvedValueOnce(updatedProduct);

      const result = await repository.update(productToUpdate);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productToUpdate.id.toString() },
        data: {
          name: productToUpdate.name,
          description: productToUpdate.description,
          active: productToUpdate.active,
          price: productToUpdate.price,
          category: productToUpdate.category.name,
        },
      });
      expect(result).toEqual(
        PrismaProductToDomainConverter.convert(updatedProduct)
      );
    });
  });
});
