/* eslint-disable max-classes-per-file */
import { LogControllerDecorator } from './log';
import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols';
import { serverError } from '../../presentation/helpers/http-helpers';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';


const makeLogErrorRespository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Washington',
        },
      };
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
  const controllerStub = makeControllerStub();
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
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same thing of the Controller', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Washington',
      },
    });
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(error)));
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
