import { describe, it, expect, beforeEach, vi } from "vitest";

import { PrismaComboProductToDomainConverter } from "@/adapters/repositories/converters/PrismaComboProductToDomainConverter";
import { PrismaComboProductRepository } from "@/adapters/repositories/PrismaComboProductRepository";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { ComboProduct } from "@prisma/client";

import { makeComboProduct } from "../factories/MakeComboProduct";
import { MakeRepositoryComboProduct } from "../factories/repository/MakeRepositoryComboProduct";

vi.mock("@/drivers/db/prisma/config/prisma", () => ({
  prisma: {
    comboProduct: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

let repository: PrismaComboProductRepository;
let comboProduct: ComboProduct;

beforeEach(() => {
  repository = new PrismaComboProductRepository();
  comboProduct = MakeRepositoryComboProduct();
});

describe("PrismaComboProductRepository", () => {
  describe("findByProductIdAndComboId", () => {
    it("should find combo product by productId and comboId", async () => {
      vi.mocked(prisma.comboProduct.findFirst).mockResolvedValueOnce(
        comboProduct
      );

      const result = await repository.findByProductIdAndComboId(
        comboProduct.product_id,
        comboProduct.combo_id
      );

      expect(prisma.comboProduct.findFirst).toHaveBeenCalledWith({
        where: {
          combo_id: comboProduct.combo_id,
          product_id: comboProduct.product_id,
        },
      });
      expect(result).toEqual(
        PrismaComboProductToDomainConverter.convert(comboProduct)
      );
    });

    it("should return null if combo product not found", async () => {
      vi.mocked(prisma.comboProduct.findFirst).mockResolvedValueOnce(null);

      const result = await repository.findByProductIdAndComboId(
        comboProduct.product_id,
        comboProduct.combo_id
      );

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find combo product by id", async () => {
      vi.mocked(prisma.comboProduct.findUnique).mockResolvedValueOnce(
        comboProduct
      );

      const result = await repository.findById(comboProduct.id);

      expect(prisma.comboProduct.findUnique).toHaveBeenCalledWith({
        where: { id: comboProduct.id },
      });
      expect(result).toEqual(
        PrismaComboProductToDomainConverter.convert(comboProduct)
      );
    });

    it("should return null if combo product not found", async () => {
      vi.mocked(prisma.comboProduct.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findById(comboProduct.id);

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should find many combo products with pagination", async () => {
      const comboProducts = [comboProduct];
      const paginationParams = new PaginationParams(1, 10);

      vi.mocked(prisma.comboProduct.findMany).mockResolvedValueOnce(
        comboProducts
      );

      const result = await repository.findMany(paginationParams);

      expect(prisma.comboProduct.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
      });
      expect(result).toEqual(
        comboProducts.map((c) => PrismaComboProductToDomainConverter.convert(c))
      );
    });
  });

  describe("findManyByComboID", () => {
    it("should find many combo products by comboId", async () => {
      const comboProducts = [comboProduct];

      vi.mocked(prisma.comboProduct.findMany).mockResolvedValueOnce(
        comboProducts
      );

      const result = await repository.findManyByComboID(comboProduct.combo_id);

      expect(prisma.comboProduct.findMany).toHaveBeenCalledWith({
        where: { combo_id: comboProduct.combo_id },
      });
      expect(result).toEqual(
        comboProducts.map((c) => PrismaComboProductToDomainConverter.convert(c))
      );
    });
  });

  describe("create", () => {
    it("should create a new combo product", async () => {
      const comboProductEntity = makeComboProduct();

      vi.mocked(prisma.comboProduct.create).mockResolvedValueOnce(comboProduct);

      const result = await repository.create(comboProductEntity);

      expect(prisma.comboProduct.create).toHaveBeenCalledWith({
        data: {
          combo_id: comboProductEntity.comboId.toString(),
          product_id: comboProductEntity.productId.toString(),
        },
      });
      expect(result).toEqual(
        PrismaComboProductToDomainConverter.convert(comboProduct)
      );
    });
  });

  describe("createMany", () => {
    it("should create many combo products", async () => {
      const comboProductsEntity = [makeComboProduct()];

      const comboProducts = [comboProduct];
      vi.mocked(prisma.comboProduct.createMany).mockResolvedValueOnce({
        count: comboProducts.length,
      });

      const result = await repository.createMany(comboProductsEntity);

      expect(prisma.comboProduct.createMany).toHaveBeenCalledWith({
        data: comboProductsEntity.map((c) => ({
          combo_id: c.comboId.toString(),
          product_id: c.productId.toString(),
        })),
      });
      expect(result).toBe(comboProducts.length);
    });
  });

  describe("deleteMany", () => {
    it("should delete many combo products", async () => {
      const comboProductsEntity = [makeComboProduct()];

      const comboProducts = [comboProduct];
      vi.mocked(prisma.comboProduct.deleteMany).mockResolvedValueOnce({
        count: comboProducts.length,
      });

      const result = await repository.deleteMany(comboProductsEntity);

      expect(prisma.comboProduct.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: comboProductsEntity.map((c) => ({
            combo_id: c.comboId.toString(),
            product_id: c.productId.toString(),
          })),
        },
      });
      expect(result).toBe(comboProducts.length);
    });
  });

  describe("deleteByComboId", () => {
    it("should delete combo products by comboId", async () => {
      await repository.deleteByComboId(comboProduct.combo_id);

      expect(prisma.comboProduct.deleteMany).toHaveBeenCalledWith({
        where: { combo_id: comboProduct.combo_id },
      });
    });
  });
});
