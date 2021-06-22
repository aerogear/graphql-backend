/* eslint-disable max-lines */
import { GraphQLInputObjectType, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLString, GraphQLID, GraphQLEnumType, GraphQLObjectType, GraphQLNonNull, GraphQLField, getNamedType, isScalarType, GraphQLInputFieldMap, GraphQLScalarType, GraphQLNamedType, GraphQLInputField, isEnumType, isObjectType, isInputObjectType, GraphQLInputType, getNullableType, isListType } from "graphql";
import { GraphbackOperationType, getInputTypeName, getInputFieldName, getInputFieldTypeName, isOneToManyField, getPrimaryKey, metadataMap, ModelDefinition, FILTER_SUPPORTED_SCALARS, isTransientField, isAutoPrimaryKey } from '@graphback/core';
import { SchemaComposer } from 'graphql-compose';
import { copyWrappingType } from './copyWrappingType';

const PageRequestTypeName = 'PageRequest';
const SortDirectionEnumName = 'SortDirectionEnum';
const OrderByInputTypeName = 'OrderByInput';

export const getInputName = (type: GraphQLNamedType) => {
  if (isEnumType(type)) {
    return `StringInput`
  }

  if (isInputObjectType(type)) {
    return type.name
  }

  return `${type.name}Input`
}

export const createInputTypeForScalar = (scalarType: GraphQLScalarType) => {
  const newInput = new GraphQLInputObjectType({
    name: getInputName(scalarType),
    fields: {
      ne: { type: scalarType },
      eq: { type: scalarType },
      le: { type: scalarType },
      lt: { type: scalarType },
      ge: { type: scalarType },
      gt: { type: scalarType },
      in: { type: GraphQLList(GraphQLNonNull(scalarType)) },
      between: { type: GraphQLList(GraphQLNonNull(scalarType)) }
    }
  });

  return newInput;
}

export const StringScalarInputType = new GraphQLInputObjectType({
  name: getInputName(GraphQLString),
  fields: {
    ne: { type: GraphQLString },
    eq: { type: GraphQLString },
    le: { type: GraphQLString },
    lt: { type: GraphQLString },
    ge: { type: GraphQLString },
    gt: { type: GraphQLString },
    in: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
    contains: { type: GraphQLString },
    startsWith: { type: GraphQLString },
    endsWith: { type: GraphQLString }
  }
})

export const IDScalarInputType = new GraphQLInputObjectType({
  name: getInputName(GraphQLID),
  fields: {
    ne: { type: GraphQLID },
    eq: { type: GraphQLID },
    le: { type: GraphQLID },
    lt: { type: GraphQLID },
    ge: { type: GraphQLID },
    gt: { type: GraphQLID },
    in: { type: GraphQLList(GraphQLNonNull(GraphQLID)) },
  }
})

export const BooleanScalarInputType = new GraphQLInputObjectType({
  name: getInputName(GraphQLBoolean),
  fields: {
    ne: { type: GraphQLBoolean },
    eq: { type: GraphQLBoolean }
  }
})

export const PageRequest = new GraphQLInputObjectType({
  name: PageRequestTypeName,
  fields: {
    limit: {
      type: GraphQLInt
    },
    offset: {
      type: GraphQLInt
    }
  }
})

export const SortDirectionEnum = new GraphQLEnumType({
  name: SortDirectionEnumName,
  values: {
    DESC: { value: 'desc' },
    ASC: { value: 'asc' }
  }
})

export const OrderByInputType = new GraphQLInputObjectType({
  name: OrderByInputTypeName,
  fields: {
    field: { type: GraphQLNonNull(GraphQLString) },
    order: { type: SortDirectionEnum, defaultValue: 'asc' }
  }
})

