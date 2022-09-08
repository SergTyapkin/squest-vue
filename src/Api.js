import ApiRequest from "./utils/requests";

// Make Vue plugin: vue.use(<imported Api>);
export default {
    install: (app, baseUrlPath) => {
        app.config.globalProperties.$api = new Api(baseUrlPath);
    }
}

export class Api extends ApiRequest {
    signIn = (username, password) => this.post(`/user/auth`, {username, password});
    signOut = () => this.delete(`/user/session`);
    getUser = () => this.get(`/user`);
    signUp = (username, password, email, name) => this.post(`/user`, {username, password, email, name});
    updateUser = (email, username, name) => this.put(`/user`, {email, username, name});
    updatePassword = (oldPassword, newPassword) => this.put(`/user/password`, {oldPassword, newPassword});

    getPlay = () => this.get(`/task/play`);
    getAllQuests = () => this.get(`/quest`);
    getQuestInfo = (questId) => this.get(`/quest`, {questId});
    getQuestBranches = (questId) => this.get(`/branch`, {questId});
    checkAnswer = (answer) => this.post(`/task/play`, {answer});
    chooseBranch = (questId, branchId) => this.post(`/quest/choose`, {questId, branchId});

    restartBranch = (branchId) => this.put(`/branch/progress/reset`, {branchId})
}
