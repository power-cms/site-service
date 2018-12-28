import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { createContainer } from '../../infrastructure/awilix.container';
import { SiteView } from '../query/site.view';
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

describe('Create action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;
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
  });

  it('Creates site', async () => {
    const action = container.resolve<CreateAction>('siteCreateAction');
    const { id, ...result }: SiteView = await action.handle({ data: properData });

    expect(result).toEqual(properData);
    expect(id).toBeDefined();
  });

  it('Validates site', async () => {
    const action = container.resolve<CreateAction>('siteCreateAction');

    expect.assertions(2);

    expect(() => {
      validate({}, action.validator);
    }).toThrowError(ValidationException);

    try {
      validate({}, action.validator);
    } catch (e) {
      const messageRequired = 'any.required';

      expect(e.details).toEqual([
        { path: 'type', message: messageRequired },
        { path: 'title', message: messageRequired },
        { path: 'content', message: messageRequired },
        { path: 'url', message: messageRequired },
      ]);
    }
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<CreateAction>('siteCreateAction');

    await action.authorize({ auth: { id: Id.generate().toString() }, data: {} });
    expect(remoteProcedure.call).toBeCalled();
  });
});
