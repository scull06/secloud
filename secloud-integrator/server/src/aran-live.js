const Acorn = require("acorn");
const Astring = require("astring");
const istrapname = (string) => /^[a-z]*$/.test(string);
const identity = (argument) => argument;
module.exports = (aran, advice) => {
  const pointcut = Object.keys(advice).filter(istrapname);
  const generate = aran.output === "String" ? identity : Astring.generate;
  global[aran.namespace] = advice;
  global.eval(generate(aran.setup()));
  return (script, scope, options) => generate(aran.weave(Acorn.parse(script, options|| {locations : true}), pointcut, scope));
};