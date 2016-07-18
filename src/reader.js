"use strict";

var fs            = require("fs");
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
  function testcases() {
    return result;
  }
  function init() {
    var text = fs.readFileSync(filename, "utf-8");
    text.split(/\r?\n/).forEach(onLine);
  }
  function onLine(line) {
    if (bOutput) {
      if (isCodeSep(line)) {
        bOutput = false;
        result.push(new Testcase(getTitle(), getInput(), output));
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
  }
  var caseIndex = 1;
  var title = null;
  var input = null;
  var output = [];
  var bOutput = false;
  var result = [];

  init();
  _.extend(this, {
    testcases: testcases
  });
}

module.exports = TestcaseReader;
