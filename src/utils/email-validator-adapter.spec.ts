import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    const sut = new EmailValidatorAdapter();
    sut.isValid('any_email@email.com');
    expect(isEmailSpy).toBeCalledWith('any_email@email.com');
  });
});
