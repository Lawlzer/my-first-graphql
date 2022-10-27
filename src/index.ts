import 'reflect-metadata';

import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import path from 'path';
import { buildSchema } from 'type-graphql';

import { UsersResolver } from '~/users/users.resolvers';

const users = [
	{ id: 1, name: 'John Doe', email: 'johndoe@gmail.com' },
	{ id: 2, name: 'Jane Doe', email: 'janedoe@gmail.com' },
	{ id: 3, name: 'Mike Doe', email: 'mikedoe@gmail.com' },
];

type User = {
	id: number;
	name: string;
	email: string;
};

type UserInput = Pick<User, 'email' | 'name'>;

const getUser = (args: { id: number }): User | undefined => users.find((u) => u.id === args.id);

const getUsers = (): User[] => users;

const createUser = (args: { input: UserInput }): User => {
	const user = {
		id: users.length + 1,
		...args.input,
	};
	users.push(user);
	return user;
};

const updateUser = (args: { user: User }): User => {
	const index = users.findIndex((u) => u.id === args.user.id);
	const targetUser = users[index];
	if (targetUser) users[index] = args.user;
	return targetUser;
};

const root = {
	getUser,
	getUsers,
	createUser,
	updateUser,
};

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
			rootValue: root,
			graphiql: true,
		})
	);

	const PORT = 3000;

	app.listen(PORT);
	console.info(`Running a GraphQL API server at localhost:${PORT}/graphql`);
}
init();
