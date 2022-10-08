export interface IScore {
  username: string;
  score: number;
  difficulty: string;
}

export interface IScoreFile {
  scores: Array<IScore>;
}
