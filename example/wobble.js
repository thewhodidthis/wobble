var wobble = (() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // main.js
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  var wobble = (depth = 40) => {
    const store = [];
    return (input = { data: [] }) => {
      const frame = new Uint8ClampedArray(input.data.buffer);
      const clone = new Uint8ClampedArray(frame);
      const storeSizeMaybe = store.push(clone);
      if (depth - storeSizeMaybe < 0) {
        store.shift();
      }
      const storeSize = store.length;
      const frameSize = frame.length;
      const stripSize = Math.floor(frameSize / storeSize);
      for (let i = 0; i < storeSize; i += 1) {
        const a = i * stripSize;
        const b = a + stripSize;
        const block = store[i];
        const strip = block.subarray(a, b);
        frame.set(strip, a);
      }
      return input;
    };
  };
  var main_default = wobble;
  return main_exports;
})();
