export interface GraphQLClient {
  executeRequest(query: string, variables: any): Promise<any>;
}
