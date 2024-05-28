import * as proto from 'protobufjs/light'

/**
 * Type.d(typeName?: string)   (optional)
 * annotates a class as a protobuf message type. If typeName is not specified, the constructor's runtime function name is used for the reflected type.
 */
export const type = proto.Type.d

/**
 * Field.d<T>(fieldId: number, fieldType: string | Constructor<T>, fieldRule?: "optional" | "required" | "repeated", defaultValue?: T)
 * annotates a property as a protobuf field with the specified id and protobuf type.
 */
export const field = proto.Field.d

/**
 * MapField.d<T extends { [key: string]: any }>(fieldId: number, fieldKeyType: string, fieldValueType. string | Constructor<{}>)
 * annotates a property as a protobuf map field with the specified id, protobuf key and value type.
 */
export const oneOf = proto.OneOf.d

/**
 * OneOf.d<T extends string>(...fieldNames: string[])
	annotates a property as a protobuf oneof covering the specified fields.
*/
export const map = proto.MapField.d
