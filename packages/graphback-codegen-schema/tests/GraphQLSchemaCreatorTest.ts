/* eslint-disable max-lines */
import { readFileSync } from 'fs';
import { buildSchema, printSchema, GraphQLObjectType, assertInputObjectType } from 'graphql';
import { GraphbackCoreMetadata, printSchemaWithDirectives, GraphbackPluginEngine, metadataMap } from '@graphback/core';

import { SchemaCRUDPlugin } from '../src/SchemaCRUDPlugin';

const schemaText = readFileSync(`${__dirname}/mock.graphql`, 'utf8')

test('Test snapshot config gql', async () => {
  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(schemaText), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema()

  expect(printSchemaWithDirectives(schema)).toMatchSnapshot();
});


test('Test one side relationship schema query type generation', async () => {

  const modelText = `""" @model """
  type Note {
    id: ID!
    title: String!
    description: String!
    """
    @oneToMany(field: 'note', key: 'test_id')
    """
    tests: [Test]!
  }

  """
  @model
  """
  type Test {
    id: ID!
    name: String
  }
  `;

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({
    schema: buildSchema(modelText),
    plugins: [schemaGenerator],
    config: {
      crudMethods: {
        "create": false,
        "update": false,
        "findOne": true,
        "find": true,
        "delete": false,
        "subCreate": false,
        "subUpdate": false,
        "subDelete": false
      }
    }
  });

  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema()

  expect(printSchema(schema)).toMatchSnapshot()
});


test('Model has missing relationship annotations', async () => {
  let modelText = `
  """ @model """
  type Note {
    id: ID!
    tests: [Test]!
  }

  """
  @model
  """
  type Test {
    id: ID!
    name: String
  }
  `;

  try {
    const schemaGenerator = new SchemaCRUDPlugin()
    const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelText), plugins: [schemaGenerator] })
    pluginEngine.createResources()
    expect(true).toBeFalsy(); // should not reach here
  } catch (error) {
    expect(error.message).toEqual(`Missing relationship definition on: "Note.tests". Visit https://graphback.dev/docs/model/datamodel#relationships to see how you can define relationship in your business model.`);
  }

  modelText = `
  """ @model """
  type Note {
    id: ID!
    test: Test
  }

  """
  @model
  """
  type Test {
    id: ID!
    name: String
  }
  `;

  try {
    const schemaGenerator = new SchemaCRUDPlugin()
    const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelText), plugins: [schemaGenerator] })
    pluginEngine.createResources()
    expect(true).toBeFalsy(); // should not reach here
  } catch (error) {
    expect(error.message).toEqual(`Missing relationship definition on: "Note.test". Visit https://graphback.dev/docs/model/datamodel#relationships to see how you can define relationship in your business model.`);
  }
});

test('Non-model type has model-type field', () => {

  const modelText = `
type JWTAuthResult {
  user: User!
  csrfToken: String!
  authJWT: String!
}

"""@model"""
type User {
  id: ID!
  name: String
}

type Query {
  jwt: JWTAuthResult
}`

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelText), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources();
  const schema = metadata.getSchema();

  expect(schema.getType('JWTAuthResult')).toBeDefined()
})


test('Creates CRUD resolvers for models', async () => {
  const pluginEngine = new GraphbackPluginEngine({
    schema: schemaText, plugins: [
      new SchemaCRUDPlugin()
    ]
  })

  const metadata = pluginEngine.createResources()

  expect(metadata.getResolvers()).toMatchSnapshot();
});

