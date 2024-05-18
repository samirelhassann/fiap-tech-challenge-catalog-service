import { describe, it, expect, beforeEach, vi } from "vitest";

import { PrismaComboToDomainConverter } from "@/adapters/repositories/converters/PrismaComboToDomainConverter";
import { PrismaComboRepository } from "@/adapters/repositories/PrismaComboRepository";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Combo } from "@/core/domain/entities/Combo";
import { IComboProductRepository } from "@/core/interfaces/repositories/IComboProductRepository";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { Combo as RepositoryCombo } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { makeCombo } from "../factories/MakeCombo";
import { makeRepositoryCombo } from "../factories/repository/MakeRepositoryCombo";

vi.mock("@/drivers/db/prisma/config/prisma", () => ({
  prisma: {
    combo: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockComboProductRepository: IComboProductRepository = {
  findById: vi.fn(),
  findMany: vi.fn(),
  findManyByComboID: vi.fn(),
  findByProductIdAndComboId: vi.fn(),
  create: vi.fn(),
  createMany: vi.fn(),
  deleteMany: vi.fn(),
  deleteByComboId: vi.fn(),
};

let repository: PrismaComboRepository;
let combo: RepositoryCombo;

beforeEach(() => {
  repository = new PrismaComboRepository(mockComboProductRepository);
  combo = makeRepositoryCombo();
});

describe("PrismaComboRepository", () => {
  describe("findById", () => {
    it("should find combo by id", async () => {
      vi.mocked(prisma.combo.findUnique).mockResolvedValueOnce(combo);

      const result = await repository.findById(combo.id);

      expect(prisma.combo.findUnique).toHaveBeenCalledWith({
        where: { id: combo.id },
      });
      expect(result).toEqual(PrismaComboToDomainConverter.convert(combo));
    });

    it("should return null if combo not found", async () => {
      vi.mocked(prisma.combo.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findById(combo.id);

      expect(result).toBeNull();
    });
  });

  describe("findManyByIds", () => {
    it("should find many combos by ids", async () => {
      const combos = [combo];
      const ids = [combo.id];

      vi.mocked(prisma.combo.findMany).mockResolvedValueOnce(combos);

      const result = await repository.findManyByIds(ids);

      expect(prisma.combo.findMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
      });
      expect(result).toEqual(
        combos.map((c) => PrismaComboToDomainConverter.convert(c))
      );
    });
  });

  describe("findMany", () => {
    it("should find many combos with pagination", async () => {
      const combos = [combo];
      const paginationParams = new PaginationParams(1, 10);

      vi.mocked(prisma.combo.count).mockResolvedValueOnce(1);
      vi.mocked(prisma.combo.findMany).mockResolvedValueOnce(combos);

      const result = await repository.findMany(paginationParams);

      expect(prisma.combo.count).toHaveBeenCalled();
      expect(prisma.combo.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(
        new PaginationResponse<Combo>({
          data: combos.map((c) => PrismaComboToDomainConverter.convert(c)),
          totalItems: 1,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
        })
      );
    });
  });

  describe("create", () => {
    it("should create a new combo", async () => {
      const comboEntity = makeCombo();

      vi.mocked(prisma.combo.create).mockResolvedValueOnce(combo);

      const result = await repository.create(comboEntity);

      expect(prisma.combo.create).toHaveBeenCalledWith({
        data: {
          id: comboEntity.id.toString(),
          name: comboEntity.name,
          description: comboEntity.description,
          price: comboEntity.price,
        },
      });
      expect(result).toEqual(PrismaComboToDomainConverter.convert(combo));
    });
  });

  describe("update", () => {
    it("should update an existing combo", async () => {
      const comboToUpdate = makeCombo();
      const updatedCombo = makeRepositoryCombo({
        name: comboToUpdate.name,
        description: comboToUpdate.description,
        price: new Decimal(comboToUpdate.price),
      });

      vi.mocked(prisma.combo.update).mockResolvedValueOnce(updatedCombo);

      const result = await repository.update(comboToUpdate);

      expect(prisma.combo.update).toHaveBeenCalledWith({
        where: { id: comboToUpdate.id.toString() },
        data: {
          name: comboToUpdate.name,
          description: comboToUpdate.description,
          price: comboToUpdate.price,
        },
      });
      expect(result).toEqual(
        PrismaComboToDomainConverter.convert(updatedCombo)
      );
    });
  });

  describe("delete", () => {
    it("should delete a combo by id", async () => {
      await repository.delete(combo.id);

      expect(prisma.combo.delete).toHaveBeenCalledWith({
        where: { id: combo.id },
      });
      expect(mockComboProductRepository.deleteByComboId).toHaveBeenCalledWith(
        combo.id
      );
    });
  });
});
