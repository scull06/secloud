// @ts-nocheck
//No sensitive data can flow to the console.
tagAsSink(console.log);

const input = () => {
  return tagAsSource("My Password here");
};

console.log("Hello world!");

let f = input();
let b = Math.pow(f, 2);

if (true) {
  console.log(b); //must be prevented
}