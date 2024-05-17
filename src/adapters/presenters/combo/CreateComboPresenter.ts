import { FastifyReply, FastifyRequest } from "fastify";

import { createComboPayloadSchema } from "@/adapters/controllers/combo/schemas/CreateComboSchema";
import { CreateComboViewModel } from "@/adapters/controllers/combo/viewModels/CreateComboViewModel";
import {
  CreateComboUseCaseRequestDTO,
  CreateComboUseCaseResponseDTO,
} from "@/core/useCases/combo/dto/CreateComboUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class CreateComboPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      CreateComboUseCaseRequestDTO,
      CreateComboUseCaseResponseDTO,
      CreateComboViewModel
    >
{
  convertToUseCaseDTO(req: FastifyRequest): CreateComboUseCaseRequestDTO {
    const props = createComboPayloadSchema.parse(req.body);

    return {
      ...props,
    };
  }

  convertToViewModel(
    model: CreateComboUseCaseResponseDTO
  ): CreateComboViewModel {
    return {
      id: model.combo.id.toString(),
      name: model.combo.name,
      description: model.combo.description,
      price: model.combo.price,
      createdAt: model.combo.createdAt.toISOString(),
      updatedAt: model.combo.updatedAt?.toISOString(),
      products: model.productDetails.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category.name,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
      })),
    };
  }

  async sendResponse(
    res: FastifyReply,
    useCaseResponseModel: CreateComboUseCaseResponseDTO
  ) {
    return res.status(200).send(this.convertToViewModel(useCaseResponseModel));
  }
}
