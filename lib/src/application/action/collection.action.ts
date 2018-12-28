import { BaseCollectionAction } from '@power-cms/common/application';

import { ISiteQuery } from '../query/site.query';
import { SiteView } from '../query/site.view';

export class CollectionAction extends BaseCollectionAction<SiteView> {
  constructor(siteQuery: ISiteQuery) {
    super(siteQuery);
  }

  public async authorize(): Promise<boolean> {
    return true;
  }
}