test('field directives on relationship fields are mapped to schema', () => {
  const modelAST = `directive @test on FIELD_DEFINITION

""" @model """
type Note {
  id: ID!
  title: String!
  description: String
  """
  @oneToMany(field: 'note')
  """
  comments: [Comment]! @test
  """@oneToOne"""
  comment: Comment @test
}

""" @model """
type Comment {
  id: ID!
  text: String
  description: String
  note: Note! @test
}`

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelAST), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema();

  const noteType = schema.getType('Note') as GraphQLObjectType
  const { comments, comment } = noteType.getFields()

  // Note.comments field
  expect(comments.astNode?.directives).toHaveLength(1)
  expect(comments.astNode?.directives[0].name.value).toBe('test')

  // Note.comment field
  expect(comment.astNode?.directives).toHaveLength(1)
  expect(comment.astNode?.directives[0].name.value).toBe('test')

  const commentType = schema.getType('Comment') as GraphQLObjectType
  const { note } = commentType.getFields()

  // Note.comments field
  expect(note.astNode?.directives).toHaveLength(1)
  expect(note.astNode?.directives[0].name.value).toBe('test')

  expect(printSchemaWithDirectives(schema)).toMatchSnapshot();
})

test('schema does not generate filter input for unknown custom scalar', () => {
  const modelAST = `
  scalar MyCustomScalar
  """
  @model
  """
  type TypeWithCustomScalar {
    id: ID!
    customField: MyCustomScalar
  }`

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelAST), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema();

  expect(schema.getType('MyCustomScalarInput')).toBeUndefined()
})

test('schema does not override custom createdAt and updatedAt fields when model has @versioned annotation', () => {
  const fields = Object.values(metadataMap.fieldNames);
  for (const field of fields) {
    const modelAST = `
    """
    @model
    @versioned
    """
    type Entity {
      id: ID!
      ${field}: Int
    }`;


    try {
      const schemaGenerator = new SchemaCRUDPlugin()
      const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelAST), plugins: [schemaGenerator] })
      pluginEngine.createResources()
      expect(true).toBeFalsy(); // should not reach here
    } catch (error) {
      expect(error.message).toEqual(`Type "Entity" annotated with @versioned, cannot contain custom "${field}" field since it is generated automatically. Either remove the @versioned annotation, change the type of the field to "GraphbackTimestamp" or remove the field.`)
    }
  }
})

test('schema does throw an error when model annotated with @versioned contain custom createdAt or updatedAt fields having GraphbackTimestamp type', () => {
  const modelAST = `
    scalar GraphbackTimestamp
    """
    @model
    @versioned
    """
    type Entity1 {
      id: ID!
      createdAt: GraphbackTimestamp
      updatedAt: GraphbackTimestamp
    }

    """
    @model
    @versioned
    """
    type Entity2 {
      id: ID!
      createdAt: GraphbackTimestamp
    }

    """
    @model
    @versioned
    """
    type Entity3 {
      id: ID!
      updatedAt: GraphbackTimestamp
    }
    `;

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelAST), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema();

  expect(schema).toBeDefined()
})

test('Transient field is excluded from input types', () => {
  const modelAST = `
    """
    @model
    """
    type User {
      id: ID!
      name: String!
      """@transient"""
      generatedFullName: String
    }
    `;

  const schemaGenerator = new SchemaCRUDPlugin()
  const pluginEngine = new GraphbackPluginEngine({ schema: buildSchema(modelAST), plugins: [schemaGenerator] })
  const metadata = pluginEngine.createResources()
  const schema = metadata.getSchema();

  const createUserInput = assertInputObjectType(schema.getType('CreateUserInput'))
  expect(Object.keys(createUserInput.getFields())).toEqual(['id', 'name'])

  const mutateUserInput = assertInputObjectType(schema.getType('MutateUserInput'))
  expect(Object.keys(mutateUserInput.getFields())).toEqual(['id', 'name'])

  const userFilterInput = assertInputObjectType(schema.getType('UserFilter'))
  expect(Object.keys(userFilterInput.getFields())).toEqual(['id', 'name', 'and', 'or', 'not'])

  const userSubscriptionInput = assertInputObjectType(schema.getType('UserFilter'))
  expect(Object.keys(userSubscriptionInput.getFields())).toEqual(['id', 'name', 'and', 'or', 'not'])
})