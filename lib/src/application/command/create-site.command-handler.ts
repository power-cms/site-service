import { BaseCreateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Site } from '../../domain/site';
import { ISiteRepository } from '../../domain/site.repository';
import { SiteType } from '../../domain/site.type';
import { ICreateSiteCommand } from './create-site.command';

export class CreateSiteCommandHandler extends BaseCreateCommandHandler<Site, ICreateSiteCommand> {
  constructor(siteRepository: ISiteRepository) {
    super(siteRepository);
  }

  protected transform(command: ICreateSiteCommand): Site {
    return new Site(Id.fromString(command.id), command.type as SiteType, command.title, command.content, command.url);
  }
}
