// package: christiangeorgelucas.protobuf_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Location extends jspb.Message {
  getLine(): number;
  setLine(value: number): void;

  getColumn(): number;
  setColumn(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Location.AsObject;
  static toObject(includeInstance: boolean, msg: Location): Location.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Location, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Location;
  static deserializeBinaryFromReader(message: Location, reader: jspb.BinaryReader): Location;
}

export namespace Location {
  export type AsObject = {
    line: number,
    column: number,
  }
}

export class ProtoError extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): Location | undefined;
  setLocation(value?: Location): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProtoError.AsObject;
  static toObject(includeInstance: boolean, msg: ProtoError): ProtoError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProtoError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProtoError;
  static deserializeBinaryFromReader(message: ProtoError, reader: jspb.BinaryReader): ProtoError;
}

export namespace ProtoError {
  export type AsObject = {
    message: string,
    location?: Location.AsObject,
  }
}

export class OptionEntry extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OptionEntry.AsObject;
  static toObject(includeInstance: boolean, msg: OptionEntry): OptionEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OptionEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OptionEntry;
  static deserializeBinaryFromReader(message: OptionEntry, reader: jspb.BinaryReader): OptionEntry;
}

export namespace OptionEntry {
  export type AsObject = {
    name: string,
    value: string,
  }
}

export class FieldInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getNumber(): number;
  setNumber(value: number): void;

  getLabel(): string;
  setLabel(value: string): void;

  getIsMap(): boolean;
  setIsMap(value: boolean): void;

  getMapKeyType(): string;
  setMapKeyType(value: string): void;

  getExplicitDefault(): boolean;
  setExplicitDefault(value: boolean): void;

  getDefaultValue(): string;
  setDefaultValue(value: string): void;

  getOneofName(): string;
  setOneofName(value: string): void;

  clearOptionsList(): void;
  getOptionsList(): Array<OptionEntry>;
  setOptionsList(value: Array<OptionEntry>): void;
  addOptions(value?: OptionEntry, index?: number): OptionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FieldInfo): FieldInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FieldInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldInfo;
  static deserializeBinaryFromReader(message: FieldInfo, reader: jspb.BinaryReader): FieldInfo;
}

export namespace FieldInfo {
  export type AsObject = {
    name: string,
    type: string,
    number: number,
    label: string,
    isMap: boolean,
    mapKeyType: string,
    explicitDefault: boolean,
    defaultValue: string,
    oneofName: string,
    optionsList: Array<OptionEntry.AsObject>,
  }
}

export class MessageSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  clearNestedMessageNamesList(): void;
  getNestedMessageNamesList(): Array<string>;
  setNestedMessageNamesList(value: Array<string>): void;
  addNestedMessageNames(value: string, index?: number): string;

  clearNestedEnumNamesList(): void;
  getNestedEnumNamesList(): Array<string>;
  setNestedEnumNamesList(value: Array<string>): void;
  addNestedEnumNames(value: string, index?: number): string;

  getFieldCount(): number;
  setFieldCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageSummary.AsObject;
  static toObject(includeInstance: boolean, msg: MessageSummary): MessageSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageSummary;
  static deserializeBinaryFromReader(message: MessageSummary, reader: jspb.BinaryReader): MessageSummary;
}

export namespace MessageSummary {
  export type AsObject = {
    name: string,
    fullName: string,
    nestedMessageNamesList: Array<string>,
    nestedEnumNamesList: Array<string>,
    fieldCount: number,
  }
}

export class EnumValueInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getNumber(): number;
  setNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnumValueInfo.AsObject;
  static toObject(includeInstance: boolean, msg: EnumValueInfo): EnumValueInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnumValueInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnumValueInfo;
  static deserializeBinaryFromReader(message: EnumValueInfo, reader: jspb.BinaryReader): EnumValueInfo;
}

export namespace EnumValueInfo {
  export type AsObject = {
    name: string,
    number: number,
  }
}

export class EnumSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  clearValuesList(): void;
  getValuesList(): Array<EnumValueInfo>;
  setValuesList(value: Array<EnumValueInfo>): void;
  addValues(value?: EnumValueInfo, index?: number): EnumValueInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnumSummary.AsObject;
  static toObject(includeInstance: boolean, msg: EnumSummary): EnumSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnumSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnumSummary;
  static deserializeBinaryFromReader(message: EnumSummary, reader: jspb.BinaryReader): EnumSummary;
}

