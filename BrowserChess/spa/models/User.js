export default class User {
    constructor(id, email, username, avatar_path, rating) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatar_path = avatar_path;
        this.rating = rating;
    }
    display() {
        console.log(this.id = id, this.email, this.username, this.avatar_path, this.rating)
    }
}