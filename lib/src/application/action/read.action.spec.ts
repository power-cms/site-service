import { IContainer } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { SiteNotFoundException } from '../../domain/exception/site-not-found.exception';
import { createContainer } from '../../infrastructure/awilix.container';
import { SiteView } from '../query/site.view';
import { ReadAction } from './read.action';
import { CreateAction } from './create.action';

const properData = {
  title: 'Test title',
  content: 'Test content',
  url: 'test-url',
  type: 'blog',
};

describe('Read action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;
  let id: string;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const site = await container.resolve<CreateAction>('siteCreateAction').handle({ data: properData });
    id = site.id;
  });

  it('Fetches single site', async () => {
    const action = container.resolve<ReadAction>('siteReadAction');
    const result: SiteView = await action.handle({ params: { id } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id });
  });

  it('Throws error then site not exists', async () => {
    const action = container.resolve<ReadAction>('siteReadAction');

    expect.assertions(1);

    try {
      await action.handle({ params: { id: Id.generate().toString() } });
    } catch (e) {
      expect(e instanceof SiteNotFoundException).toBeTruthy();
    }
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<ReadAction>('siteReadAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
