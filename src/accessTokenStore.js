let tokenStore = {
    accessToken: "",
    setAccessToken: function (accessToken) {
        console.log("setting token!")
        this.accessToken = accessToken
    },
    getAccessToken: function () {
        return this.accessToken
    }
}
export default tokenStore;