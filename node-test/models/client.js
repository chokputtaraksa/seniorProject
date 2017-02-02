function ClientSchema(name, id, secret, userId) {
  this.name = name;
  this.id = id;
  this.secret = secret;
  this.userId = userId;
}

module.exports = ClientSchema;
