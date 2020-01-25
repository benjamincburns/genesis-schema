declare module "json-ptr" {
    namespace jsonPtr {
        class JsonPointer {
            readonly path: string[];
            readonly pointer: string;
            readonly uriFragmentIdentifier: string;

            has(target: any): any | undefined;
            get(target: JsonPointer | string | string[]): any | undefined;
            set(target: any, value: any, force?: boolean): any | undefined;
            concat(target: JsonPointer | string | string[]): JsonPointer;
        }

        class JsonReference {
            $ref: string;
            constructor(pointer: JsonPointer | string | string[]);
            resolve(target: JsonPointer | string | string[]): any;
        }

        function create(pointer: string): JsonPointer;
        function has(target: any, pointer: string): any | undefined;
        function get(target: any, pointer: string): any | undefined;
        function set(target: any, pointer: string, value: any, force?: boolean): any | undefined;
        function list(target: any, fragmentId?: boolean): Array<{ pointer?: string, fragmentId?: string, value: string }>;
        function flatten(target: any, fragmentId?: boolean): { [index: string]: any }
        function map(target: any, fragmentId?: boolean): string[][];
        function decode(pointer: string): string[];
        function decodePointer(pointer: string): string[];
        function decodeUriFragmentIdentifier(pointer: string): string[];
        function encodePointer(path: string[]): string;
        function encodeUriFragmentIdentifier(pointer: string[]): string;
        function noConflict(): void;
    }

    export = jsonPtr;
}