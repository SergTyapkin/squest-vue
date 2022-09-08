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
    ratingPosition: 0,
    chosenQuestId: '?',
    chosenQuest: '',
    chosenBranchId: '?',
    chosenBranch: '',
    progress: 0,
    progressMax: 0,
    avatarUrl: '',
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
