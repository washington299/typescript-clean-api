/* eslint-disable consistent-return */
import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helpers';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}