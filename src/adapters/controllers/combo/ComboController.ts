import { FastifyReply, FastifyRequest } from "fastify";

import { CreateComboPresenter } from "@/adapters/presenters/combo/CreateComboPresenter";
import { GetComboByIdPresenter } from "@/adapters/presenters/combo/GetComboByIdPresenter";
import { GetCombosPresenter } from "@/adapters/presenters/combo/GetCombosPresenter";
import { IComboUseCase } from "@/core/useCases/combo/IComboUseCase";

import { CreateComboViewModel } from "./viewModels/CreateComboViewModel";
import { GetComboByIdViewModel } from "./viewModels/GetComboByIdViewModel";
import { GetCombosViewModel } from "./viewModels/GetCombosViewModel";

export class ComboController {
  constructor(
    private comboUseCase: IComboUseCase,

    private getCombosPresenter: GetCombosPresenter,
    private getComboByIdPresenter: GetComboByIdPresenter,
    private createComboPresenter: CreateComboPresenter
  ) {}

  async getCombos(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<GetCombosViewModel> {
    return this.comboUseCase
      .getCombos(this.getCombosPresenter.convertToUseCaseDTO(req))
      .then((response) => this.getCombosPresenter.sendResponse(res, response))
      .catch((error) =>
        this.getCombosPresenter.convertErrorResponse(error, res)
      );
  }

  async getComboById(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<GetComboByIdViewModel> {
    return this.comboUseCase
      .getComboById(this.getComboByIdPresenter.convertToUseCaseDTO(req))
      .then((response) =>
        this.getComboByIdPresenter.sendResponse(res, response)
      )
      .catch((error) =>
        this.getComboByIdPresenter.convertErrorResponse(error, res)
      );
  }

  async createCombo(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<CreateComboViewModel> {
    return this.comboUseCase
      .createCombo(this.createComboPresenter.convertToUseCaseDTO(req))
      .then((response) => this.createComboPresenter.sendResponse(res, response))
      .catch((error) =>
        this.createComboPresenter.convertErrorResponse(error, res)
      );
  }
}
