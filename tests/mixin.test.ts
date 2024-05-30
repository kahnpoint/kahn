import { test, expect } from 'bun:test'
import { mixin } from '@/misc'

// usage:
class User {
	name: string

	constructor(name: string) {
		this.name = name
	}
}

class sayHiMixin {
	sayHi() {
		console.log(`Hello ${this.name}`)
	}
}

class sayByeMixin {
	sayBye() {
		console.log(`Goodbye ${this.name}`)
	}
}

// test 1 : intermediary classes
const UserWithOneMixin = mixin(User, sayHiMixin)
const UserWithBothMixins = mixin(UserWithOneMixin, sayByeMixin)

// test 2 : sequenced mixins
const UserWithBothMixinsSequenced = mixin(mixin(User, sayHiMixin), sayByeMixin)

test('mixin', async () => {
	const user1 = new UserWithBothMixins('Dude1')
	expect(user1.name).toBe('Dude1')
	user1.sayHi()
	user1.sayBye()

	const user2 = new UserWithBothMixinsSequenced('Dude2')
	expect(user2.name).toBe('Dude2')

	user2.sayHi()
	user2.sayBye()
})
