export class TrainingEventDto {
  wordId!: number;
  result!: 'correct' | 'wrong';
  elapsedSeconds?: number;
}
