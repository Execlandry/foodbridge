import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Mapping, Settings } from "./mapping";
import { ConfigService } from "@fbe/config";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { BusinessService } from "../business/services/business.service";
import { SearchQueryDto } from "../business/dto/business.dto";
import { BusinessEntity } from "../business/entity/business.entity";
import { BusinessAddressEntity } from "../business/entity/business.address.entity";

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService
  ) {}
  public async createIndex() {
    // create index if doesn't exist
    try {
      const index = this.configService.get().elastic.index;
      const checkIndex = await this.esService.indices.exists({ index });
      console.log(checkIndex);
      if (checkIndex.statusCode === 404) {
        this.esService.indices.create(
          {
            index,
            body: {
              mappings: Mapping,
              settings: Settings,
            },
          },
          (err: any) => {}
        );
      }
    } catch (err) {
      throw err;
    }
  }

  @OnEvent("index.dish.business")
  public async indexBusinessWithDish(data: {
    business: BusinessEntity;
    menuItems: string;
  }): Promise<any> {
    const { business, menuItems } = data;
    console.log("inside [index.business] handler");
    try {
      const payload = {
        menu: menuItems,
        ...business,
      };
      return await this.esService.update({
        index: this.configService.get().elastic.index,
        id: business.id,
        body: {
          doc: payload,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  @OnEvent("index.business")
  public async indexBusiness(data: {
    business: BusinessEntity;
    address: BusinessAddressEntity;
  }): Promise<any> {
    const { business, address } = data;
    console.log("inside [index.business] handler");
    try {
      const payload = {
        id: business.id,
        name: business.name,
        description: business.description,
        contact_no: business.contact_no,
        cuisine: business.cuisine,
        banner: business.banner,
        url: business.website_url,
        // delivery_options: business.delivery_options,
        // pickup_options: business.pickup_options,
        opens_at: business.opens_at,
        closes_at: business.closes_at,
        menu: "",
        address: address.street,
        city: address.city,
        state: address.state,
        street: address.street,
        pincode: address.pincode,
        country: address.country,
      };
      return await this.esService.index({
        index: this.configService.get().elastic.index,
        id: payload.id,
        body: payload,
      });
    } catch (err) {
      throw err;
    }
  }
  public async search(searchParam: SearchQueryDto) {
    try {
      const pagination: any = {
        page: Number(searchParam.page || 1),
        limit: Number(searchParam.limit || 15),
      };
      const skippedItems = (pagination.page - 1) * pagination.limit;
      const { body } = await this.esService.search<any>({
        index: this.configService.get().elastic.index,
        body: this.buildSearchQuery(searchParam),
        from: skippedItems,
        size: pagination.limit,
      });
      const totalCount = body.hits.total.value;
      const hits = body.hits.hits;
      const businesses = hits.map((item: any) => item._source);
      return {
        totalCount,
        businesses,
      };
    } catch (err) {
      throw err;
    }
  }

  public buildSearchQuery(searchParam: SearchQueryDto) {
    const { search_text } = searchParam;
    try {
      const query = [];
      if (search_text) {
        query.push({
          multi_match: {
            query: `${search_text}`,
            type: "cross_fields",
            fields: [
              "name",
              "name.word_delimiter",
              "description",
              "description.word_delimiter",
              "menu",
              "menu.word_delimiter",
              "city",
              "address",
            ],
            operator: "or",
          },
        });
      } else {
        return {
          query: {
            match_all: { boost: "1.0" },
          },
        };
      }
      return {
        query: {
          bool: {
            must: query,
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
