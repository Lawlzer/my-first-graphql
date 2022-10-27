import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User description here!' })
export class User {
	@Field() // { name: 'Some ID thing' }
	id!: number;
	@Field()
	name!: string;
	@Field()
	email!: string;
}

@InputType()
export class UserInput implements Pick<User, 'name' | 'email'> {
	@Field()
	name!: string;
	@Field()
	email!: string;
}
