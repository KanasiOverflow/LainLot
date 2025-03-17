import ApiService from '../ApiService.js';

export default class ReviewsService {
  static async GetReviewsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetReviewsCount', login, password);
  }

  static async GetReviewsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetReviewsFields', login, password);
  }

  static async GetReviews(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetReviews', login, password, null, { limit, page });
  }

  static async GetReviewsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetReviewsById', login, password, null, { id });
  }

  static async CreateReviews(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateReviews', login, password, newRecord);
  }

  static async UpdateReviews(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateReviews', login, password, oldRecord);
  }

  static async DeleteReviews(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteReviews', login, password, null, { id });
  }
}