export namespace EnumSummary {
  export type AsObject = {
    name: string,
    fullName: string,
    valuesList: Array<EnumValueInfo.AsObject>,
  }
}

export class MethodInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getInputType(): string;
  setInputType(value: string): void;

  getOutputType(): string;
  setOutputType(value: string): void;

  getClientStreaming(): boolean;
  setClientStreaming(value: boolean): void;

  getServerStreaming(): boolean;
  setServerStreaming(value: boolean): void;

  clearOptionsList(): void;
  getOptionsList(): Array<OptionEntry>;
  setOptionsList(value: Array<OptionEntry>): void;
  addOptions(value?: OptionEntry, index?: number): OptionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MethodInfo): MethodInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodInfo;
  static deserializeBinaryFromReader(message: MethodInfo, reader: jspb.BinaryReader): MethodInfo;
}

export namespace MethodInfo {
  export type AsObject = {
    name: string,
    inputType: string,
    outputType: string,
    clientStreaming: boolean,
    serverStreaming: boolean,
    optionsList: Array<OptionEntry.AsObject>,
  }
}

export class ServiceSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  clearMethodsList(): void;
  getMethodsList(): Array<MethodInfo>;
  setMethodsList(value: Array<MethodInfo>): void;
  addMethods(value?: MethodInfo, index?: number): MethodInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceSummary): ServiceSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceSummary;
  static deserializeBinaryFromReader(message: ServiceSummary, reader: jspb.BinaryReader): ServiceSummary;
}

export namespace ServiceSummary {
  export type AsObject = {
    name: string,
    fullName: string,
    methodsList: Array<MethodInfo.AsObject>,
  }
}

export class ReservedRange extends jspb.Message {
  getStart(): number;
  setStart(value: number): void;

  getEnd(): number;
  setEnd(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReservedRange.AsObject;
  static toObject(includeInstance: boolean, msg: ReservedRange): ReservedRange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReservedRange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReservedRange;
  static deserializeBinaryFromReader(message: ReservedRange, reader: jspb.BinaryReader): ReservedRange;
}

export namespace ReservedRange {
  export type AsObject = {
    start: number,
    end: number,
  }
}

export class SchemaInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaInput.AsObject;
  static toObject(includeInstance: boolean, msg: SchemaInput): SchemaInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SchemaInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SchemaInput;
  static deserializeBinaryFromReader(message: SchemaInput, reader: jspb.BinaryReader): SchemaInput;
}

export namespace SchemaInput {
  export type AsObject = {
    schema: string,
  }
}

export class MessageNameInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getMessageName(): string;
  setMessageName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageNameInput.AsObject;
  static toObject(includeInstance: boolean, msg: MessageNameInput): MessageNameInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageNameInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageNameInput;
  static deserializeBinaryFromReader(message: MessageNameInput, reader: jspb.BinaryReader): MessageNameInput;
}

export namespace MessageNameInput {
  export type AsObject = {
    schema: string,
    messageName: string,
  }
}

export class ParseSchemaResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  getSyntax(): string;
  setSyntax(value: string): void;

  getPackage(): string;
  setPackage(value: string): void;

  clearImportsList(): void;
  getImportsList(): Array<string>;
  setImportsList(value: Array<string>): void;
  addImports(value: string, index?: number): string;

  clearMessagesList(): void;
  getMessagesList(): Array<MessageSummary>;
  setMessagesList(value: Array<MessageSummary>): void;
  addMessages(value?: MessageSummary, index?: number): MessageSummary;

  clearEnumsList(): void;
  getEnumsList(): Array<EnumSummary>;
  setEnumsList(value: Array<EnumSummary>): void;
  addEnums(value?: EnumSummary, index?: number): EnumSummary;

  clearServicesList(): void;
  getServicesList(): Array<ServiceSummary>;
  setServicesList(value: Array<ServiceSummary>): void;
  addServices(value?: ServiceSummary, index?: number): ServiceSummary;

  clearFileOptionsList(): void;
  getFileOptionsList(): Array<OptionEntry>;
  setFileOptionsList(value: Array<OptionEntry>): void;
  addFileOptions(value?: OptionEntry, index?: number): OptionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSchemaResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSchemaResult): ParseSchemaResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSchemaResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSchemaResult;
  static deserializeBinaryFromReader(message: ParseSchemaResult, reader: jspb.BinaryReader): ParseSchemaResult;
}

