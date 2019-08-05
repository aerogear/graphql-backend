import { BaseKnexResolver } from './BaseKnexResolver'

/**
 * Resolver implementation for some operations which vary according to database,
 * extends all the methods of the Base Resolver class
 * For now only includes the `create` method
 */
export class KnexResolver extends BaseKnexResolver {
  public createTemplate = (database: string, subscription: boolean, fieldName: string, tableName: string, typeName: string): string => {
    if(database === 'sqlite3' || database === 'mysql') {
      if(subscription) {
        return `${fieldName}: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await ${this.knexContext}('${tableName}').insert(args.input).returning('id')
      const result = await ${this.knexContext}.select().from('${tableName}').where('id', '=', id)
      ${this.pubsub}.publish(Subscriptions.NEW_${typeName.toUpperCase()}, {
        new${typeName}: result[0]
      })
      return result[0]
    }`
      } else {
        return `${fieldName}: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await ${this.knexContext}('${tableName}').insert(args.input).returning('id')
      const result = await ${this.knexContext}.select().from('${tableName}').where('id', '=', id)
      return result[0]
    }`
      }
    }
    else {
      if(subscription) {
        return `${fieldName}: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await ${this.knexContext}('${tableName}').insert(args.input).returning('id')
      const result = await ${this.knexContext}.select().from('${tableName}').where('id', '=', id)
      ${this.pubsub}.publish(Subscriptions.NEW_${typeName.toUpperCase()}, {
        new${typeName}: result[0]
      })
      return result[0]
    }`
      } else {
        return `${fieldName}: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await ${this.knexContext}('${tableName}').insert(args.input).returning('id')
      const result = await ${this.knexContext}.select().from('${tableName}').where('id', '=', id)
      return result[0]
    }`
      }
    }
  }
}