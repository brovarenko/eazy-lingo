export class CreateSetDto {
  name: string;
  isCommon: boolean;
  userId?: number;
}

export class UpdateSetDto {
  name?: string;
  isCommon?: boolean;
}

export class AddWordDto {
  english: string;
  german: string;
  thirdForm?: string;
  perfekt?: string;
}

export class AddExistingWordDto {
  wordId: number;
}