export namespace ParseSchemaResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    syntax: string,
    pb_package: string,
    importsList: Array<string>,
    messagesList: Array<MessageSummary.AsObject>,
    enumsList: Array<EnumSummary.AsObject>,
    servicesList: Array<ServiceSummary.AsObject>,
    fileOptionsList: Array<OptionEntry.AsObject>,
  }
}

export class ValidateSchemaResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSchemaResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSchemaResult): ValidateSchemaResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateSchemaResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSchemaResult;
  static deserializeBinaryFromReader(message: ValidateSchemaResult, reader: jspb.BinaryReader): ValidateSchemaResult;
}

export namespace ValidateSchemaResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
  }
}

export class DetectSyntaxVersionResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  getSyntax(): string;
  setSyntax(value: string): void;

  getDeclared(): boolean;
  setDeclared(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectSyntaxVersionResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectSyntaxVersionResult): DetectSyntaxVersionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectSyntaxVersionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectSyntaxVersionResult;
  static deserializeBinaryFromReader(message: DetectSyntaxVersionResult, reader: jspb.BinaryReader): DetectSyntaxVersionResult;
}

export namespace DetectSyntaxVersionResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    syntax: string,
    declared: boolean,
  }
}

export class ListMessagesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  clearMessagesList(): void;
  getMessagesList(): Array<MessageSummary>;
  setMessagesList(value: Array<MessageSummary>): void;
  addMessages(value?: MessageSummary, index?: number): MessageSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMessagesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListMessagesResult): ListMessagesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListMessagesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMessagesResult;
  static deserializeBinaryFromReader(message: ListMessagesResult, reader: jspb.BinaryReader): ListMessagesResult;
}

export namespace ListMessagesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    messagesList: Array<MessageSummary.AsObject>,
  }
}

export class GetMessageFieldsResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<FieldInfo>;
  setFieldsList(value: Array<FieldInfo>): void;
  addFields(value?: FieldInfo, index?: number): FieldInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessageFieldsResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessageFieldsResult): GetMessageFieldsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMessageFieldsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessageFieldsResult;
  static deserializeBinaryFromReader(message: GetMessageFieldsResult, reader: jspb.BinaryReader): GetMessageFieldsResult;
}

export namespace GetMessageFieldsResult {
  export type AsObject = {
    found: boolean,
    error: string,
    fullName: string,
    fieldsList: Array<FieldInfo.AsObject>,
  }
}

export class ListEnumsResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  clearEnumsList(): void;
  getEnumsList(): Array<EnumSummary>;
  setEnumsList(value: Array<EnumSummary>): void;
  addEnums(value?: EnumSummary, index?: number): EnumSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEnumsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListEnumsResult): ListEnumsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListEnumsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListEnumsResult;
  static deserializeBinaryFromReader(message: ListEnumsResult, reader: jspb.BinaryReader): ListEnumsResult;
}

export namespace ListEnumsResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    enumsList: Array<EnumSummary.AsObject>,
  }
}

export class ListServicesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  clearServicesList(): void;
  getServicesList(): Array<ServiceSummary>;
  setServicesList(value: Array<ServiceSummary>): void;
  addServices(value?: ServiceSummary, index?: number): ServiceSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListServicesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListServicesResult): ListServicesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListServicesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListServicesResult;
  static deserializeBinaryFromReader(message: ListServicesResult, reader: jspb.BinaryReader): ListServicesResult;
}

export namespace ListServicesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    servicesList: Array<ServiceSummary.AsObject>,
  }
}

export class ServiceNameInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getServiceName(): string;
  setServiceName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceNameInput.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceNameInput): ServiceNameInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceNameInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceNameInput;
  static deserializeBinaryFromReader(message: ServiceNameInput, reader: jspb.BinaryReader): ServiceNameInput;
}

export namespace ServiceNameInput {
  export type AsObject = {
    schema: string,
    serviceName: string,
  }
}

export class GetServiceMethodsResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  clearMethodsList(): void;
  getMethodsList(): Array<MethodInfo>;
  setMethodsList(value: Array<MethodInfo>): void;
  addMethods(value?: MethodInfo, index?: number): MethodInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServiceMethodsResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetServiceMethodsResult): GetServiceMethodsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetServiceMethodsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServiceMethodsResult;
  static deserializeBinaryFromReader(message: GetServiceMethodsResult, reader: jspb.BinaryReader): GetServiceMethodsResult;
}

