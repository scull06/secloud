//No sensitive data can flow to the console.
tagAsSink(console.log);

function getInput() {
  return 123
}

console.log("Hello world!");

let f = tagAsSource(getInput());

let b = Math.pow(f, 2);

if (true) {
  tagAsSource(console.log(b));
}