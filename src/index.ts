import 'reflect-metadata';

import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import playground from 'graphql-playground-middleware-express';
import path from 'path';
import { buildSchema } from 'type-graphql';

import { UsersResolver } from '~/users/users.resolvers';

async function init() {
	const schema = await buildSchema({
		resolvers: [UsersResolver], // __dirname + "/resolvers/**/*.{ts,js}" & __dirname + "/resolver/**/*.{ts,js}"

		emitSchemaFile: process.env.NODE_ENV !== 'production' && path.resolve(process.cwd(), 'temp', 'schema.gql'),
	});
	const app = express();
	app.use(
		'/graphql',
		graphqlHTTP({
			schema: schema,
			// rootValue: root,
		})
	);

	app.get('/playground', playground({ endpoint: '/graphql' }));

	const PORT = 3000;

	app.listen(PORT);
	console.info(`Running a GraphQL API server at localhost:${PORT}/graphql`);
}
init();