export namespace GetServiceMethodsResult {
  export type AsObject = {
    found: boolean,
    error: string,
    fullName: string,
    methodsList: Array<MethodInfo.AsObject>,
  }
}

export class ListFileOptionsResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  clearOptionsList(): void;
  getOptionsList(): Array<OptionEntry>;
  setOptionsList(value: Array<OptionEntry>): void;
  addOptions(value?: OptionEntry, index?: number): OptionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFileOptionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListFileOptionsResult): ListFileOptionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListFileOptionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFileOptionsResult;
  static deserializeBinaryFromReader(message: ListFileOptionsResult, reader: jspb.BinaryReader): ListFileOptionsResult;
}

export namespace ListFileOptionsResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    optionsList: Array<OptionEntry.AsObject>,
  }
}

export class ListMessageOptionsResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearOptionsList(): void;
  getOptionsList(): Array<OptionEntry>;
  setOptionsList(value: Array<OptionEntry>): void;
  addOptions(value?: OptionEntry, index?: number): OptionEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMessageOptionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListMessageOptionsResult): ListMessageOptionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListMessageOptionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMessageOptionsResult;
  static deserializeBinaryFromReader(message: ListMessageOptionsResult, reader: jspb.BinaryReader): ListMessageOptionsResult;
}

export namespace ListMessageOptionsResult {
  export type AsObject = {
    found: boolean,
    error: string,
    optionsList: Array<OptionEntry.AsObject>,
  }
}

export class GetPackageInfoResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  getPackage(): string;
  setPackage(value: string): void;

  clearImportsList(): void;
  getImportsList(): Array<string>;
  setImportsList(value: Array<string>): void;
  addImports(value: string, index?: number): string;

  getSyntax(): string;
  setSyntax(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPackageInfoResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetPackageInfoResult): GetPackageInfoResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPackageInfoResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPackageInfoResult;
  static deserializeBinaryFromReader(message: GetPackageInfoResult, reader: jspb.BinaryReader): GetPackageInfoResult;
}

export namespace GetPackageInfoResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    pb_package: string,
    importsList: Array<string>,
    syntax: string,
  }
}

export class ResolveTypeReferenceInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getTypeName(): string;
  setTypeName(value: string): void;

  getContextMessage(): string;
  setContextMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveTypeReferenceInput.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveTypeReferenceInput): ResolveTypeReferenceInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveTypeReferenceInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveTypeReferenceInput;
  static deserializeBinaryFromReader(message: ResolveTypeReferenceInput, reader: jspb.BinaryReader): ResolveTypeReferenceInput;
}

export namespace ResolveTypeReferenceInput {
  export type AsObject = {
    schema: string,
    typeName: string,
    contextMessage: string,
  }
}

export class ResolveTypeReferenceResult extends jspb.Message {
  getResolved(): boolean;
  setResolved(value: boolean): void;

  getFullyQualifiedName(): string;
  setFullyQualifiedName(value: string): void;

  getKind(): string;
  setKind(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveTypeReferenceResult.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveTypeReferenceResult): ResolveTypeReferenceResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveTypeReferenceResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveTypeReferenceResult;
  static deserializeBinaryFromReader(message: ResolveTypeReferenceResult, reader: jspb.BinaryReader): ResolveTypeReferenceResult;
}

export namespace ResolveTypeReferenceResult {
  export type AsObject = {
    resolved: boolean,
    fullyQualifiedName: string,
    kind: string,
    error: string,
  }
}

export class ListFieldNumbersResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<FieldInfo>;
  setFieldsList(value: Array<FieldInfo>): void;
  addFields(value?: FieldInfo, index?: number): FieldInfo;

  clearReservedRangesList(): void;
  getReservedRangesList(): Array<ReservedRange>;
  setReservedRangesList(value: Array<ReservedRange>): void;
  addReservedRanges(value?: ReservedRange, index?: number): ReservedRange;

  clearReservedNamesList(): void;
  getReservedNamesList(): Array<string>;
  setReservedNamesList(value: Array<string>): void;
  addReservedNames(value: string, index?: number): string;

  clearConflictingNumbersList(): void;
  getConflictingNumbersList(): Array<number>;
  setConflictingNumbersList(value: Array<number>): void;
  addConflictingNumbers(value: number, index?: number): number;

  clearConflictingNamesList(): void;
  getConflictingNamesList(): Array<string>;
  setConflictingNamesList(value: Array<string>): void;
  addConflictingNames(value: string, index?: number): string;

  getHasConflicts(): boolean;
  setHasConflicts(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFieldNumbersResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListFieldNumbersResult): ListFieldNumbersResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListFieldNumbersResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFieldNumbersResult;
  static deserializeBinaryFromReader(message: ListFieldNumbersResult, reader: jspb.BinaryReader): ListFieldNumbersResult;
}

