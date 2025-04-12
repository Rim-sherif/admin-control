export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  url: string;
  imageLoaded?: boolean;
}

export interface Category {
  _id: string;
  title: string;
}

export interface Course {
  _id: string;
  title: string;
  url: string;
  price: number;
  access_type: 'free' | 'paid';
  level: string;
  category: Category;
  instructor: Instructor;
  imageLoaded?: boolean;
}
