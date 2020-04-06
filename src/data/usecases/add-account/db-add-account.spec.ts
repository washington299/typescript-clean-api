import { DbAddAccount } from './db-add-account';
import { Encrypter } from '../../protocols/encrypter';

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  const encrypterStub = new EncrypterStub();
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
});
