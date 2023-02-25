import minimist from "minimist";
const options = {default: {p: 8080, m: "FORK", d: "MONGO"}, alias:{p:"puerto", m:"mode", d:"database"}};
export const args = minimist(process.argv.slice(2), options);