function getModelInputFields(schemaComposer: SchemaComposer<any>, modelType: GraphQLObjectType, operationType: GraphbackOperationType): GraphQLInputField[] {
  const inputFields: GraphQLInputField[] = [];
  const fields: GraphQLField<any, any>[] = Object.values(modelType.getFields());

  for (const field of fields) {
    if (isTransientField(field) || isOneToManyField(field)) {
      continue;
    }

    const typeName = getInputFieldTypeName(modelType.name, field, operationType);

    if (!typeName) {
      continue;
    }

    const name = getInputFieldName(field);
    const type = schemaComposer.getAnyTC(typeName).getType();
    const wrappedType = copyWrappingType(field.type, type) as GraphQLInputType;

    const inputField: GraphQLInputField = {
      name,
      type: wrappedType,
      description: undefined,
      extensions: [],
      deprecationReason: field.deprecationReason
    }

    inputFields.push(inputField);
  }

  return inputFields;
}

export function buildFindOneFieldMap(modelType: ModelDefinition, schemaComposer: SchemaComposer<any>): GraphQLInputFieldMap {
  const { type } = modelType.primaryKey;

  return {
    id: {
      name: "id",
      type: GraphQLNonNull(schemaComposer.getAnyTC(type).getType()),
      description: undefined,
      extensions: undefined,
      deprecationReason: undefined
    }
  }
}

export const buildFilterInputType = (schemaComposer: SchemaComposer<any>, modelType: GraphQLObjectType) => {
  const operationType = GraphbackOperationType.FIND

  const inputTypeName = getInputTypeName(modelType.name, operationType);

  const inputFields = getModelInputFields(schemaComposer, modelType, operationType);

  const scalarInputFields: any = {};

  for (const field of inputFields) {
    const namedType = getNamedType(field.type)

    if (FILTER_SUPPORTED_SCALARS.includes(namedType.name) || isEnumType(namedType)) {
      const type = getInputName(namedType);
      scalarInputFields[field.name] = {
        name: field.name,
        type
      }
    }
  }

  const filterInput = new GraphQLInputObjectType({
    name: inputTypeName,
    fields: {
      ...scalarInputFields,
      and: {
        type: `[${inputTypeName}!]`
      },
      or: {
        type: `[${inputTypeName}!]`
      },
      not: {
        type: `${inputTypeName}`
      }
    }
  });

  schemaComposer.add(filterInput)
}

export const buildCreateMutationInputType = (schemaComposer: SchemaComposer<any>, modelType: GraphQLObjectType) => {
  const operationType = GraphbackOperationType.CREATE
  const inputTypeName = getInputTypeName(modelType.name, operationType);

  const idField = getPrimaryKey(modelType)
  const allModelFields = getModelInputFields(schemaComposer, modelType, operationType);

  const mutationInputType = new GraphQLInputObjectType({
    name: inputTypeName,
    fields: () => {
      const fields: any = {};
      for (const field of allModelFields) {
        if (field.name === idField.name && isAutoPrimaryKey(field)) {
          continue;
        }

        fields[field.name] = {
          name: field.name,
          type: field.type
        };
      }

      return fields;
    }
  });

  schemaComposer.add(mutationInputType)
}

export const buildSubscriptionFilterType = (schemaComposer: SchemaComposer<any>, modelType: GraphQLObjectType) => {
  const inputTypeName = getInputTypeName(modelType.name, GraphbackOperationType.SUBSCRIPTION_CREATE);
  const modelFields = Object.values(modelType.getFields());
  const subscriptionFilterFields = modelFields.filter((f: GraphQLField<any, any>) => {
    const namedType = getNamedType(f.type);

    return !isTransientField(f) && (isScalarType(namedType) && FILTER_SUPPORTED_SCALARS.includes(namedType.name)) || isEnumType(namedType);
  });

  const fields = {
    and: {
      type: `[${inputTypeName}!]`
    },
    or: {
      type: `[${inputTypeName}!]`
    },
    not: {
      type: `${inputTypeName}`
    }
  }
  for (const { name, type } of subscriptionFilterFields) {
    const fieldType: GraphQLNamedType = getNamedType(type);
    const inputFilterName = getInputName(fieldType);

    fields[name] = {
      name,
      type: schemaComposer.get(inputFilterName)
    };
  }

  schemaComposer.createInputTC({
    name: inputTypeName,
    fields
  })
}

