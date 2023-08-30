import { Test, TestRepository } from '../../models/test';

describe('TestRepository', () => {
  const repository = new TestRepository();
  let testVal:Test;

  beforeEach(async () => {
    const test = await repository.create({
      id: null,
      name: 'test',
      age: 10,
    } as Test)
    if (!test || test.id === null) {
      fail('Test ID is undefined, aborting tests.');
      pending();
    } else {
      testVal = test;
    }
  })

  afterEach(async () => {
    await repository.delete(testVal.id as number);
  })

  it('findAll', async () => {
    const result = await repository.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findById', async () => {
    const result = await repository.findById(testVal.id as number);
    expect(result).toBeDefined();
  });

  it('create', async () => {
    expect(testVal).toEqual({
      id: jasmine.any(Number),
      name: 'test',
      age: 10,
    })
  })

  it('update', async () => {
    const result = await repository.update({
      id: testVal.id,
      name: 'test',
      age: 10,
    })
    expect(result).toEqual({
      id: testVal.id,
      name: 'test',
      age: 10,
    })
  })

  it('delete', async () => {
    await repository.delete(testVal.id as number);
    expect(await repository.findById(testVal.id as number)).toBeUndefined();
  })
})
