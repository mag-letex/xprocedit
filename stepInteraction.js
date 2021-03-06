function stepNameCheck(val) {
  let checkSum;
  let graphCells = graphX.getCells();
  for (let i = 0; i < graphCells.length; i++) {
    if (graphCells[i].attributes.stepName === val) {
      checkSum = true;
      console.log(checkSum);
      return checkSum;
    } else {
      checkSum = false;
    }
  }
}

// Load Steps into Paper
function stepLoad(elem, placeX, placeY) {
  console.log(elem);
  getId();
  let id = elem.id;
  let stepIdNum = newId;
  let stepId = "" + id + "_" + stepIdNum;
  let embedIn = graphX.getCell(globalPipeline);
  console.log(embedIn);
  let scope = embedIn.attributes.stepScope;
  let i;
  for (i = 0; i < superObj.length; i++) {
    if (superObj[i].stepType === id) {
      let group = superObj[i].stepGroup;
      if (group === "xproc.Atomic") {
        loadAtomicStep(i, stepIdNum, stepId, placeX, placeY, scope);
      }
      if (group === "xproc.Compound") {
        loadCompoundStep(i, stepIdNum, stepId, placeX, placeY, scope);
      }
      if (group === "xproc.Custom") {
        loadCustomStep(i, stepIdNum, stepId, placeX, placeY, scope);
      }
    }
  }
  let cell = paperX.findViewByModel(stepId);
  highlight(cell);
  metaPanel(cell);
}