export const buildMutationInputType = (schemaComposer: SchemaComposer<any>, modelType: GraphQLObjectType) => {
  const operationType = GraphbackOperationType.UPDATE
  const inputTypeName = getInputTypeName(modelType.name, operationType);

  const idField = getPrimaryKey(modelType)
  const allModelFields = getModelInputFields(schemaComposer, modelType, operationType);

  const mutationInputObject = new GraphQLInputObjectType({
    name: inputTypeName,
    fields: () => {
      const fields: any = {};
      for (const { name, type } of allModelFields) {
        let fieldType: GraphQLInputType

        if (name !== idField.name) {
          fieldType = getNullableType(type);
        }

        if (isListType(fieldType)) {
          fieldType = GraphQLList(getNamedType(fieldType))
        }

        fields[name] = {
          name,
          type: fieldType || type
        };
      }

      return fields;
    }
  });

  schemaComposer.add(mutationInputObject)
}

function mapObjectInputFields(schemaComposer: SchemaComposer<any>, fields: GraphQLField<any, any>[], objectName: string): GraphQLInputField[] {
  return fields.map((field: GraphQLField<any, any>) => {
    let namedType = getNamedType(field.type)
    let typeName = namedType.name

    let inputType
    if (isObjectType(namedType)) {
      typeName = getInputTypeName(typeName, GraphbackOperationType.CREATE)
      namedType = schemaComposer.getOrCreateITC(typeName).getType()

      inputType = copyWrappingType(field.type, namedType)
    }

    return {
      name: field.name,
      type: inputType || field.type,
      extensions: [],
      deprecationReason: field.deprecationReason
    }
  })
}

export function addCreateObjectInputType(schemaComposer: SchemaComposer<any>, objectType: GraphQLObjectType) {
  const objectFields = Object.values(objectType.getFields())
  const operationType = GraphbackOperationType.CREATE

  const inputType = new GraphQLInputObjectType({
    name: getInputTypeName(objectType.name, operationType),
    fields: mapObjectInputFields(schemaComposer, objectFields, objectType.name)
      .reduce((fieldObj: any, { name, type, description }: any) => {
        fieldObj[name] = { type, description }

        return fieldObj
      }, {})
  })

  schemaComposer.add(inputType)
}

export function addUpdateObjectInputType(schemaComposer: SchemaComposer<any>, objectType: GraphQLObjectType) {
  const objectFields = Object.values(objectType.getFields())
  const operationType = GraphbackOperationType.UPDATE

  const inputType = new GraphQLInputObjectType({
    name: getInputTypeName(objectType.name, operationType),
    fields: mapObjectInputFields(schemaComposer, objectFields, objectType.name)
      .reduce((fieldObj: any, { name, type, description }: any) => {
        fieldObj[name] = { type: getNullableType(type), description }

        return fieldObj
      }, {})
  })

  schemaComposer.add(inputType)
}

export const createModelListResultType = (modelType: GraphQLObjectType) => {
  return new GraphQLObjectType({
    name: `${modelType.name}ResultList`,
    fields: {
      items: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(modelType)))
      },
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      count: { type: GraphQLInt }
    }
  })
}

export function createVersionedInputFields(versionedInputType: GraphQLInputObjectType) {
  return {
    [metadataMap.fieldNames.createdAt]: {
      type: versionedInputType
    },
    [metadataMap.fieldNames.updatedAt]: {
      type: versionedInputType
    }
  };
}

export function createVersionedFields(type: GraphQLScalarType) {
  return {
    [metadataMap.fieldNames.createdAt]: {
      type,
      description: `@${metadataMap.markers.createdAt}`
    },
    [metadataMap.fieldNames.updatedAt]: {
      type,
      description: `@${metadataMap.markers.updatedAt}`
    }
  };
}

