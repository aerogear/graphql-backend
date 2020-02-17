 
import { getBaseType, GraphbackCoreMetadata, GraphbackPlugin, ModelDefinition, getInputTypeName, getFieldName, GraphbackOperationType } from '@graphback/core'
import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLField, isObjectType, getNullableType, GraphQLNonNull, GraphQLList } from 'graphql';


/**
 * Configuration for Schema generator CRUD plugin
 */
export interface OffixPluginConfig {

    /**
     * RelativePath for the output files created by generator
     */
    outputPath: string


    /*
     * RelativePath for the output files created by generator
     */
    // TODO separate annotation for delta queries should be used for more granular support
    generateDeltaQueries: boolean

    /**
     * Delta resolvers format
     */
    deltaResolverFormat: 'ts' | 'js' | 'graphql',

}

export const SCHEMA_CRUD_PLUGIN_NAME = "SchemaCRUD";

/**
 * Ofix plugin
 * 
 * Plugin is enabled by """ @datasync """ annotation
 * It will add version field to the schema and also generate diffQueries
 */
export class OffixPlugin extends GraphbackPlugin {

    private pluginConfig: OffixPluginConfig;

    public constructor(pluginConfig?: OffixPluginConfig) {
        super()
        this.pluginConfig = Object.assign({ format: 'graphql', outputFileName: 'schema' }, pluginConfig);
        if (!pluginConfig.outputPath) {
            throw new Error("schema plugin requires outputPath parameter")
        }
    }

    public transformSchema(metadata: GraphbackCoreMetadata): GraphQLSchema {
        const schema = metadata.getSchema()
        const models = metadata.getModelDefinitions();
        if (models.length === 0) {
            this.logWarning("Provided schema has no models. Returning original schema without any changes.")

            return schema;
        }

        if (this.pluginConfig.generateDeltaQueries) {
            // TODO generate delta queries
            // TODO generate delta resolvers (maybe separate plugin for delta?)
        }

        const versionedTypes = [];
        models.forEach((model: ModelDefinition) => {
            // TODO use `versioned` marker to check if we should add version
            const config = model.graphqlType.toConfig();
            const modifiedType = new GraphQLObjectType({
                ...config,
                fields: {
                    ...config.fields,
                    version: { type: GraphQLInt },
                },
            });
            versionedTypes.push(modifiedType);

            const inputType = schema.getType(getInputTypeName(model.graphqlType.name)) as GraphQLInputObjectType
            if (inputType) {
                const inputConfig: GraphQLInputObjectTypeConfig = inputType.toConfig();
                const modifiedInputType = new GraphQLInputObjectType({
                    ...inputConfig,
                    fields: {
                        ...config.fields,
                        version: { type: GraphQLInt },
                    }
                });
                versionedTypes.push(modifiedInputType);
            }
        })

        const newVersionedSchema = new GraphQLSchema({
            query: undefined,
            types: versionedTypes
        });

        return mergeSchemas({ schemas: [newVersionedSchema, schema] });
    }

    public createResources(metadata: GraphbackCoreMetadata): void {
        // Schema plugin is going to create schem
        // No work to be done
    }

    public getPluginName() {
        return SCHEMA_CRUD_PLUGIN_NAME;
    }
}
