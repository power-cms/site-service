import { IContainer } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/src/domain';
import { Collection, Db } from 'mongodb';
import { Site } from '../domain/site';
import { ISiteRepository } from '../domain/site.repository';
import { SiteType } from '../domain/site.type';
import { createContainer } from './awilix.container';

const MockCollection = jest.fn<Collection>(() => ({
  insertOne: jest.fn(() => {
    throw new Error();
  }),
}));

const properData = new Site(Id.generate(), SiteType.Text, 'title', 'content', 'url');

describe('Mongodb handler', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Throws persistance exception', async () => {
    const db = await container.resolve<Db>('db');
    db.collection = MockCollection;

    const mongoHandler: ISiteRepository = container.resolve<ISiteRepository>('siteRepository');

    expect.assertions(3);

    await expect(mongoHandler.create(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.update(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.delete(Id.generate().toString())).rejects.toThrowError(PersistanceException);
  });
});
