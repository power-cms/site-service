import { IPaginationView, Pagination } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/domain';
import { MongodbPaginator, ObjectIDFactory } from '@power-cms/common/infrastructure';
import { Collection, Db } from 'mongodb';
import { ISiteQuery } from '../application/query/site.query';
import { SiteView } from '../application/query/site.view';
import { SiteNotFoundException } from '../domain/exception/site-not-found.exception';
import { Site } from '../domain/site';
import { ISiteRepository } from '../domain/site.repository';

export class MongodbSites implements ISiteRepository, ISiteQuery {
  private static COLLECTION_NAME = 'site';

  constructor(private readonly db: Promise<Db>, private paginator: MongodbPaginator) {}

  public async get(id: Id): Promise<SiteView> {
    const collection = await this.getCollection();
    const site = await collection.findOne({ _id: ObjectIDFactory.fromDomainId(id) });

    if (site === null) {
      throw SiteNotFoundException.withId(id);
    }

    return this.toView(site);
  }

  public async getAll(pagination: Pagination): Promise<IPaginationView<SiteView>> {
    const collection = await this.getCollection();
    return this.paginator.paginate(collection, pagination, this.toView);
  }

  public async create(site: Site): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.insertOne({
        _id: ObjectIDFactory.fromDomainId(site.getId()),
        type: site.getType().toString(),
        title: site.getTitle(),
        content: site.getContent(),
        url: site.getUrl(),
      });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async update(site: Site): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: ObjectIDFactory.fromDomainId(site.getId()) },
        {
          $set: {
            title: site.getTitle(),
            content: site.getContent(),
            url: site.getUrl(),
          },
        }
      );
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.deleteOne({ _id: ObjectIDFactory.fromString(id) });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  private toView(data: any): SiteView {
    return new SiteView(data._id.toString(), data.type, data.title, data.content, data.url);
  }

  private async getCollection(): Promise<Collection> {
    const db = await this.db;

    return db.collection(MongodbSites.COLLECTION_NAME);
  }
}
