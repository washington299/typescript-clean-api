import { Router } from 'express';
import { makeSignUpController } from '../factories/signup';
import { adaptRoute } from '../adapter/express-routes-adapter';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
