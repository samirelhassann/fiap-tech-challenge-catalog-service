import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { Category } from "@/core/domain/valueObjects/Category";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  EditProductUseCaseRequestDTO,
  EditProductUseCaseResponseDTO,
} from "../dto/EditProductUseCaseDTO";

export class EditProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    id,
    name,
    category,
    description,
    price,
  }: EditProductUseCaseRequestDTO): Promise<EditProductUseCaseResponseDTO> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError("product");
    }

    if (name) {
      const hasProductWithSameName =
        await this.productRepository.findByName(name);

      if (
        hasProductWithSameName &&
        hasProductWithSameName.id.toString() !== product.id.toString()
      ) {
        throw new AttributeConflictError("name", "product");
      }

      product.name = name;
    }

    if (description) {
      product.description = description;
    }

    if (category) {
      product.category = new Category({ name: category as CategoriesEnum });
    }

    if (price) {
      product.price = price;
    }

    const updatedProduct = await this.productRepository.update(product);

    return { product: updatedProduct };
  }
}
