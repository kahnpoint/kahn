/**
 * Merge two or more classes.
 * Usage:
 * const NewClass = mixin(MyClass, MyMixin)
 *
 * Must be called recursively to mixin multiple classes,
 * in order for typescript to infer the correct types.
 * const NewClass = mixin(mixin(MyClass, MyMixin1), MyMixin2)
 */

type Constructor<T = {}> = new (...args: any[]) => T

export function mixin<T extends Constructor, U extends Constructor>(
	base: T,
	mixin: U
): new (...args: any[]) => InstanceType<T> & InstanceType<U> {
	return class extends base {
		constructor(...args: any[]) {
			super(...args)
			Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
				if (name !== 'constructor') {
					Object.defineProperty(this, name, {
						value: mixin.prototype[name],
						enumerable: false,
					})
				}
			})
		}
	} as any
}
