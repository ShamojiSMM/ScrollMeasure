function isNum(...values) {
  if (!values.length) return false;
  for (var value of values) {
    if (value === 0) return true;
    if (["", null, Infinity, true, false].includes(value) || isNaN(value)) return false;
  }

  return true;
}

function getElement(selector) {
  return document.querySelector(selector);
}

var inputSlowness = getElement("#inputSlowness");
var resultSlowness = getElement("#resultSlowness");
var slowness;
var isSlowness = false;

inputSlowness.addEventListener("input", event => {
  var value = parseInt(event.target.value);
  isSlowness = isNum(value);

  resultSlowness.textContent = isSlowness ? `, ${value + 1}` : "";
  slowness = value;
});

var maxHeight = 8;
var delays = [];

window.onload = () => {
  for (var starting of startings) {
    for (var gap0 of gaps) {
      if (starting.down + gap0.down >= maxHeight) continue;

      for (var gap1 of gaps) {
        var down = starting.down + gap0.down + gap1.down;
        if (down >= maxHeight) continue;

        for (var dis = 1; dis <= maxHeight - down; dis ++) {
          delays.push({
            delay: starting.delay + gap0.delay + gap1.delay - (accelerations[dis - 1] || 0),
            height: down + dis,
            str: `${starting.str}${gap0.str}${gap1.str}`,
            isExc: dis == 7
          });
        }
      }
    }
  }

  delays.sort((a, b) => a.delay - b.delay);

  delays = delays.filter((current, i, arr) => {
    var pre = arr[i - 1];
    return i == 0 || !(current.delay == pre.delay && current.height == pre.height);
  });
}

var buttonFind = getElement("#buttonFind");
buttonFind.addEventListener("click", findWiring);
inputSlowness.addEventListener("keydown", event => {
  if (event.key == "Enter") findWiring();
});

var resultWirings = getElement("#resultWirings");

function findWiring() {
  if (!isSlowness) {
    resultWirings.innerText = "";
    return;
  }

  var text = "";

  for (var first of delays) {
    var target = first.delay + (first.isExc ? 1 : 0) - slowness - 11 + 1;

    for (var second of delays) {
      if (target == second.delay + (second.height - first.height) * 4) {
        text += `(${first.delay} / ${first.height} / ${first.str}), (${second.delay} / ${second.height} / ${second.str})\n`;
      }
    }
  }

  resultWirings.innerText = text;
}

var inputColumns = Array.from(document.querySelectorAll(".inputColumn"));

inputColumns.forEach(input => {
  input.addEventListener("mouseover", () => {
    input.title = input.value.length;
  });
});

var buttonCalc = getElement("#buttonCalc");
buttonCalc.addEventListener("click", calcVelocity);

var [resultSlownesses, resultVelocity] = [getElement("#resultSlownesses"), getElement("#resultVelocity")];

function calcVelocity() {
  if (!isSlowness) return;

  var columns = inputColumns.map(input => {
    var text = input.value.replace(/\s/g, "");
    return text.split("");
  });

  var slownesses = [];

  for (var i = 0; i < columns[0].length; i ++) {
    for (var j = 0; j <= 2; j ++) {
      if (i < columns[j].length) {
        var text = columns[j][i];
        value = [slowness, slowness + 1][["1", "2"].indexOf(text)];

        slownesses.push(value);
      }
    }
  }

  resultSlownesses.textContent = slownesses;
  resultVelocity.textContent = slownesses.reduce((sum, current) => sum + current, 0) / slownesses.length;
}

[resultSlownesses, resultVelocity].forEach(result => {
  result.addEventListener("click", event => {
    navigator.clipboard.writeText(event.target.textContent);
  });
});

var accelerations = [11, 8, 5, 3, 2, 1, 1];
// second: [11, 8, 5, 3, 2, 1];

var startings = [
  {delay: 0, str: "↓-", down: 0},
  {delay: 14, str: "↓-R1", down: 2},
  {delay: 27, str: "↓-R2", down: 4},
  {delay: 40, str: "↓-R3", down: 6},

  {delay: 21, str: "↑R0-", down: 0},
  {delay: 34, str: "↑R0-R1", down: 2},
  {delay: 48, str: "↑R0-R2", down: 4},

  {delay: 64, str: "↑R1-", down: 0},
  {delay: 78, str: "↑R1-R1", down: 2},
  {delay: 91, str: "↑R1-R2", down: 4},
];

var gaps = [
  {delay: 0, str: "", down: 0},

  {delay: 19, str: "G1R1", down: 3},
  {delay: 32, str: "G1R2", down: 5},
  {delay: 45, str: "G1R3", down: 7},

  {delay: 22, str: "G2R1", down: 4},
  {delay: 36, str: "G2R2", down: 6},

  {delay: 25, str: "G3R1", down: 5},
  {delay: 38, str: "G3R2", down: 7},

  {delay: 26, str: "G4R1", down: 6},

  {delay: 28, str: "G5R1", down: 7},

  {delay: 28, str: "G6R1", down: 8},
];