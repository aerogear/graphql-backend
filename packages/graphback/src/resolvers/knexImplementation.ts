const knexContext = `context.db`
const argumentContext = `args`

export const createTemplate = (fieldName: string, tableName: string): string => {
    return `${fieldName}: (root, args, context, info) => {
      return ${knexContext}('${tableName}').insert(${argumentContext}.input).returning('*')
    }`
  }

export const deleteTemplate = (fieldName: string, tableName: string): string => {
    return `${fieldName}: (root, args, context, info) => {
      return ${knexContext}('${tableName}').where('id', '=' , ${argumentContext}.id).del().then( () => {
      return ${argumentContext}.id;
    })}`
}

export const findAllTemplate = (fieldName: string, tableName: string): string => {
    return `${fieldName}: (root, args, context, info) => {
      return ${knexContext}.select().from('${tableName}')
    }`
  }

export const findTemplate = (fieldName: string, tableName: string): string => {
    return `${fieldName}: (root, args, context, info) => {
      return ${knexContext}.select().from('${tableName}').where(...${argumentContext}.fields)
    }`
}

export const updateTemplate = (fieldName: string, tableName: string): string => {
    return `${fieldName}: (root, args, context, info) => {
      return ${knexContext}('${tableName}').where('id', '=' , ${argumentContext}.id).update(${argumentContext}.input).then( () => {
        return ${knexContext}.select().from('${tableName}').where('id', '=' , ${argumentContext}.id);
    })}`
}