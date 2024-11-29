export interface Word {
  id: number;
  english: string;
  german: string;
  perfekt: string;
}

export interface Set {
  id: number;
  name: string;
  isCommon: boolean;
  words: Word[];
}

export interface User {
  userId: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
