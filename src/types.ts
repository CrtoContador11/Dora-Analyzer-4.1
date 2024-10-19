export interface Question {
  id: number;
  text: {
    es: string;
    pt: string;
  };
  categoryId: number;
  options: {
    text: {
      es: string;
      pt: string;
    };
    value: number;
  }[];
}

export interface Category {
  id: number;
  name: {
    es: string;
    pt: string;
  };
}

export interface FormData {
  providerName: string;
  financialEntityName: string;
  userName: string;
  answers: Record<number, number>;
  observations: Record<number, string>;
  date: string;
}

export interface Draft extends FormData {
  lastQuestionIndex: number;
  isCompleted: boolean;
}