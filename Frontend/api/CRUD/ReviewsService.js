import ApiService from './ApiService.js';

export default class ReviewsService {
  static async GetReviewsCount(login, password) {
    return ApiService.sendRequest('get', 'GetReviewsCount', login, password);
  }

  static async GetReviewsFields(login, password) {
    return ApiService.sendRequest('get', 'GetReviewsFields', login, password);
  }

  static async GetReviews(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetReviews', login, password, null, { limit, page });
  }

  static async GetReviewsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetReviewsById', login, password, null, { id });
  }

  static async CreateReviews(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateReviews', login, password, newRecord);
  }

  static async UpdateReviews(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateReviews', login, password, oldRecord);
  }

  static async DeleteReviews(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteReviews', login, password, null, { id });
  }
}
