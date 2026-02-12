"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = assert;
const assert_1 = require("assert");
function assert(condition, message) {
    if (!condition) {
        throw new assert_1.AssertionError({ message });
    }
}
//# sourceMappingURL=assert.js.map