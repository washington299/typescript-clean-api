/* eslint-disable max-classes-per-file */
import { DbAddAccount } from './db-add-account';
import { Encrypter } from './db-add-account-protocols';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
};

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return { sut, encrypterStub };
};

describe('DbAddAccount Encrypter', () => {
  test('Should call Encrypter with correct password', () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };
    sut.add(accountData);
    expect(encryptSpy).toBeCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())));
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
});
