/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import { ApolloServer } from 'apollo-server-fastify';
import { buildGraphbackAPI } from 'graphback';
import { createMongoDbProvider } from '@graphback/runtime-mongo';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { loadConfigSync } from 'graphql-config';
import { connectDB } from './db';
import { noteResolvers } from './resolvers/noteResolvers';

async function start() {
  const app = fastify();

  app.register(fastifyCors as any);

  const graphbackExtension = 'graphback';
  const config = loadConfigSync({
    extensions: [
      () => ({
        name: graphbackExtension
      })
    ]
  });

  const projectConfig = config.getDefault();
  const graphbackConfig = projectConfig.extension(graphbackExtension);

  const modelDefs = projectConfig.loadSchemaSync(graphbackConfig.model);

  const db = await connectDB();

  const { typeDefs, resolvers, contextCreator } = buildGraphbackAPI(modelDefs, {
    dataProviderCreator: createMongoDbProvider(db)
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: [resolvers, noteResolvers],
    context: contextCreator
  });

  app.register(apolloServer.createHandler());
  apolloServer.installSubscriptionHandlers(app.server);

  app.listen(4000, () => {
    console.log(`🚀  Server ready at http://localhost:4000/graphql`);
  });
}

start().catch((err: any) => console.log(err));
