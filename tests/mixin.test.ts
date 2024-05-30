import { test, expect } from 'bun:test'

/**
 * Mixin a set of classes into a base class.
 * Usage:
 * mixin(MyClass, MyMixin1, MyMixin2, ...);
 */

type Constructor<T = {}> = new (...args: any[]) => T

function mixin<T extends Constructor, U extends Constructor[]>(
	base: T,
	...mixins: U
): T & InstanceType<U[number]> {
	mixins.forEach((mixin) => {
		Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
			if (name !== 'constructor') {
				base.prototype[name] = mixin.prototype[name]
			}
		})
	})

	return base as T & InstanceType<U[number]>
}

// usage:
class User {
	name: string

	constructor(name: string) {
		this.name = name
	}
}

const sayHiMixin = class {
	sayHi() {
		console.log(`Hello ${this.name}`)
	}
	sayBye() {
		console.log(`Bye ${this.name}`)
	}
}

const UserWithMixin = mixin(User, sayHiMixin)

test('mixin', async () => {
	const user = new UserWithMixin('Dude')
	expect(user.name).toBe('Dude')
	//console.log(user.sayHi())
})
