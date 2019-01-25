import Library from "../library";

async function main() {
  const library = await Library.fromFile('../../temp/Library.xml');
  console.log(library.data);
}

main();
