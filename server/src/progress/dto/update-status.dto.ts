export enum WordStatusDtoEnum {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  LEARNED = 'LEARNED',
  KNOWN = 'KNOWN',
}

export class UpdateStatusDto {
  wordId!: number;

  status!: WordStatusDtoEnum;
}
