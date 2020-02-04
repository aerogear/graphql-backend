import { GraphbackCoreMetadata, GraphbackPlugin, ModelDefinition } from '@graphback/core';
import { GraphQLSchema } from 'graphql';
import { createRootResolversIndex } from './formatters/apollo';
import { generateCRUDResolvers, generateCustomCRUDResolvers } from './output/createResolvers';
import { createCustomOutputResolvers, createOutputResolvers, OutputResolvers } from './output/outputResolvers';
import { writeResolvers } from './writer/writeResolvers';

// TODO We are mixing apollo/non appollo stuff. WE should go generic.
export interface ResolverGeneratorPluginConfig {
    // TODO format is not used!
    format: 'ts' | 'js'

    /**
     * RelativePath for the output files created by generator
     */
    outputPath: string

    // Provides extension for graphql-code-generator types
    // generated for resolvers
    types?: {
        /**
         * Name of the resolver import
         * For example `Resolvers`
         */
        resolverRootType: string

        /**
         * Relative location for root resolver typings.
         * For example: '../../types'
         */
        resolverRootLocation: string
    }
}

const PLUGIN_NAME = 'CRUD_RESOLVER_GENERATOR';

/**
 * Graphback Resolver File Generator Plugin
 * 
 * Generates:
 * 
 * - default CRUD resolvers for all model types.
 * - blank resolver files to implements custom resolvers
 * 
 * And then writes to content to resolver files in the server.
 * 
 */
export class ResolverGeneratorPlugin extends GraphbackPlugin {

    private options: ResolverGeneratorPluginConfig;

    constructor(options: ResolverGeneratorPluginConfig) {
        super();
        // TODO: default options
        this.options = { ...options };
    }

    public getPluginName() {
        return PLUGIN_NAME;
    }

    public createResources(metadata: GraphbackCoreMetadata): void {
        const outputResolves = this.generateResolvers(metadata);
        if (outputResolves){
            writeResolvers(outputResolves, this.options);
        }
    }

    public generateResolvers(metadata: GraphbackCoreMetadata) {
        const schema = metadata.getSchema()
        const models = metadata.getModelDefinitions();
        if (models.length === 0) {
            this.logWarning("Provided schema has no models. Cannot generate resolvers")

            return undefined;
        }
        const generatedResolvers = generateCRUDResolvers(models);
        const customResolvers = generateCustomCRUDResolvers(schema, models, generatedResolvers);

        const generatedResolverGroup = createOutputResolvers(generatedResolvers, this.options);
        const customResolverGroup = createCustomOutputResolvers(customResolvers, this.options.format);
        const rootResolverIndex = createRootResolversIndex(this.options.format);

        // tslint:disable-next-line: no-unnecessary-local-variable
        const outputResolvers: OutputResolvers = {
            generated: generatedResolverGroup,
            custom: customResolverGroup,
            index: rootResolverIndex
        }

        return outputResolvers;
    }
}