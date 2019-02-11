btnJSON.addEventListener('click', function () {
  let graphJSON = graphX.toJSON();
  let graphJSONstring = JSON.stringify(graphJSON);
  console.log(graphJSON);
  console.log(graphJSONstring);
});
btnLSClear.addEventListener('click', function () {
  localStorage.clear();
});
btnLSGet.addEventListener('click', function () {
  let i;
  console.log(">>>>> local storage");
  for (i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
  }
  console.log(">>>>> session storage");
  for (i = 0; i < sessionStorage.length; i++) {
    console.log(sessionStorage.key(i) + "=[" + sessionStorage.getItem(sessionStorage.key(i)) + "]");
  }
  console.log(">>>>> in Short: ");
  for (i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
  }
});
btnClearPipeline.addEventListener('click', function () {
  let currentPipeline = graphX.getCell(globalPipeline);
  getId();
  let id = "newPipeline_" + newId;
  graphX.removeCells(currentPipeline);
  loadPipeline(id);
});
// btnLink.addEventListener('click', function () {
//   let val = btnLink.getAttribute('value');
//   if (val === "off") {
//     btnLink.setAttribute('value', "on");
//     btnLink.innerHTML = "Standard Link";
//   } else {
//     btnLink.setAttribute('value', "off");
//     btnLink.innerHTML = "Main Link";
//   }
// });

let customLib = [];

function savePipeline(cellView) {
  let json = cellView.model.toJSON();
  let stepId = json.stepId;
  delete json.position;
  delete json.size;
  delete json.ports;
  delete json.id;
  delete json.prototype;
  delete json.z;
  delete json.angle;
  json.stepGroup = "xproc.Custom";
  json.type = "xproc.Compound";
  let label = "" + json.stepPrefix + ":" + json.stepName;
  let id = "" + json.stepPrefix + "-" + json.stepName;
  console.log(json);
  if (json.stepPrefix !== "unset" && json.stepName !== "unset") {

    let string = JSON.stringify(json);
    customLib.push(json);
    superObj.push(json);
    console.log(JSON.stringify(customLib));
    localStorage.setItem("customLib", customLib);
    localStorage.setItem(stepId, string);
    let li = document.createElement('li');
    li.setAttribute('id', id);
    li.setAttribute('draggable', 'true');
    li.classList.add("step", "customStep");
    li.appendChild(document.createTextNode(label));
    document.querySelector("#customUL").appendChild(li);
    li.addEventListener('dragstart', function (e) {
      let id = e.target.id;
      e.dataTransfer.setData('text', id);
    });
    li.addEventListener('dblclick', function () {
      let placeX = 100;
      let placeY = 100;
      stepLoad(li, placeX, placeY);
      console.log(string);
    });
  } else return alert("You have to set a name and prefix for the pipeline");
}

btnSavePipe.addEventListener('click', function () {
  let cellModelType = currentCell.model.attributes.type;
  console.log(currentCell);
  if (cellModelType === "xproc.Pipeline") {
    savePipeline(currentCell);
  } else return alert("This is a Built-in Step that you can't save!");
});

// let graphArray = [];
// btnExportTest.addEventListener('click', function () {
//   pipelineExport();
// });
//
// function pipelineExport() {
//   graphArray = [];
//   let i;
//   for (i = 0; i < testBtnArray.length; i++) {
//     let btnId = testBtnArray[i];
//     let btn = document.getElementById(btnId);
//     btn.click();
//     let graphJSON = graphX.toJSON();
//     let graphCells = graphJSON.cells;
//     graphArray.push(graphCells);
//     document.getElementById(testBtnArray[0]).click();
//   }
//   console.log(">>>>> GRAPH ARRAY");
//   console.log(graphArray);
//   console.log(JSON.stringify(graphArray));
// }

btnBack.addEventListener('click', function () {
  getLastGraphState();
});
btnForward.addEventListener('click', function () {
  getNextGraphState();
});

// FALLBACK-STATES
function saveLastGraphState() {
  let graphJSONstring = JSON.stringify(graphX.toJSON());
  localStorage.setItem('lastGraphState', graphJSONstring);
}

function saveNextGraphState() {
  let graphJSONstring = JSON.stringify(graphX.toJSON());
  localStorage.setItem('nextGraphState', graphJSONstring);
}

function getLastGraphState() {
  let lastGraphState = localStorage.getItem('lastGraphState');
  lastGraphState = JSON.parse(lastGraphState);
  graph.clear();
  graph.fromJSON(lastGraphState);
}

function getNextGraphState() {
  let nextGraphState = localStorage.getItem('nextGraphState');
  nextGraphState = JSON.parse(nextGraphState);
  graph.clear();
  graph.fromJSON(nextGraphState);
}

// btnInPortAdd.addEventListener('click', function () {
//   let currentPipeline = graphX.getCell(globalPipeline);
//   currentPipeline.addPort(inPort);
// });
// btnOutPortAdd.addEventListener('click', function () {
//   let currentPipeline = graphX.getCell(globalPipeline);
//   currentPipeline.addPort(outPort);
// });
$('#btnShowOptions').on('click', function () {
  $('.joint-type-xproc-option').fadeOut('fast');
  $('#btnShowOptions').hide();
  $('#btnHideOptions').show();

});
$('#btnHideOptions').on('click', function () {
  $('.joint-type-xproc-option').fadeIn('fast');
  $('#btnHideOptions').hide();
  $('#btnShowOptions').show();
});
paper.on('element:pointerdown', function () {
  saveLastGraphState();
});
paper.on('element:pointerup', function () {
  saveNextGraphState();
});