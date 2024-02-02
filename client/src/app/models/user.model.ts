export class User {
  sso: number;
  name: string;
  email: string;
  language: string;
  job_function:string;
  role: string;
  application: Array<object>;
  last_login: string;
  pass: string;
  salt: string;
  active: boolean;
  constructor() {
    this.sso = 0;
    this.name = '';
    this.email = '';
    this.language = 'English';
    this.job_function = '';
    this.role = '';
    this.application = [];
    this.last_login = Date.now().toString();
    this.pass = '';
    this.salt = '';
    this.active = true;
  }
}
