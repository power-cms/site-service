import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
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
  let id: string;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const site = await container.resolve<CreateAction>('siteCreateAction').execute({ data: properData });
    id = site.id;
  });

  it('Deletes single site', async () => {
    const action = container.resolve<DeleteAction>('siteDeleteAction');
    await action.execute({ params: { id } });

    const readAction = container.resolve<ReadAction>('siteReadAction');

    expect.assertions(1);

    try {
      await readAction.execute({ params: { id: Id.generate().toString() } });
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
