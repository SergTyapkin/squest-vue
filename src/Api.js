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
    getMyQuests = (userId) => this.get(`/quest`, {userId});
    getQuestInfo = (questId) => this.get(`/quest`, {questId});

    createQuest = (title, description, isPublished) => this.post(`/quest`, {title, description, isPublished});
    updateQuestInfo = (id, title, description, isPublished, isLinkActive) => this.put(`/quest`, {id, title, description, isPublished, isLinkActive});
    getQuestInfoByUid = (questUid) => this.get(`/quest`, {questUid});
    deleteQuest = (id) => this.delete(`/quest`, {id});

    getQuestBranches = (questId) => this.get(`/branch`, {questId});
    updateBranchOrderId = (id, title, orderId) => this.put('/branch', {id, title, orderId});
    updateBranchInfo = (id, title, description, isPublished) => this.put('/branch', {id, title, description, isPublished});
    createBranchesMany = (questId, branches = [{title: '', description: ''}]) => this.post('/branch/many', {questId, branches});
    getBranchInfo = (branchId) => this.get(`/branch`, {branchId});
    deleteBranch = (id) => this.delete(`/branch`, {id});

    checkAnswer = (answer) => this.post(`/task/play`, {answer});
    chooseBranch = (questId, branchId) => this.post(`/quest/choose`, {questId, branchId});
    restartBranch = (branchId) => this.put(`/branch/progress/reset`, {branchId})

    getBranchTasks = (branchId) => this.get(`/task`, {branchId});
    getTaskInfo = (taskId) => this.get(`/task`, {taskId});
    updateTaskOrderId = (id, title, orderId) => this.put('/task', {id, title, orderId});
    updateTaskInfo = (id, title, description, question, answers, isQrAnswer) => this.put('/task', {id, title, description, question, answers, isQrAnswer});
    deleteTask = (id) => this.delete('/task', {id});
    createTasksMany = (branchId, tasks = [{title: '', description: '', question: '', answers: []}]) => this.post('/task/many', {branchId, tasks});

    updateHelper = (id, questId, name) => this.put('/quest/helpers', {id, questId, name});
    createHelper = (questId, name) => this.post('/quest/helpers', {questId, name});
    deleteHelper = (id) => this.delete('/quest/helpers', {id});
    getQuestHelpers = (questId) => this.get('/quest/helpers', {questId});

    uploadImage = (dataUrl) => this.post('/image', {dataUrl});
}
