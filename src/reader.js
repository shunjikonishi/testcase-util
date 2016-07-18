"use strict";

var fs            = require("fs");
var readline      = require("readline");
var _             = require("lodash");
var shellQuote    = require("shell-quote");
var Testcase      = require("./testcase");


function TestcaseReader(filename) {
  function extractTitle(str) {
    if (str.startsWith("#")) {
      return extractTitle(str.substring(1).trim());
    }
    return str.trim();
  }
  function onTestcase(callback) {
    testcaseFunc = callback;
  }
  function resume() {
    rl.resume();
  }
  function isCodeSep(line) {
    return line.trim() === "```";
  }
  function getTitle() {
    return title || "tecase " + (idx++);
  }
  function getInput() {
    return shellQuote.parse(input || "").map(v => {
      return v.op && v.pattern ? v.pattern : v;
    })
  }
  var rs = fs.ReadStream(filename);
  var rl = readline.createInterface({
    input: rs,
    output: {}
  });
  rl.on("line", function(line) {
    if (bOutput) {
      if (isCodeSep(line)) {
        bOutput = false;
        if (testcaseFunc) {
          testcaseFunc.call(null, new Testcase(getTitle(), getInput(), output));
        }
        title = null;
        input = null;
        output = [];
        return;
      }
      output.push(line);
    }
    if (line.startsWith("#")) {
      title = extractTitle(line);
    } else if (line.startsWith("input:")) {
      input = line.substring(6).trim();
    } else if (isCodeSep(line)) {
      bOutput = true;
    }
  });
  var caseIndex = 1;
  var title = null;
  var input = null;
  var output = [];
  var bOutput = false;
  var testcaseFunc = null;

  _.extend(this, {
    onTestcase: onTestcase,
    resume: resume
  });
}

module.exports = TestcaseReader;
