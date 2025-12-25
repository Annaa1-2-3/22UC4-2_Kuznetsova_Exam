class Review {
  constructor({ id, application_id, text, created_at }) {
    this.id = id;
    this.application_id = application_id;
    this.text = text;
    this.created_at = created_at;
  }
}

module.exports = Review;