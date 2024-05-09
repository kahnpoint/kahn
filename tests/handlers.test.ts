import {test, expect} from 'vitest'

enum TestEnum {
	A = 'A',
	B = 'B',
	C = 'C',
}

class Handler {
  private handlers: Map<TestEnum, Function>;

  constructor() {
    this.handlers = new Map();
  }

  route(key: TestEnum, handler: Function): Handler {
    this.handlers.set(key, handler);
    return this; // for method chaining
  }

  handle(key: TestEnum, ...args: any[]): any {
    const handler = this.handlers.get(key);
    if (!handler) {
      throw new Error(`No handler found for key: ${key}`);
    }
    return handler(...args);
  }
}

// Usage:
const aHandler = () => console.log('Handling A');
const bHandler = () => console.log('Handling B');
const cHandler = () => console.log('Handling C');

const handler = new Handler()
	.route(TestEnum.A, aHandler)
	.route(TestEnum.B, bHandler)
	.route(TestEnum.C, cHandler);


test('handler', async () => {
	
	handler.handle(TestEnum.A)

})