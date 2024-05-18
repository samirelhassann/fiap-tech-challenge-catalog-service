import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { Product } from "@/core/domain/entities/Product";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { Category } from "@/core/domain/valueObjects/Category";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  CreateProductUseCaseRequestDTO,
  CreateProductUseCaseResponseDTO,
} from "../dto/CreateProductUseCaseDTO";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    category,
    description,
    name,
    price,
  }: CreateProductUseCaseRequestDTO): Promise<CreateProductUseCaseResponseDTO> {
    const hasProductWithSameName =
      await this.productRepository.findByName(name);

    if (hasProductWithSameName) {
      throw new AttributeConflictError<Product>("name", Product.name);
    }

    const product = await this.productRepository.create(
      new Product({
        name,
        price,
        category: new Category({ name: category as CategoriesEnum }),
        description,
      })
    );

    return { product };
  }
}
