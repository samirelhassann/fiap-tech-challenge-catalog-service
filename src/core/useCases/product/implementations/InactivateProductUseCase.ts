import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { Product } from "@/core/domain/entities/Product";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  InactiveProductUseCaseRequestDTO,
  InactiveProductUseCaseResponseDTO,
} from "../dto/InactiveProductUseCaseDTO";

export class InactivateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    props: InactiveProductUseCaseRequestDTO
  ): Promise<InactiveProductUseCaseResponseDTO> {
    const { id } = props;

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError(Product.name);
    }

    product.active = false;

    const updatedProduct = await this.productRepository.update(product);

    return { product: updatedProduct };
  }
}
