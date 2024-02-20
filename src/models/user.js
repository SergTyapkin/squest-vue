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
    chosenmode: null,
    chosenbranch: '',
    progress: 0,
    progressMax: 0,
    avatarimageid: null,
    createdquests: [],
    completedbranches: [],
    isTemporary: false,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
    this.isGotten = true;
    if (data.temporaryToQuestId !== null) {
      this.isTemporary = true;
    }
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
