import { BaseUpdateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Site } from '../../domain/site';
import { ISiteRepository } from '../../domain/site.repository';
import { SiteType } from '../../domain/site.type';
import { IUpdateSiteCommand } from './update-site.command';

export class UpdateSiteCommandHandler extends BaseUpdateCommandHandler<Site, IUpdateSiteCommand> {
  constructor(private siteRepository: ISiteRepository) {
    super(siteRepository);
  }

  protected transform(command: IUpdateSiteCommand): Site {
    return new Site(Id.fromString(command.id), SiteType.Text, command.title, command.content, command.url);
  }
}
