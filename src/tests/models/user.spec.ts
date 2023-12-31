import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { User, UserRepository } from '../../models/user';

dotenv.config();

describe('UserRepository', () => {
  const repository = new UserRepository();
  let userVal: User;

  beforeEach(async () => {
    const user = await repository.create({
      id: null,
      username: 'testUser',
      email: 'test@test.com',
      password: 'testPassword'
    } as User);
    if (!user || user.id === null) {
      fail('User ID is undefined, aborting tests.');
      pending();
    } else {
      userVal = {...user};
    }
  });

  afterEach(async () => {
    await repository.delete(userVal.id as number);
  });

  it('findAll', async () => {
    const result = await repository.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findById', async () => {
    const result = await repository.findById(userVal.id as number);
    expect(result).toBeDefined();
  });

  it('create', async () => {
    expect(userVal).toEqual({
      id: jasmine.any(Number),
      username: 'testUser',
      email: 'test@test.com',
      password: jasmine.any(String)  // You will hash the password, so it should be some string
    });
  });

  it('update', async () => {
    const updatedUser = await repository.update({
      id: userVal.id,
      username: 'updatedUser',
      email: 'updated@test.com',
      password: 'updatedPassword'
    });
    expect(updatedUser).toEqual({
      id: userVal.id,
      username: 'updatedUser',
      email: 'updated@test.com',
      password: jasmine.any(String)
    });
  });

  it('delete', async () => {
    await repository.delete(userVal.id as number);
    expect(await repository.findById(userVal.id as number)).toBeUndefined();
  });

  it('authenticate', async () => {
    const authenticatedUser = await repository.authenticate(userVal.username, 'testPassword' as string);
    const pepper = process.env.BCRYPT_PASSWORD as string;
    expect(authenticatedUser).toBeDefined();
  })

  it('authenticate fail', async () => {
    try {
      await repository.authenticate(userVal.username, 'wrongPassword');
    } catch (e) {
      expect(e).toBeDefined(); // or whatever assertion makes sense in your case
    }
    })
});
