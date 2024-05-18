import { UnsupportedArgumentValueError } from "@/core/domain/base/errors/entities/UnsupportedArgumentValueError";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { Category } from "@/core/domain/valueObjects/Category";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  GetProductsUseCaseRequestDTO,
  GetProductsUseCaseResponseDTO,
} from "../dto/GetProductsUseCaseDTO";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    params,
    includeInactive,
    category,
  }: GetProductsUseCaseRequestDTO): Promise<GetProductsUseCaseResponseDTO> {
    if (
      category &&
      !Object.keys(CategoriesEnum)
        .map((e) => e.toLowerCase())
        .includes(category.toLowerCase())
    ) {
      throw new UnsupportedArgumentValueError(Category.name);
    }

    const productCategory = category
      ? new Category({ name: category as CategoriesEnum })
      : undefined;

    const paginationResponse = await this.productRepository.findMany(
      params,
      includeInactive,
      productCategory
    );

    return { paginationResponse };
  }
}