export namespace ListFieldNumbersResult {
  export type AsObject = {
    found: boolean,
    error: string,
    fieldsList: Array<FieldInfo.AsObject>,
    reservedRangesList: Array<ReservedRange.AsObject>,
    reservedNamesList: Array<string>,
    conflictingNumbersList: Array<number>,
    conflictingNamesList: Array<string>,
    hasConflicts: boolean,
  }
}

export class ToJsonDescriptorResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  getDescriptorJson(): string;
  setDescriptorJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ToJsonDescriptorResult.AsObject;
  static toObject(includeInstance: boolean, msg: ToJsonDescriptorResult): ToJsonDescriptorResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ToJsonDescriptorResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ToJsonDescriptorResult;
  static deserializeBinaryFromReader(message: ToJsonDescriptorResult, reader: jspb.BinaryReader): ToJsonDescriptorResult;
}

export namespace ToJsonDescriptorResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    descriptorJson: string,
  }
}

export class SchemaSummaryResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ProtoError>;
  setErrorsList(value: Array<ProtoError>): void;
  addErrors(value?: ProtoError, index?: number): ProtoError;

  getPackage(): string;
  setPackage(value: string): void;

  getSyntax(): string;
  setSyntax(value: string): void;

  getMessageCount(): number;
  setMessageCount(value: number): void;

  getEnumCount(): number;
  setEnumCount(value: number): void;

  getServiceCount(): number;
  setServiceCount(value: number): void;

  getMethodCount(): number;
  setMethodCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaSummaryResult.AsObject;
  static toObject(includeInstance: boolean, msg: SchemaSummaryResult): SchemaSummaryResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SchemaSummaryResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SchemaSummaryResult;
  static deserializeBinaryFromReader(message: SchemaSummaryResult, reader: jspb.BinaryReader): SchemaSummaryResult;
}

export namespace SchemaSummaryResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<ProtoError.AsObject>,
    pb_package: string,
    syntax: string,
    messageCount: number,
    enumCount: number,
    serviceCount: number,
    methodCount: number,
  }
}

export class EncodeMessageInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getMessageName(): string;
  setMessageName(value: string): void;

  getJsonValue(): string;
  setJsonValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodeMessageInput.AsObject;
  static toObject(includeInstance: boolean, msg: EncodeMessageInput): EncodeMessageInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodeMessageInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodeMessageInput;
  static deserializeBinaryFromReader(message: EncodeMessageInput, reader: jspb.BinaryReader): EncodeMessageInput;
}

export namespace EncodeMessageInput {
  export type AsObject = {
    schema: string,
    messageName: string,
    jsonValue: string,
  }
}

export class EncodeMessageResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getWireBytesBase64(): string;
  setWireBytesBase64(value: string): void;

  getByteLength(): number;
  setByteLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodeMessageResult.AsObject;
  static toObject(includeInstance: boolean, msg: EncodeMessageResult): EncodeMessageResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodeMessageResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodeMessageResult;
  static deserializeBinaryFromReader(message: EncodeMessageResult, reader: jspb.BinaryReader): EncodeMessageResult;
}

export namespace EncodeMessageResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    wireBytesBase64: string,
    byteLength: number,
  }
}

export class DecodeMessageInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getMessageName(): string;
  setMessageName(value: string): void;

  getWireBytesBase64(): string;
  setWireBytesBase64(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeMessageInput.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeMessageInput): DecodeMessageInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeMessageInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeMessageInput;
  static deserializeBinaryFromReader(message: DecodeMessageInput, reader: jspb.BinaryReader): DecodeMessageInput;
}

export namespace DecodeMessageInput {
  export type AsObject = {
    schema: string,
    messageName: string,
    wireBytesBase64: string,
  }
}

export class DecodeMessageResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getJsonValue(): string;
  setJsonValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeMessageResult.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeMessageResult): DecodeMessageResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeMessageResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeMessageResult;
  static deserializeBinaryFromReader(message: DecodeMessageResult, reader: jspb.BinaryReader): DecodeMessageResult;
}

export namespace DecodeMessageResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    jsonValue: string,
  }
}

