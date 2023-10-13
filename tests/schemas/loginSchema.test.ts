import faker from '@faker-js/faker';
import { loginSchema } from "../../src/schemas/user.schema";

describe('signInSchema', () => {
  const generateValidInput = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(10),
  });

  describe('when email is not valid', () => {
    it('should return error if email is not present', () => {
      const input = generateValidInput();
      delete input.email;

      const { error } = loginSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if email does not follow valid email format', () => {
      const input = generateValidInput();
      input.email = faker.lorem.word();

      const { error } = loginSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('when password is not valid', () => {
    it('should return error if password is not present', () => {
      const input = generateValidInput();
      delete input.password;

      const { error } = loginSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if password is not a string', () => {
      const input = generateValidInput();

      const { error } = loginSchema.validate({ ...input, password: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  it('should return no error if input is valid', () => {
    const input = generateValidInput();

    const { error } = loginSchema.validate(input);

    expect(error).toBeUndefined();
  });
});