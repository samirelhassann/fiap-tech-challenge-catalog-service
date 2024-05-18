import { describe, it, expect } from "vitest";

import { PrismaProductToDomainConverter } from "@/adapters/repositories/converters/PrismaProductToDomainConverter";
import { Product } from "@/core/domain/entities/Product";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { Category } from "@/core/domain/valueObjects/Category";
import { Product as PrismaProduct } from "@prisma/client";

import { makeRepositoryProduct } from "../../factories/repository/MakeRepositoryProduct";

describe("PrismaProductToDomainConverter", () => {
  it("should convert a PrismaProduct to a Product domain entity", () => {
    const prismaProduct: PrismaProduct = makeRepositoryProduct();

    const product: Product =
      PrismaProductToDomainConverter.convert(prismaProduct);

    expect(product).toBeInstanceOf(Product);
    expect(product.id.toString()).toBe(prismaProduct.id);
    expect(product.name).toBe(prismaProduct.name);
    expect(product.description).toBe(prismaProduct.description);
    expect(product.category).toBeInstanceOf(Category);
    expect(product.category.name).toBe(
      prismaProduct.category as CategoriesEnum
    );
    expect(product.active).toBe(prismaProduct.active);
    expect(product.price).toBe(prismaProduct.price.toNumber());
    expect(product.createdAt).toBe(prismaProduct.created_at);
    expect(product.updatedAt).toBe(prismaProduct.updated_at);
  });

  it("should handle null updated_at", () => {
    const prismaProduct: PrismaProduct = makeRepositoryProduct({
      updated_at: null,
    });

    const product: Product =
      PrismaProductToDomainConverter.convert(prismaProduct);

    expect(product.updatedAt).toBeUndefined();
  });
});
