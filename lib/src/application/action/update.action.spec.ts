import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { SiteView } from '../query/site.view';
import { UpdateAction } from './update.action';
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

const updateData = {
  title: 'New test title',
  content: 'New test content',
  url: 'new-test-url',
};

describe('Update action', () => {
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

  it('Updates site', async () => {
    const action = container.resolve<UpdateAction>('siteUpdateAction');
    const result: SiteView = await action.execute({ data: updateData, params: { id } });

    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, ...updateData, id });
  });

  it('Validates site', async () => {
    const action = container.resolve<UpdateAction>('siteUpdateAction');

    expect.assertions(2);

    expect(() => {
      validate({}, action.validator);
    }).toThrowError(ValidationException);

    try {
      validate({}, action.validator);
    } catch (e) {
      const messageRequired = 'any.required';

      expect(e.details).toEqual([
        { path: 'title', message: messageRequired },
        { path: 'content', message: messageRequired },
        { path: 'url', message: messageRequired },
      ]);
    }
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<UpdateAction>('siteUpdateAction');

    await action.authorize({ auth: { id }, data: { id: Id.generate().toString() } });
    expect(remoteProcedure.call).toBeCalled();
  });
});
