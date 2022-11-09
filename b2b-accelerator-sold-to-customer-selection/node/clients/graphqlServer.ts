import type {
  InstanceOptions,
  IOContext,
  RequestConfig,
  Serializable,
} from '@vtex/api'
import { AppClient, GraphQLClient } from '@vtex/api'

export class GraphQLServer extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.graphql-server@1.x', ctx, opts)
    this.graphql = new GraphQLClient(this.http)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public query = async <TResponse extends Serializable, TArgs extends object>(
    query: string,
    variables: any,
    extensions: any,
    config: RequestConfig
  ) => {
    return this.graphql.query<TResponse, TArgs>(
      {
        extensions,
        query,
        variables,
      },
      {
        ...config,
        params: {
          ...config.params,
          locale: this.context.locale,
        },
        url: '/graphql',
      }
    )
  }
}
