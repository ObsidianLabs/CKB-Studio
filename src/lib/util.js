exports.TextEncoder = window.TextEncoder
exports.TextDecoder = window.TextDecoder
exports.deprecate = (fn, msg) => {
  console.warn(msg)
  return fn
}