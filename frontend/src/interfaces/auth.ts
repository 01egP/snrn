export interface FormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends FormData {
  name: string;
}
