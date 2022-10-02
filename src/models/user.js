import Model from "./model";

export default class User extends Model {
  default = {
    id: null,
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
    chosenquestid: null,
    chosenquest: '',
    chosenbranchid: null,
    chosenbranch: '',
    progress: 0,
    progressMax: 0,
    avatarimageid: null,
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
