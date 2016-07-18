"use strict";

var TestcaseReader = require("./src/reader");

var filename = process.argv[2];
if (!filename) {
  console.log("Need to specify filename");
  process.exit(-1);
}

var reader = new TestcaseReader(filename);
reader.onTestcase(testcase => {
  console.log("title", testcase.title);
  console.log("input", testcase.input);
  console.log("output", testcase.output);
});
reader.resume();
