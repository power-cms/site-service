import { Id } from '@power-cms/common/domain';
import { SiteType } from './site.type';

export class Site {
  constructor(
    private id: Id,
    private type: SiteType,
    private title: string,
    private content: string,
    private url: string
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getType(): SiteType {
    return this.type;
  }

  public getTitle(): string {
    return this.title;
  }

  public getContent(): string {
    return this.content;
  }

  public getUrl(): string {
    return this.url;
  }
}