function loadAtomicStep(i, stepIdNum, stepId, placeX, placeY, scope) {
  let thisScope = scope + 1;
  let newCell = new joint.shapes.xproc.Atomic(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .prop('stepName', stepIdNum)
    .prop('stepPrefix', "p")
    .prop('stepScope', thisScope)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
  globalStepArray.push(newCell.attributes);
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.embed(newCell);
  currentPipeline.attributes.stepEmbeds.push(stepId);
  if (superObj[i].stepOption !== undefined) {
    let stepOptionArray = superObj[i].stepOption;
    let stepOptionPosY = placeY + 100;
    for (let j = 0; j < stepOptionArray.length; j++) {
      let stepOptionName = stepOptionArray[j].name;
      let stepOptionSelect = stepOptionArray[j].select;
      let stepOptionRequired = stepOptionArray[j].required;

      let newOption = new joint.shapes.xproc.Option({
        id: "" + stepId + "_opt_" + stepOptionName,
        position: {
          x: placeX,
          y: stepOptionPosY
        },
        attrs: {
          ".label": {text: stepOptionName},
          rect: {fill: '#ff6d6c'}
        },
        optionName: stepOptionName,
        optionRequired: stepOptionRequired,
        optionSelect: stepOptionSelect
      });
      graphX.addCell(newOption);
      newCell.embed(newOption);
      stepOptionPosY = stepOptionPosY + 20;
    }
  }
}

function loadCompoundStep(i, stepIdNum, stepId, placeX, placeY, scope) {
  let thisScope = scope + 1;
  testGraph.push(stepId);
  let newCell = new joint.shapes.xproc.Compound(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .prop('stepName', stepIdNum)
    .prop('stepScope', thisScope)
    .prop('stepPrefix', "p")
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
  globalStepArray.push(newCell.attributes);
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.embed(newCell);
  currentPipeline.attributes.stepEmbeds.push(stepId);
  if (superObj[i].stepOption !== undefined) {
    let stepOptionArray = superObj[i].stepOption;
    let stepOptionPosY = placeY + 100;
    for (let j = 0; j < stepOptionArray.length; j++) {
      let stepOptionName = stepOptionArray[j].name;
      let stepOptionSelect = stepOptionArray[j].select;
      let stepOptionRequired = stepOptionArray[j].required;
      let newOption = new joint.shapes.xproc.Option({
        id: "" + stepId + "_opt_" + stepOptionName,
        position: {
          x: placeX,
          y: stepOptionPosY
        },
        attrs: {
          ".label": {text: stepOptionName},
          rect: {fill: '#a1c9ff'}
        },
        optionName: stepOptionName,
        optionRequired: stepOptionRequired,
        optionSelect: stepOptionSelect
      });
      graphX.addCell(newOption);
      newCell.embed(newOption);
      stepOptionPosY = stepOptionPosY + 20;
    }
  }
}

function loadCustomStep(i, stepIdNum, stepId, placeX, placeY) {
  testGraph.push(stepId);
  let newCell = new joint.shapes.xproc.Custom(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .prop('stepName', stepIdNum)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
  globalStepArray.push(newCell.attributes);
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.embed(newCell);
  if (superObj[i].stepOption !== undefined) {
    let stepOptionArray = superObj[i].stepOption;
    let stepOptionPosY = placeY + 100;
    for (let j = 0; j < stepOptionArray.length; j++) {
      let stepOptionName = stepOptionArray[j].name;
      let stepOptionSelect = stepOptionArray[j].select;
      let stepOptionRequired = stepOptionArray[j].required;
      let newOption = new joint.shapes.xproc.Option({
        id: "" + stepId + "_opt_" + stepOptionName,
        position: {
          x: placeX,
          y: stepOptionPosY
        },
        attrs: {
          ".label": {text: stepOptionName},
          rect: {fill: '#39af2f'}
        },
        optionName: stepOptionName,
        optionRequired: stepOptionRequired,
        optionSelect: stepOptionSelect
      });
      graphX.addCell(newOption);
      newCell.embed(newOption);
      stepOptionPosY = stepOptionPosY + 20;
    }
  }
}

// PAPER - FUNCTIONS
function cellPointerDblClick(cellView, evt) {
  let modelType = cellView.model.attributes.type;
  let modelId = cellView.model.attributes.stepId;
  let modelName = cellView.model.attributes.stepName;
  if (modelType === "xproc.Compound") {
    createPaperBtn(modelId, evt, cellView, modelName);
    globalPipeline = modelId;
  }
}

//HIGHLIGHTING FUNCTION
let oldCellView = null;

function highlight(cellView) {
  if (oldCellView != null) {
    oldCellView.unhighlight(null, {
      highlighter: {
        name: 'addClass',
        options: {
          className: 'highlight-class'
        }
      }
    });
  }
  if (oldCellView !== cellView) {
    cellView.highlight(null, {
      highlighter: {
        name: 'addClass',
        options: {
          className: 'highlight-class'
        }
      }
    });
    oldCellView = cellView;
  } else if (oldCellView === cellView) {
    console.log("SAME");
    cellView.highlight(null, {
      highlighter: {
        name: 'addClass',
        options: {
          className: 'highlight-class'
        }
      }
    });
    oldCellView = cellView;

  } else {
    oldCellView = null;
  }
}

document.addEventListener('keydown', function (e) {
  if (e.which === 46) {
    let id = oldCellView.model.attributes.id;
    let btn = "btn-" + oldCellView.model.attributes.id;
    let type = oldCellView.model.attributes.type;
    let checkArr = testBtnArray.includes('' + btn);
    if (type !== "xproc.Pipeline") {
      let connectedLinks = graphX.getConnectedLinks(oldCellView.model);
      let embeds = oldCellView.model.getEmbeddedCells();
      graphX.removeCells(embeds);
      graphX.removeCells(connectedLinks);
      if (type !== "xproc.Pipeline" && checkArr === true) {
        deletePaper(id);
        document.getElementById('' + btn).remove();
        for (let i = 0; i < testBtnArray.length; i++) {
          if (testBtnArray[i] === btn) {
            testBtnArray.splice(i, 1);
          }
        }
      }
      oldCellView.remove();
      oldCellView = null;
    }
  }
});

// META - PANEL
const metaArea = document.querySelectorAll('.metaArea');
const metaInfo = document.querySelector('#metaInfo');
const metaPorts = document.querySelector('#metaPorts');
const metaOptions = document.querySelector('#metaOptions');
let prefix = "unset";
let type = "unset";

//Form Elements
const form = document.createElement('form');
const fieldset = document.createElement('fieldset');
const legend = document.createElement('legend');
const label = document.createElement('label');
const input = document.createElement('input');
const inputBtn = input.cloneNode();
inputBtn.setAttribute('type', "button");
inputBtn.classList.add('btnInput');
const select = document.createElement('select');
const option = document.createElement('option');
const optUnset = option.cloneNode();
optUnset.appendChild(document.createTextNode("unset"));
const optTrue = option.cloneNode();
optTrue.appendChild(document.createTextNode("true"));
const optFalse = option.cloneNode();
optFalse.appendChild(document.createTextNode("false"));
const optOmit = option.cloneNode();
optOmit.appendChild(document.createTextNode("omit"));
const optFirstChild = option.cloneNode();
optFirstChild.appendChild(document.createTextNode("first-child"));
const optLastChild = option.cloneNode();
optLastChild.appendChild(document.createTextNode("last-child"));
const optBefore = option.cloneNode();
optBefore.appendChild(document.createTextNode("before"));
const optAfter = option.cloneNode();
optAfter.appendChild(document.createTextNode("after"));
const selectBool = select.cloneNode(true);
selectBool.appendChild(optUnset.cloneNode(true));
selectBool.appendChild(optTrue.cloneNode(true));
selectBool.appendChild(optFalse.cloneNode(true));
const listTrueFalseOmit = select.cloneNode(true);
listTrueFalseOmit.appendChild(optUnset.cloneNode(true));
listTrueFalseOmit.appendChild(optTrue.cloneNode(true));
listTrueFalseOmit.appendChild(optFalse.cloneNode(true));
listTrueFalseOmit.appendChild(optOmit.cloneNode(true));
const listFirstLastChildBeforeAfter = select.cloneNode(true);
listFirstLastChildBeforeAfter.appendChild(optUnset.cloneNode(true))
listFirstLastChildBeforeAfter.appendChild(optFirstChild.cloneNode(true))
listFirstLastChildBeforeAfter.appendChild(optLastChild.cloneNode(true))
listFirstLastChildBeforeAfter.appendChild(optBefore.cloneNode(true))
listFirstLastChildBeforeAfter.appendChild(optAfter.cloneNode(true))
const optString = option.cloneNode();
optString.appendChild(document.createTextNode("xs:string"));
const optInteger = option.cloneNode();
optInteger.appendChild(document.createTextNode("xs:integer"));
const optBoolean = option.cloneNode();
optBoolean.appendChild(document.createTextNode("xs:boolean"));
const selectOptionType = select.cloneNode(true);
selectOptionType.appendChild(optUnset.cloneNode(true));
selectOptionType.appendChild(optString);
selectOptionType.appendChild(optInteger);
selectOptionType.appendChild(optBoolean);
// Delete Button
const btnDelete = inputBtn.cloneNode();
btnDelete.setAttribute('value', "X");
const h3 = document.createElement('h3');
const div = document.createElement('div');


const fieldsetPort = fieldset.cloneNode();
fieldsetPort.classList.add("port-field");
const legendPort = fieldsetPort.appendChild(legend.cloneNode());
legendPort.appendChild(document.createTextNode("Port"));
const portName = label.cloneNode(true);
portName.classList.add("port-name");
//Port-Primary Dummy
const portPrimary = label.cloneNode(true);
portPrimary.appendChild(document.createTextNode("primary"));
const selectPrimary = selectBool.cloneNode(true);
portPrimary.appendChild(selectPrimary);
//Port-Sequence Dummy
const portSequence = label.cloneNode(true);
portSequence.appendChild(document.createTextNode("sequence"));
const selectSequence = selectBool.cloneNode(true);
portSequence.appendChild(selectSequence);

let optionName = label.cloneNode(true);
optionName.classList.add("option-name");


function selectBoolean(portOpt, cellView, cont, dataId, dataType, select, type) {
  for (let i = 0; i < select.length; i++) {
    if (dataType !== undefined && dataType.toString() === select[i].value) {
      select[i].setAttribute('selected', "selected");
    }
  }
  select.addEventListener('change', function () {
    for (let i = 0; i < cont.length; i++) {
      if (portOpt === "port") {
        if (cont[i].portId === dataId) {
          if (type === "primary") {
            cont[i].portPrimary = this.value;
          } else if (type === "sequence") {
            cont[i].portSequence = this.value;
          }
        }
      } else if (portOpt === "opt") {
        if (cont[i].name === dataId) {
          cont[i].required = this.value;
        }
      }
    }
    metaPanel(cellView);
  });
}

document.getElementById('metaPanel').addEventListener('submit', function (e) {
  e.preventDefault();
}, false);

function metaPanel(cellView) {
  //Step-Information
  let testElem = graphX.getCell(cellView.model.attributes.id);
  let testView = paperX.findViewByModel(testElem);
  currentCell = cellView;
  let step = cellView.model.toJSON();
  let stepScope = cellView.model.attributes.stepScope;
  let stepType = cellView.model.attributes.stepType;
  let stepGroup = cellView.model.attributes.stepGroup;
  let stepPrefix = cellView.model.attributes.stepPrefix;
  let stepName = cellView.model.attributes.stepName;
  let portData = cellView.model.attributes.portData;
  let inPorts = cellView.model.attributes.inPorts;
  let outPorts = cellView.model.attributes.outPorts;
  let stepOptions = cellView.model.attributes.stepOption;
  let optName = cellView.model.attributes.optionName;
  // let optRequired = cellView.model.attributes.optionRequired;
  let optValue = cellView.model.attributes.optionValue;
  let inputPorts = [];
  let outputPorts = [];
  let stubPorts = [];
  console.log(step);
  for (let i = 0; i < portData.length; i++) {
    if (portData[i].portGroup === "in") {
      inputPorts.push(portData[i]);
    } else if (portData[i].portGroup === "out") {
      outputPorts.push(portData[i]);
    } else if (portData[i].portGroup === "stub") {
      stubPorts.push(portData[i]);
    }
  }
  //Empty Panel Content
  $('.metaArea').css('display', 'block');
  for (let i = 0; i < metaArea.length; i++) {
    while (metaArea[i].childNodes.length > 2) {
      metaArea[i].removeChild(metaArea[i].lastChild);
    }
  }
  // Info-DIV
  let formInfo = form.cloneNode();
  let fieldsetInfo = fieldset.cloneNode();
  let legendInfo = fieldsetInfo.appendChild(legend.cloneNode());
  legendInfo.appendChild(document.createTextNode(""));
  let labelType = label.cloneNode();
  labelType.appendChild(document.createTextNode("Type: "));
  let inputType = labelType.appendChild(input.cloneNode());
  inputType.setAttribute('type', 'text');
  inputType.classList.add("inputTypeInfo");
  if (stepType === "pUnset") {
    inputType.setAttribute('placeholder', "unset");
  } else {
    let input = stepType.slice(1).toLowerCase();
    inputType.setAttribute('value', input)
  }

  let labelName = label.cloneNode();
  labelName.appendChild(document.createTextNode("Name: "));
  let inputName = labelName.appendChild(input.cloneNode());
  inputName.setAttribute('type', 'text');
  inputName.classList.add("inputNameInfo");
  let isNum = /^\d+$/.test("" + stepName);
  if (isNum === true) {
    inputName.setAttribute('placeholder', stepName);
  } else {
    inputName.setAttribute('value', stepName);
  }

  // Prefix Select
  let labelPrefix = label.cloneNode();
  labelPrefix.appendChild(document.createTextNode("Prefix: "));
  let selectPrefix = labelPrefix.appendChild(select.cloneNode());
  selectPrefix.setAttribute('name', 'prefixes');
  let prefixOptions = [];

  function createPrefix(text) {
    let optionPrefix = option.cloneNode();
    optionPrefix.setAttribute('value', text);
    optionPrefix.appendChild(document.createTextNode(text));
    prefixOptions.push(optionPrefix);
    return optionPrefix;
  }

  let prefixes = [
    createPrefix("unset"),
    createPrefix("d"),
    createPrefix("e"),
    createPrefix("f"),
    createPrefix("custom")
  ];
  for (let i = 0; i < prefixes.length; i++) {
    selectPrefix.appendChild(prefixes[i]);
  }
  for (let i = 0; i < prefixOptions.length; i++) {
    if (stepPrefix === prefixOptions[i].value) {
      prefixOptions[i].setAttribute('selected', "selected");
    }
  }

  function switchButtonSave(type, cellView, oldId, nm) {
    console.log("Hello Function!");
    // let buttons = $('.tab');
    let checkBut = "btn-" + oldId;
    console.log(nm);
    let newBut = "" + type + "_" + nm;
    // console.log(buttons);
    let index;
    console.log(testBtnArray);

    if (cellView.model.attributes.type === "xproc.Pipeline") {
      console.log("Hello Function");
      let thisBtn = document.getElementById("" + btnIdGlobal);
      thisBtn.innerHTML = type;
      // let btnName = "btn-" + type;
      // thisBtn.setAttribute('id', btnName);
      // paperX.el.id = "paper-" + type;
      // testBtnArray[index] = btnName;
      // btnIdGlobal = btnName;
      // globalPipeline = type;
      globalCell(cellView);
    } else {
      for (let i = 0; i < testBtnArray.length; i++) {
        if (testBtnArray[i] === checkBut) {
          document.getElementById(testBtnArray[i]).innerText = newBut;
          // .innerText(newBut);
          // index = i;
        }
      }
    }
  }

  function mainInput(type, prefix, nm, label, string, save) {
    let links = graphX.getConnectedLinks(testElem);
    // let ports = testElem.getPorts();
    let oldId = testElem.attributes.id;
    let pipe = testElem.attributes.type;
    let embCells = testElem.getEmbeddedCells();
    console.log(embCells);
    if (pipe === "xproc.Pipeline") {
      testElem.attr({".label": {text: label}});
    }
    testElem.prop('stepPrefix', prefix);
    testElem.prop('stepType', type);
    testElem.prop('stepName', nm);
    testElem.prop('stepId', string);
    testElem.prop('stepIdOld', oldId);
    // testElem.prop('id', string);
    // for (let i=0; i<embCells.length; i++){
    //   embCells[i].prop('parent', string);
    // }
    console.log(testView);
    console.log(testElem);
    let secReset = graphX.getCells();
    graphX.resetCells(secReset);
    switchButtonSave(string, testView, oldId, nm);
  }

  function calcVar(tp, prfx, nm, bool) {
    let tpCap = tp.charAt(0).toUpperCase() + tp.slice(1);
    let type = "" + prfx + tpCap;
    let label = "" + prfx + ":" + tp;
    label = label.toLowerCase();
    let string = "" + type + "_" + nm;
    mainInput(type, prfx, nm, label, string, bool)
  }

  selectPrefix.addEventListener('change', function () {
    console.log(this.value);
    let tp = testElem.attributes.stepType;
    tp = tp.slice(1);
    let nm = testElem.attributes.stepName;
    prefix = this.value;
    calcVar(tp, prefix, nm, true);
  });
  inputType.addEventListener('change', function () {
    let tp = this.value;
    let prfx = testElem.attributes.stepPrefix;
    let nm = testElem.attributes.stepName;
    calcVar(tp, prfx, nm, true);
  });
  // inputType.addEventListener('keyup', function (e) {
  //   if (e.which !== 13) {
  //     let type = this.value;
  //     calcVar(type, prefix, stepName);
  //   }
  // });
  inputName.addEventListener('change', function () {
    if (stepNameCheck(this.value) === true) {
      console.log(inputName);
      alert("Please choose another Name. This one already exists.");
      inputName.value = "";
    } else {
      let tp = cellView.model.attributes.stepType;
      tp = tp.slice(1);
      console.log(tp.slice(1));
      let prfx = cellView.model.attributes.stepPrefix;
      // let thisName = "" + tp + "_" + this.value;
      cellView.model.attr({".word2": {text: this.value}});
      calcVar(tp, prfx, this.value, true);
    }
  });

  // Ports-DIV
  let divPortsHead = div.cloneNode();
  divPortsHead.setAttribute('id', "divPortsHead");

  // Input-Ports
  let divInput = div.cloneNode();
  divInput.classList.add('divPorts');
  divInput.setAttribute('id', "divInput");
  divInput.style.display = "block";
  let h3PortsInput = h3.cloneNode();
  h3PortsInput.classList.add('h3Input', 'h3Port');
  h3PortsInput.appendChild(document.createTextNode("Inputs"));
  h3PortsInput.addEventListener('click', function () {
    let visibility = divInput.style.display;
    if (visibility === "none") {
      divInput.style.display = "block";
      h3PortsInput.style.cursor = "initial";
      h3PortsOutput.style.cursor = "pointer";
      h3PortsStub.style.cursor = "pointer";
      divOutput.style.display = "none";
      divStub.style.display = "none";
    }
  });
  let formInput = form.cloneNode();
  let btnInputAdd = inputBtn.cloneNode();
  btnInputAdd.setAttribute('value', "add In-Port");
  btnInputAdd.addEventListener('click', function () {
    getId();
    let portId = "inPort-" + newId;
    let portObject = {
      "portId": portId,
      "portGroup": "in",
      "portPrimary": "unset",
      "portSequence": "unset"
    };
    cellView.model.addInPort(portId);
    createPortContent(portId, true, inputPorts, formInput, "in");
    cellView.model.attributes.portData.push(portObject);
  });


  // Output-Ports
  let divOutput = div.cloneNode();
  divOutput.classList.add('divPorts');
  divOutput.setAttribute('id', "divOutput");
  divOutput.style.display = "none";
  let h3PortsOutput = h3.cloneNode();
  h3PortsOutput.appendChild(document.createTextNode("Outputs"));
  h3PortsOutput.classList.add('h3Output', 'h3Port');
  h3PortsOutput.addEventListener('click', function () {
    let visibility = divOutput.style.display;
    if (visibility === "none") {
      divOutput.style.display = "block";
      h3PortsOutput.style.cursor = "initial";
      h3PortsInput.style.cursor = "pointer";
      h3PortsStub.style.cursor = "pointer";
      divInput.style.display = "none";
      divStub.style.display = "none";
    }
  });
  let formOutput = form.cloneNode();
  let btnOutputAdd = inputBtn.cloneNode();
  btnOutputAdd.setAttribute('value', "add Out-Port");
  btnOutputAdd.addEventListener('click', function () {
    getId();
    let portId = "outPort-" + newId;
    let portObject = {
      "portId": portId,
      "portGroup": "out",
      "portPrimary": "unset",
      "portSequence": "unset"
    };
    cellView.model.addOutPort(portId);
    createPortContent(portId, true, stubPorts, formOutput, "out");
    cellView.model.attributes.portData.push(portObject);
  });
  let fieldsetOutput = fieldset.cloneNode();
  fieldsetOutput.classList.add("port-field");
  let legendOutput = fieldsetOutput.appendChild(legend.cloneNode());
  legendOutput.appendChild(document.createTextNode("Out-Port"));

  // Pseudo - Ports
  let divStub = div.cloneNode();
  divStub.classList.add('divPorts');
  divStub.setAttribute('id', "divStub");
  divStub.style.display = "none";
  let h3PortsStub = h3.cloneNode();
  h3PortsStub.appendChild(document.createTextNode("Stubs"));
  h3PortsStub.classList.add('h3Stub', 'h3Port');
  h3PortsStub.addEventListener('click', function () {
    let visibility = divStub.style.display;
    if (visibility === "none") {
      divStub.style.display = "block";
      h3PortsStub.style.cursor = "initial";
      h3PortsInput.style.cursor = "pointer";
      h3PortsOutput.style.cursor = "pointer";
      divInput.style.display = "none";
      divOutput.style.display = "none";
    }
  });
  let formStub = form.cloneNode();
  let btnStubAdd = inputBtn.cloneNode();
  btnStubAdd.setAttribute('value', "add Stub-Port");
  btnStubAdd.addEventListener('click', function () {
    getId();
    let portId = "stubPort-" + newId;
    let portObject = {
      "portId": portId,
      "portGroup": "stub"
      // "portPrimary": "unset",
      // "portSequence": "unset"
    };
    cellView.model.addInPort(portId);
    // cellView.model.addPort(groupInPipe);
    createPortContent(portId, true, stubPorts, formStub, "stub");
    cellView.model.attributes.portData.push(portObject);
  });
  let fieldsetStub = fieldset.cloneNode();
  fieldsetStub.classList.add("port-field");
  let legendStub = fieldsetStub.appendChild(legend.cloneNode());
  legendStub.appendChild(document.createTextNode("Stub-Port"));

  function createPortContent(portId, btn, ports, formPorts, inout) {
    function portBtnDelete(btn, id, field) {
      btn.setAttribute('portId', id);
      btn.addEventListener('click', function (e) {
        let thisId = e.target.attributes.portId.nodeValue;
        if (inout === "in" || inout === "stub") {
          cellView.model.removeInPort(thisId);
        } else if (inout === "out") {
          cellView.model.removeOutPort(thisId);
        }
        for (let i = 0; i < portData.length; i++) {
          if (portData[i].portId === thisId) {
            cellView.model.attributes.portData.splice(i, 1);
          }
        }
        formPorts.removeChild(field);
      });
    }

    function nameInputLoad(dataId, input) {
      input.setAttribute('type', 'text');
      input.setAttribute('inputId', dataId);
      input.setAttribute('placeholder', dataId);
      input.addEventListener('change', function () {
        let idArray = [];
        for (let h = 0; h < portData.length; h++) {
          idArray.push(portData[h].portId);
        }
        if (idArray.includes(this.value)) {
          alert("You can't choose the same ID twice!");
          input.value = "";
        } else {
          cellView.model.portProp(dataId, 'attrs/.port-label/text', this.value);
          cellView.model.portProp(dataId, 'id', this.value);
          for (let i = 0; i < portData.length; i++) {
            if (portData[i].portId === dataId) {
              portData[i].portId = this.value;
            }
          }
          if (inout === "in") {
            for (let i = 0; i < inPorts.length; i++) {
              if (inPorts[i] === dataId) {
                inPorts[i] = this.value;
              }
            }
          } else if (inout === "out") {
            for (let i = 0; i < outPorts.length; i++) {
              if (outPorts[i] === dataId) {
                outPorts[i] = this.value;
              }
            }
          } else if (inout === "stub") {
            for (let i = 0; i < stubPorts.length; i++) {
              if (stubPorts[i] === dataId) {
                stubPorts[i] = this.value;
              }
            }
          }
          let currentCells = graphX.getCells();
          graphX.resetCells(currentCells);
        }
      });
    }

    function portLoadCont(port, primary, sequence) {
      let thisField = fieldsetPort.cloneNode(true);
      let thisName = portName.cloneNode(true);
      let scopeSelect = select.cloneNode(true);
      let scopeUl = document.createElement('ul');
                scopeUl.classList.add('stubListUl');
      let noName = portName.cloneNode(true);
      noName.appendChild(document.createTextNode(port));
      let nameInput = thisName.appendChild(input.cloneNode(true));
      nameInputLoad(port, nameInput);
      let thisFieldPrimary = portPrimary.cloneNode(true);
      let primarySelect = thisFieldPrimary.childNodes[1];
      selectBoolean("port", cellView, portData, port, primary, primarySelect, "primary");
      let thisFieldSequence = portSequence.cloneNode(true);
      let sequenceSelect = thisFieldSequence.childNodes[1];
      selectBoolean("port", cellView, portData, port, sequence, sequenceSelect, "sequence");
      let thisBtnDelete = btnDelete.cloneNode(true);
      portBtnDelete(thisBtnDelete, port, thisField);
      if (stepScope > 0 && inout !== "stub") {
        formPorts.appendChild(thisField);
        thisField.appendChild(noName);
        thisField.appendChild(thisFieldPrimary);
        thisField.appendChild(thisFieldSequence);
        primarySelect.setAttribute('disabled', "disabled");
        sequenceSelect.setAttribute('disabled', "disabled");
      } else if (inout !== "stub") {
        formPorts.appendChild(thisField);
        thisField.appendChild(thisName);
        thisField.appendChild(thisFieldPrimary);
        thisField.appendChild(thisFieldSequence);
        thisField.appendChild(thisBtnDelete);
      } else if (stepScope >= 1 && inout === "stub") {
        formPorts.appendChild(thisField);
        // thisField.appendChild(thisName);
        thisField.appendChild(scopeUl);
        console.log(stepScope);
        for (let i = 0; i < globalStepArray.length; i++) {
          let thisStepId = cellView.model.attributes.stepId;
          console.log(thisStepId);
          if (globalStepArray[i].stepScope < stepScope && globalStepArray[i].stepId !== thisStepId) {
          console.log(globalStepArray[i]);
            for (let j = 0; j < globalStepArray[i].portData.length; j++) {
              console.log("Yes");
              if (globalStepArray[i].portData[j].portGroup === "out") {
                let step = globalStepArray[i].stepId;
              console.log(step);
                let port = globalStepArray[i].portData[j].portId;
              console.log(port);
                let string = "" + port + "@" + step;
                console.log(string);
                // let thisOption = option.cloneNode().appendChild(document.createTextNode(string));
                let liEl = document.createElement('li');
                liEl.classList.add('stubListLi');
                liEl.appendChild(document.createTextNode(string));
                scopeUl.appendChild(liEl);
              }
            }
          }
        }
        thisField.appendChild(thisBtnDelete);
      }
    }

    //Load when clicking Step
    if (btn === false) {
      for (let i = 0; i < ports.length; i++) {
        let port = ports[i].portId;
        let primary = ports[i].portPrimary;
        let sequence = ports[i].portSequence;
        portLoadCont(port, primary, sequence);
      }
      //Load when Button is Clicked
    } else if (btn === true) {
      let primary = "unset";
      let sequence = "unset";
      portLoadCont(portId, primary, sequence)
    }

  }

  // Options-DIV
  let formOptions = form.cloneNode(true);
  let divOption = div.cloneNode();
  divOption.setAttribute('id', "divOption");
  let fieldsetOption = fieldset.cloneNode();
  let legendOption = fieldsetOption.appendChild(legend.cloneNode());
  legendOption.appendChild(document.createTextNode("Option"));
  let optionRequired = label.cloneNode(true);
  optionRequired.appendChild(document.createTextNode("required"));
  let selectRequired = selectBool.cloneNode(true);
  optionRequired.appendChild(selectRequired);
  let defaultInput = label.cloneNode(true);
  defaultInput.appendChild(document.createTextNode("default Input: "));
  let fieldsetOptionAdd = fieldset.cloneNode();
  let optionTypes = selectOptionType.cloneNode(true);
  fieldsetOptionAdd.appendChild(optionTypes);
  let btnOptionAdd = fieldsetOptionAdd.appendChild(inputBtn.cloneNode());
  btnOptionAdd.setAttribute('value', "add Option");
  btnOptionAdd.addEventListener('click', function () {
    let type = optionTypes.value;
    console.log(type);
    getId();
    let optionId = "option-" + newId;
    let optionObject = {
      "name": optionId,
      "required": "unset",
      "defaultInputType": type,
      "defaultInput": ""
    };
    if (type !== "unset") {
      createOptionContent(optionId, true, type);
      cellView.model.attributes.stepOption.push(optionObject);

    } else {
      alert("You first have to select an option type!");
    }
  });

  function optionInputLoad(dataId, input) {
    input.setAttribute('type', 'text');
    input.setAttribute('option', dataId);
    input.setAttribute('placeholder', dataId);
    input.setAttribute('value', dataId);
    input.addEventListener('change', function () {
      let idArray = [];
      for (let i = 0; i < stepOptions.length; i++) {
        idArray.push(stepOptions[i].name);
      }
      if (idArray.includes(this.value)) {
        alert("You can't choose the same Name twice!");
        input.value = "";
      } else {
        for (let i = 0; i < stepOptions.length; i++) {
          if (stepOptions[i].name === dataId) {
            stepOptions[i].name = this.value;
          }
        }
        let currentCells = graphX.getCells();
        graphX.resetCells(currentCells);
        metaPanel(cellView);
      }
    });
  }

  function defaultInputLoad(dataId, optInputType, optDefInput, input) {
    input.setAttribute('type', 'text');
    input.setAttribute('option', dataId);
    if (optInputType === "xs:boolean") {
      let sel = input.children;
      console.log(sel);
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].value === optDefInput) {
          sel[i].setAttribute('selected', "selected");
        }
      }
    }
    if (optDefInput !== undefined) {
      input.setAttribute('value', optDefInput);
    } else {
      input.setAttribute('placeholder', optInputType)
    }
    input.addEventListener('change', function () {
      for (let i = 0; i < stepOptions.length; i++) {
        if (stepOptions[i].name === dataId) {
          stepOptions[i].defaultInput = this.value;
        }
      }
    });
  }

  function optionValueLoad(dataId, input, cellView) {
    let optName = cellView.model.attributes.optionName;
    let parentId = cellView.model.attributes.parent;
    let parent = graphX.getCell(parentId);
    console.log(parent);
    let parentOptions = parent.attributes.stepOption;
    input.setAttribute('type', 'text');
    input.setAttribute('option', dataId);
    input.setAttribute('placeholder', dataId);
    input.addEventListener('change', function () {
      cellView.model.attributes.optionValue = this.value;
      for (let i = 0; i < parentOptions.length; i++) {
        if (parentOptions[i].name === optName) {
          parentOptions[i].value = this.value;
        }
      }
    });
  }

  function createOptionContent(optionId, btn, inputType) {
    function optionBtnDelete(btn, id, field) {
      btn.setAttribute('optionid', id);
      btn.addEventListener('click', function (e) {
        let thisId = e.target.attributes.optionid.nodeValue;
        for (let i = 0; i < stepOptions.length; i++) {
          if (stepOptions[i].name === thisId) {
            stepOptions.splice(i, 1);
          }
        }
        formOptions.removeChild(field);
      });
    }

    function optionLoadCont(optName, optRequired, optInputType, optDefInput) {
      let thisField = fieldsetOption.cloneNode(true);
      let thisName = optionName.cloneNode(true);
      let nameInput = thisName.appendChild(input.cloneNode(true));
      nameInput.classList.add("option");
      let noInputName = optionName.cloneNode(true);
      noInputName.classList.add("option-name");
      optionInputLoad(optName, nameInput);
      let thisFieldRequired = optionRequired.cloneNode(true);
      let requiredSelect = thisFieldRequired.childNodes[1];
      selectBoolean("opt", cellView, stepOptions, optName, optRequired, requiredSelect);
      let thisDefaultInput = defaultInput.cloneNode(true);
      thisDefaultInput.classList.add("option");
      let thisInputLoad = function () {
        // if (optInputType === "xs:string" || optInputType === "xs:integer") {
        if (optInputType === "xs:boolean" || optInputType === "boolean") {
          let bool = selectBool.cloneNode(true);
          thisDefaultInput.appendChild(bool);
          defaultInputLoad(optName, optInputType, optDefInput, bool);
        } else if (optInputType !== "xs:boolean") {
          let string = thisDefaultInput.appendChild(input.cloneNode(true));
          defaultInputLoad(optName, optInputType, optDefInput, string);
        }
      };
      thisInputLoad();
      let thisBtnDelete = btnDelete.cloneNode(true);
      optionBtnDelete(thisBtnDelete, optName, thisField);
      if (stepScope > 0) {
        formOptions.appendChild(thisField);
        thisField.appendChild(noInputName);
        noInputName.appendChild(document.createTextNode(optName));
        thisField.appendChild(thisFieldRequired);
        thisField.appendChild(thisDefaultInput);
        requiredSelect.setAttribute('disabled', "disabled");
      } else {
        formOptions.appendChild(thisField);
        thisField.appendChild(thisName);
        thisField.appendChild(thisFieldRequired);
        thisField.appendChild(thisDefaultInput);
        thisField.appendChild(thisBtnDelete);
      }
    }

    if (btn === false) {
      for (let i = 0; i < stepOptions.length; i++) {
        let optName = stepOptions[i].name;
        let optRequired = stepOptions[i].required;
        let optDefInputType = stepOptions[i].defaultInputType;
        let optDefInput = stepOptions[i].defaultInput;
        optionLoadCont(optName, optRequired, optDefInputType, optDefInput);
      }
      //Load when Button is Clicked
    } else if (btn === true) {
      let required = "unset";
      optionLoadCont(optionId, required, inputType);
    }
  }

  //Push Meta-Elements
  if (step.type === "xproc.Pipeline" && stepScope === 0) {
    // Info
    metaInfo.appendChild(formInfo);
    formInfo.appendChild(fieldsetInfo);
    fieldsetInfo.appendChild(labelPrefix);
    fieldsetInfo.appendChild(labelType);
    fieldsetInfo.appendChild(labelName);
    // Ports
    metaPorts.appendChild(divPortsHead);
    divPortsHead.appendChild(h3PortsInput);
    divPortsHead.appendChild(h3PortsOutput);
    metaPorts.appendChild(divInput);
    divInput.appendChild(formInput);
    formInput.appendChild(btnInputAdd);
    createPortContent(null, false, inputPorts, formInput, "in");
    metaPorts.appendChild(divOutput);
    divOutput.appendChild(formOutput);
    formOutput.appendChild(btnOutputAdd);
    createPortContent(null, false, outputPorts, formOutput, "out");

    // Options
    metaOptions.appendChild(divOption);
    divOption.appendChild(formOptions);
    formOptions.appendChild(fieldsetOptionAdd);
    createOptionContent(null, false);
  } else if (step.type === "xproc.Option") {
    let name = label.cloneNode(true);
    name.classList.add("option");
    name.classList.add("option-value");
    name.appendChild(document.createTextNode("Value: "));
    let h3Option = h3.cloneNode(true);
    h3Option.appendChild(document.createTextNode(optName));
    metaInfo.appendChild(h3Option);
    metaInfo.appendChild(formOptions);
    let thisName = name.cloneNode(true);
    let nameInput = thisName.appendChild(input.cloneNode(true));
    optionValueLoad(optValue, nameInput, cellView);
    formOptions.appendChild(thisName);
  } else if ((step.type === "xproc.Atomic" || step.type === "xproc.Compound") && stepScope >= 1) {
    // Info
    let type = document.createElement('h3');
    type.appendChild(document.createTextNode(stepType));
    metaInfo.appendChild(type);
    metaInfo.appendChild(formInfo);
    formInfo.appendChild(fieldsetInfo);
    fieldsetInfo.appendChild(labelName);
    // Ports
    metaPorts.appendChild(divPortsHead);
    divPortsHead.appendChild(h3PortsInput);
    divPortsHead.appendChild(h3PortsOutput);
    metaPorts.appendChild(divInput);
    divInput.appendChild(formInput);
    createPortContent(null, false, inputPorts, formInput, "in");
    metaPorts.appendChild(divOutput);
    divOutput.appendChild(formOutput);
    createPortContent(null, false, outputPorts, formOutput, "out");
    // Options
    metaOptions.appendChild(formOptions);
    createOptionContent(null, false);
  } else if (stepGroup === "xproc.Compound" && stepScope >= 2) {
    // Info
    let type = document.createElement('h3');
    type.appendChild(document.createTextNode(stepType));
    let name = document.createElement('h4');
    console.log(stepName);
    name.appendChild(document.createTextNode(stepName));
    metaInfo.appendChild(type);
    metaInfo.appendChild(name);
    // Ports
    metaPorts.appendChild(divPortsHead);
    divPortsHead.appendChild(h3PortsInput);
    divPortsHead.appendChild(h3PortsOutput);
    divPortsHead.appendChild(h3PortsStub);

    metaPorts.appendChild(divInput);
    divInput.appendChild(formInput);
    createPortContent(null, false, inputPorts, formInput, "in");
    metaPorts.appendChild(divOutput);
    divOutput.appendChild(formOutput);
    createPortContent(null, false, outputPorts, formOutput, "out");
    metaPorts.appendChild(divStub);
    divStub.appendChild(formStub);
    formStub.appendChild(btnStubAdd);
    createPortContent(null, false, stubPorts, formStub, "stub");
    // Options
    metaOptions.appendChild(formOptions);
    createOptionContent(null, false);
  }
}