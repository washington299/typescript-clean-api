/* eslint-disable no-unused-vars */
export class SignUpController {
  handle(httpRequest: any): any {
    return {
      statusCode: 400,
      body: new Error('missing param: name'),
    };
  }
}
