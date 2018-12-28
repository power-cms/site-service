import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { SiteNotFoundException } from '../../domain/exception/site-not-found.exception';
import { createContainer } from '../../infrastructure/awilix.container';
import { DeleteAction } from './delete.action';
import { ReadAction } from './read.action';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: jest.fn(),
}));

const properData = {
  title: 'Test title',
  content: 'Test content',
  url: 'test-url',
  type: 'blog',
};

describe('Delete action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;
  let id: string;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    remoteProcedure = new RemoteProcedureMock();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const site = await container.resolve<CreateAction>('siteCreateAction').handle({ data: properData });
    id = site.id;
  });

  it('Deletes single site', async () => {
    const action = container.resolve<DeleteAction>('siteDeleteAction');
    await action.handle({ params: { id } });

    const readAction = container.resolve<ReadAction>('siteReadAction');

    expect.assertions(1);

    try {
      await readAction.handle({ params: { id: Id.generate().toString() } });
    } catch (e) {
      expect(e instanceof SiteNotFoundException).toBeTruthy();
    }
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<DeleteAction>('siteDeleteAction');

    await action.authorize({ auth: { id }, data: {} });
    expect(remoteProcedure.call).toBeCalled();
  });
});
