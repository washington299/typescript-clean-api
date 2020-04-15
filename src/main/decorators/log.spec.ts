/* eslint-disable max-classes-per-file */
import { LogControllerDecorator } from './log';
import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols';
import { serverError, ok } from '../../presentation/helpers/http-helpers';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { AccountModel } from '../../domain/models/account';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    confirmPassword: 'any_password',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

const makeLogErrorRespository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(_stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(makeFakeAccount());
      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository,
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRespository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call handle method', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same thing of the Controller', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    const httpRequest = makeFakeRequest();
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeServerError())));
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
