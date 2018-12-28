import { ILogger, IRemoteProcedure, IService } from '@power-cms/common/application';
import { createContainer } from './src/infrastructure/awilix.container';

export const createService = (logger?: ILogger, remoteProcedure?: IRemoteProcedure): IService => {
  const container = createContainer(logger, remoteProcedure);

  return container.resolve<IService>('service');
};
