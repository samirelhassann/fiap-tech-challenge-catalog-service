import {
  CreateComboUseCaseRequestDTO,
  CreateComboUseCaseResponseDTO,
} from "./dto/CreateComboUseCaseDTO";
import {
  GetComboByIdUseCaseRequestDTO,
  GetComboByIdUseCaseResponseDTO,
} from "./dto/GetComboByIdUseCaseDTO";
import {
  GetCombosUseCaseRequestDTO,
  GetCombosUseCaseResponseDTO,
} from "./dto/GetCombosUseCaseDTO";

export interface IComboUseCase {
  getCombos(
    props: GetCombosUseCaseRequestDTO
  ): Promise<GetCombosUseCaseResponseDTO>;

  getComboById(
    props: GetComboByIdUseCaseRequestDTO
  ): Promise<GetComboByIdUseCaseResponseDTO>;

  createCombo(
    props: CreateComboUseCaseRequestDTO
  ): Promise<CreateComboUseCaseResponseDTO>;
}
