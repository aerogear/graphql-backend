//tslint:disable: no-string-literal
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { IGraphQLConfig } from 'graphql-config';
import { prompt as ask } from 'inquirer'
import { safeDump } from 'js-yaml'
import { logInfo } from '../utils';

const configFilesPath = `${__dirname}/resources/config`

const dockerFilesPath = `${__dirname}/resources/docker`
/**
 * Different database choices
 */
const getConfig = (database: string) => {
  if (database === 'pg') {
    return [readFileSync(`${configFilesPath}/postgres.json`, 'utf8'), readFileSync(`${dockerFilesPath}/postgres.yml`, 'utf8')]
  } else if (database === 'MongoDB') {
    return ["", readFileSync(`${dockerFilesPath}/mongodb.yml`, 'utf8')]
  } else if (database === 'sqlite3') {
    return [readFileSync(`${configFilesPath}/sqlite3.json`, 'utf8'), undefined]
  } else {
    return undefined
  }
}

const databases = [
  'PostgreSQL',
  'MongoDB'
]

export const chooseDatabase = async (): Promise<string> => {
  const { database } = await ask({
    type: 'list',
    name: 'database',
    message: 'Choose your database',
    choices: databases,
    filter: (input: string) => {
      if (input === 'PostgreSQL') {
        return 'pg'
      } else {
        return input
      }
    }
  })

  return database
}

export const askForClient = async (): Promise<boolean> => {
  const { client } = await ask({
    type: 'confirm',
    name: 'client',
    message: 'Do you want to generate client-side queries?'
  });

  return client
};

/**
 * Create config file with db info
 */
export const createConfig = async (database: string, client: boolean) => {
  const configPath = `${process.cwd()}/.graphqlrc.yml`;

  if (existsSync(configPath)) {
    logInfo("Graphback config already exist in following location and it cannot be overriden")
  }

  const dockerComposePath = `${process.cwd()}/docker-compose.yml`;
  const [dbConfig, dockerCompose] = getConfig(database);

  const graphqlConfig: IGraphQLConfig = {
    schema: './src/schema/*.graphql',
    documents: './client/src/graphql/**/*.graphql',
    extensions: {
      graphback: {
        "model": "./model",
        "crud": {
          "create": true,
          "update": true,
          "findAll": true,
          "find": true,
          "delete": false,
          "subCreate": false,
          "subUpdate": false,
          "subDelete": false
        },
        "plugins": {
          "graphback-schema": {
            "format": "graphql",
            "outputPath": "./src/schema"
          },
          "graphback-resolvers": {
            "format": "ts",
            "outputPath": "./src/resolvers"
          }
        }
      }
    }
  };

  if(database === "pg") {
    graphqlConfig.extensions.graphback.dbmigrations = {
      "connection": JSON.parse(dbConfig),
      "client": database
    };
  }

  if (client) {
    //Add client extension
    graphqlConfig.extensions.graphback.plugins["graphback-client"] = {
      "format": "graphql",
      "outputPath": "./client/src/graphql"
    }
  }

  if (dockerCompose) {
    writeFileSync(dockerComposePath, dockerCompose)
  }

  const finalConfig = `## GraphQL Config Generated by Graphback
## Please review configuration and adjust it for your own project
${safeDump(graphqlConfig)}
`;

  writeFileSync(configPath, finalConfig)
};
