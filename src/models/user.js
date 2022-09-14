import Model from "./model";

export default class User extends Model {
  default = {
    id: '?',
    isLogined: false,
    isGotten: false,
    isAdmin: false,
    isConfirmed: false,
    joinedDate: '',
    email: "",
    name: "",
    username: "",
    password: "",
    rating: 0,
    position: 0,
    chosenquestid: '?',
    chosenquest: '',
    chosenbranchid: '?',
    chosenbranch: '',
    progress: 0,
    progressMax: 0,
    avatarurl: '',
    createdquests: 0,
    completedbranches: 0,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
    this.isGotten = true;
  }

  setDefault() {
    super._setDefault(this);
    this.isGotten = true;
  }

  constructor() {
    super();
    this._setDefault();
  }
}
