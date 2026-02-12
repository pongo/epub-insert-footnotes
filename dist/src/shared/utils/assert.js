import { AssertionError } from 'assert';
export function assert(condition, message) {
    if (!condition) {
        throw new AssertionError({ message });
    }
}
//# sourceMappingURL=assert.js.map