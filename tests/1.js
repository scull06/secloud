tagAsSink(console.log);
const input = () => {
  return tagAsSource(123);
};

let f = input();
let b = Math.pow(f, f);

console.log(123);
if (12) {
  console.log(b);
}
