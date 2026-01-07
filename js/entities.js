class User {
  constructor(
    username,
    email,
    uid,
    photoURL = "https://i.pinimg.com/originals/7c/d3/d4/7cd3d4a24e4821ead74b90cb8a55a692.jpg"
  ) {
    this.$username = username;
    this.$email = email;
    this.$uid = uid;
    this.$photoURL = photoURL;
  }

  toObject() {
    return {
      username: this.$username,
      email: this.$email,
      uid: this.$uid,
      photoURL: this.$photoURL,
    };
  }
}
export { User };