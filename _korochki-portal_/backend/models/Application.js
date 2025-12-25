class Application {
  constructor({ id, user_id, course_id, start_date, payment_method, status, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.start_date = start_date;
    this.payment_method = payment_method;
    this.status = status;
    this.created_at = created_at;
  }

  static STATUSES = ['Новая', 'Идет обучение', 'Обучение завершено'];

  static isValidStatus(status) {
    return Application.STATUSES.includes(status);
  }
}

module.exports = Application;