import { Acl, IActionHandler, IContainer, ILogger, IRemoteProcedure, IService } from '@power-cms/common/application';
import {
  createDatabaseConnection,
  MongoConnection,
  MongodbPaginator,
  NullLogger,
  NullRemoteProcedure,
} from '@power-cms/common/infrastructure';
import * as awilix from 'awilix';
import { CollectionAction } from '../application/action/collection.action';
import { CreateAction } from '../application/action/create.action';
import { DeleteAction } from '../application/action/delete.action';
import { ReadAction } from '../application/action/read.action';
import { UpdateAction } from '../application/action/update.action';
import { CreateSiteCommandHandler } from '../application/command/create-site.command-handler';
import { DeleteSiteCommandHandler } from '../application/command/delete-site.command-handler';
import { UpdateSiteCommandHandler } from '../application/command/update-site.command-handler';
import { ISiteQuery } from '../application/query/site.query';
import { SiteService } from '../application/service/service';
import { ISiteRepository } from '../domain/site.repository';
import { MongodbSites } from './mongodb.sites';

export const createContainer = (logger?: ILogger, remoteProcedure?: IRemoteProcedure): IContainer => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
  });

  container.register({
    logger: awilix.asValue<ILogger>(logger || new NullLogger()),
    remoteProcedure: awilix.asValue<IRemoteProcedure>(remoteProcedure || new NullRemoteProcedure()),
    acl: awilix.asClass<Acl>(Acl),

    db: awilix.asValue<MongoConnection>(createDatabaseConnection()),

    paginator: awilix.asClass(MongodbPaginator),

    siteRepository: awilix.asClass<ISiteRepository>(MongodbSites),
    siteQuery: awilix.asClass<ISiteQuery>(MongodbSites),

    createSiteHandler: awilix.asClass<CreateSiteCommandHandler>(CreateSiteCommandHandler),
    updateSiteHandler: awilix.asClass<UpdateSiteCommandHandler>(UpdateSiteCommandHandler),
    deleteSiteHandler: awilix.asClass<DeleteSiteCommandHandler>(DeleteSiteCommandHandler),

    siteCreateAction: awilix.asClass<CreateAction>(CreateAction),
    siteReadAction: awilix.asClass<ReadAction>(ReadAction),
    siteUpdateAction: awilix.asClass<UpdateAction>(UpdateAction),
    siteDeleteAction: awilix.asClass<DeleteAction>(DeleteAction),
    siteCollectionAction: awilix.asClass<CollectionAction>(CollectionAction),

    service: awilix.asClass<IService>(SiteService),
  });

  container.register({
    actions: awilix.asValue<IActionHandler[]>([
      container.resolve<IActionHandler>('siteCreateAction'),
      container.resolve<IActionHandler>('siteReadAction'),
      container.resolve<IActionHandler>('siteUpdateAction'),
      container.resolve<IActionHandler>('siteDeleteAction'),
      container.resolve<IActionHandler>('siteCollectionAction'),
    ]),
  });

  return container;
};
