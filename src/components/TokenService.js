class TokenService {
  EVENTLY_TOKEN_KEY = "evently_token";
  MY_EVENTLY_USER_NAME = "myEventlyUsername";
  MY_EVENTLY_USER_ID = "myEventlyUserId";
  token = null;
  myEventlyUsername = null;
  myEventlyUserId = null;
  constructor() {
    this.init();
  }
  init() {
    this.find();
    this.findUser();
  }
  find() {
    this.token = localStorage.getItem(this.EVENTLY_TOKEN_KEY);
  }
  create(token) {
    this.token = token;
    localStorage.setItem(this.EVENTLY_TOKEN_KEY, token);
  }
  storeUser(myEventlyUsername, myEventlyUserId) {
    this.myEventlyUsername = myEventlyUsername;
    this.myEventlyUserId = myEventlyUserId;
    localStorage.setItem(this.MY_EVENTLY_USER_NAME, myEventlyUsername);
    localStorage.setItem(this.MY_EVENTLY_USER_ID, myEventlyUserId);
  }
  findUser() {
    this.myEventlyUsername = localStorage.getItem(this.MY_EVENTLY_USER_NAME);
    this.myEventlyUserId = localStorage.getItem(this.MY_EVENTLY_USER_ID);
  }
  remove() {
    this.token = null;
    this.myEventlyUsername = null;
    this.myEventlyUserId = null;
    localStorage.removeItem(this.EVENTLY_TOKEN_KEY);
    localStorage.removeItem(this.MY_EVENTLY_USER_NAME);
    localStorage.removeItem(this.MY_EVENTLY_USER_ID);
  }
}
export const tokenService = new TokenService();
