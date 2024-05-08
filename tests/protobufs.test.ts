import { test, expect } from 'vitest'
//import protobufjs from "protobufjs";

import { Message, Type, Field, OneOf } from 'protobufjs/index.ts' // respectively "./node_modules/protobufjs/light.js"

export class AwesomeSubMessage extends Message<AwesomeSubMessage> {
	@Field.d(1, 'string')
	public awesomeString: string

	constructor(properties?: Partial<AwesomeSubMessage>) {
		super(properties)
	}
}

export enum AwesomeEnum {
	ONE = 1,
	TWO = 2,
}

/*
@Type.d("SuperAwesomeMessage")
export class AwesomeMessage extends Message<AwesomeMessage> {

  //@Field.d(1, "string", "optional", "awesome default string")
  @Field.d(1,"string", "optional", "awesome default string")
  public awesomeField: string;

  @Field.d(2, AwesomeSubMessage)
  public awesomeSubMessage: AwesomeSubMessage;

  @Field.d(3, AwesomeEnum, "optional", AwesomeEnum.ONE)
  public awesomeEnum: AwesomeEnum;

  @OneOf.d("awesomeSubMessage", "awesomeEnum")
  public which: string;

}
*/

test('protobufs', async () => {
	// example code
	//const message = new AwesomeSubMessage({ awesomeString: "hello" });
	//expect(message.awesomeString).toBe("hello");
	//const buffer  = AwesomeSubMessage.encode(message).finish();
	//const decoded = AwesomeSubMessage.decode(buffer);
	////console.log(decoded.awesomeString); // "hello"
	//expect(decoded.awesomeString).toBe("hello");
})
