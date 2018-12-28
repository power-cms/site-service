import { IContainer, IPaginationView } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { createContainer } from '../../infrastructure/awilix.container';
import { CreateSiteCommandHandler } from '../command/create-site.command-handler';
import { SiteView } from '../query/site.view';
import { CollectionAction } from './collection.action';

const properData = {
  title: 'Test title',
  content: 'Test content',
  url: 'test-url',
  type: 'blog',
};

describe('Collection action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await Promise.all([
      container
        .resolve<CreateSiteCommandHandler>('createSiteHandler')
        .handle({ id: Id.generate().toString(), ...properData }),
      container
        .resolve<CreateSiteCommandHandler>('createSiteHandler')
        .handle({ id: Id.generate().toString(), ...properData }),
    ]);
  });

  it('Fetches site collection', async () => {
    const action = container.resolve<CollectionAction>('siteCollectionAction');
    const result: IPaginationView<SiteView> = await action.handle({});
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBe(2);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<CollectionAction>('siteCollectionAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
