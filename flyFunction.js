// let pipelineString = JSON.stringify(xplD);
// let pipelineModel = JSON.parse(pipelineString);
// let pipelineWidth = pipelineModel.size.width;
// let pipelineHeight = pipelineModel.size.height;
// console.log ("Pipeline-Width: " + pipelineWidth);
// console.log ("Pipeline-Height: " + pipelineHeight);
// let globalWidth = 0;
// let globalHeight = 0;
let failedId = "";
let newId = "";
let idGlobal = [];

function getId() {
  let z1 = Math.random().toString().substring(2);
  let z2 = Math.random().toString().substring(2);
  newId = z1.charAt(0) + z2.charAt(1) + z1.charAt(2) + z2.charAt(3);

  if (idGlobal.indexOf(newId) === -1 && idGlobal.length <= 9999) {
    idGlobal.push(newId);
    return newId;
  } else if (idGlobal.length <= 9999) {
    failedId = newId;
    getId();
  } else return alert("No Element-IDs left!");
}

//LOAD STEPS INTO PAPER
//DOUBLE-CLICK-FUNCTION
function stepLoad(elem, placeX, placeY) {
  getId();
  let id = elem.id;
  let stepIdNum = newId;
  let stepId = "" + id + "_" + stepIdNum;
  let i;
  for (i = 0; i < superObj.length; i++) {
    if (superObj[i].stepType === id) {
      let group = superObj[i].stepGroup;
      if (group === "xproc.Atomic") {
        loadAtomicStep(i, stepIdNum, stepId, placeX, placeY);
      }
      if (group === "xproc.Compound") {
        loadCompoundStep(i, stepIdNum, stepId, placeX, placeY);
      }
    }
  }
}

function loadAtomicStep(i, stepIdNum, stepId, placeX, placeY) {
  let stepOptionArray = superObj[i].stepOption;
  let newCell = new joint.shapes.xproc.Atomic(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.embed(newCell);
  let stepOptionPosY = placeY + 100;
  for (let j = 0; j < stepOptionArray.length; j++) {
    let stepOptionName = stepOptionArray[j].name;
    newStepOption = newStepOption.clone()
      .prop('id', "" + stepId + "_opt_" + stepOptionName)
      .position(placeX, stepOptionPosY)
      .attr({
        ".label": {text: stepOptionName}, rect: {fill: '#ff6d5c'}
      });
    graphX.addCell(newStepOption);
    newCell.embed(newStepOption);
    stepOptionPosY = stepOptionPosY + 20;
  }
}

function loadCompoundStep(i, stepIdNum, stepId, placeX, placeY) {
  let stepOptionArray = superObj[i].stepOption;
  testGraph.push(stepId);
  let newCell = new joint.shapes.xproc.Compound(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.embed(newCell);
  let stepOptionPosY = placeY + 100;
  for (let j = 0; j < stepOptionArray.length; j++) {
    let stepOptionName = stepOptionArray[j].name;
    newStepOption = newStepOption.clone()
      .prop('id', "" + stepId + "_opt_" + stepOptionName)
      .position(placeX, stepOptionPosY)
      .attr({
        ".label": {text: stepOptionName}, rect: {fill: '#a1c9ff'}
      });
    graphX.addCell(newStepOption);
    newCell.embed(newStepOption);
    stepOptionPosY = stepOptionPosY + 20;
  }
}

// PAPER - FUNCITONS
paper.on('element:mouseover', function (cellView) {
  let stepId;
  let model;
  let modelId;
  if (cellView.model.attributes.type !== "xproc.Option") {
    stepId = cellView.model.id;
    model = document.querySelector('[model-id="' + stepId + '"]').firstChild;
    modelId = model.id;
  }
  // else if (cellView.model.attributes.type === "xproc.Option") {
  //   stepId = cellView.model.changed.parent;
  // }
  $('#' + modelId + " .port-label").fadeIn('fast');
});
paper.on('element:mouseout', function (cellView) {
  let stepId;
  let model;
  let modelId;
  if (cellView.model.attributes.type !== "xproc.Option") {
    stepId = cellView.model.id;
    model = document.querySelector('[model-id="' + stepId + '"]').firstChild;
    modelId = model.id;
  }
  // else if (cellView.model.attributes.type === "xproc.Option") {
  //   stepId = cellView.model.changed.parent;
  // }
  $('#' + modelId + " .port-label").fadeOut('fast');
});
let prefix = "unset";
let name = "unset";
paper.on('cell:pointerclick', function (cellView, evt) {
  console.log(cellView.model.attributes);
  //Step-Information
  let step = cellView.model.toJSON();
  let stepId = step.id;
  let stepType = step.stepType;
  let stepPrefix = cellView.model.attributes.stepPrefix;
  let stepName = cellView.model.attributes.stepName;
  let ports = cellView.model.attributes.portData;
  //Panel-Areas
  let metaPanel = document.querySelector('#metaContent');
  let metaArea = document.querySelectorAll('.metaArea');
  let metaInfo = document.querySelector('#metaInfo');
  let metaPorts = document.querySelector('#metaPorts');
  let metaOptions = document.querySelector('#metaOptions');

  $('.metaArea').css('display', 'block');

  for (let i=0; i<metaArea.length; i++) {
    while (metaArea[i].childNodes.length > 2) {
      metaArea[i].removeChild(metaArea[i].lastChild);
    }
  }
  //Form Elements
  let form = document.createElement('form');
  form.setAttribute('onSubmit', "return false;");
  let fieldset = document.createElement('fieldset');
  let legend = document.createElement('legend');
  let label = document.createElement('label');
  let input = document.createElement('input');
  let inputBtn = input.cloneNode();
  inputBtn.setAttribute('type', "button");
  let select = document.createElement('select');
  let option = document.createElement('option');
  let h3 = document.createElement('h3');

  //Info-DIV
  let formInfo = form.cloneNode();
  let fieldsetName = fieldset.cloneNode();
  let legendName = fieldsetName.appendChild(legend.cloneNode());
  legendName.appendChild(document.createTextNode("Name"));
  let btnName = inputBtn.cloneNode();
  btnName.setAttribute('value', "set Name");
  let labelName = label.cloneNode();
  labelName.appendChild(document.createTextNode("Name/ Type"));
  let inputName = labelName.appendChild(input.cloneNode());
  inputName.setAttribute('type', 'text');
  if (stepName === "unset") {
    inputName.setAttribute('value', "");
  } else {
    inputName.setAttribute('value', name);
  }
  inputName.setAttribute('placeholder', stepType);
  let labelPrefix = label.cloneNode();
  labelPrefix.appendChild(document.createTextNode("Choose a Prefix: "));
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
    createPrefix("c:"),
    createPrefix("d:"),
    createPrefix("e:")
  ];
  for (let i = 0; i < prefixes.length; i++) {
    selectPrefix.appendChild(prefixes[i]);
  }
  for (let i = 0; i < prefixOptions.length; i++) {
    if (stepPrefix === prefixOptions[i].value) {
      prefixOptions[i].setAttribute('selected', "selected");
    }
  }
  selectPrefix.addEventListener('change', function (target) {
    console.log(this.value);
    prefix = this.value;
    cellView.model.attributes.stepPrefix = this.value;
    let type = "" + prefix + name;
    cellView.model.attributes.stepType = type;
    cellView.model.attributes.attrs[".label"].text = type;
    let currentCells = graphX.getCells();
    graphX.resetCells(currentCells);
  });
  inputName.addEventListener('change', function () {
    console.log(this.value);
    name = this.value;
    cellView.model.attributes.stepName = this.value;
    let type = "" + prefix + name;
    cellView.model.attributes.stepType = type;
    cellView.model.attributes.attrs[".label"].text = type;
    let currentCells = graphX.getCells();
    graphX.resetCells(currentCells);
  });
  inputName.addEventListener('keydown', function (e) {
    if (e.which === 13) {
      name = this.value;
      let type = "" + prefix + name;
      cellView.model.attributes.stepType = type;
      cellView.model.attributes.attrs[".label"].text = type;
      let currentCells = graphX.getCells();
      graphX.resetCells(currentCells);
    }
  });
  btnName.addEventListener('click', function () {
    console.log("" + prefix + name)
    let type = "" + prefix + name;
    cellView.model.attributes.attrs[".label"].text = type;
    cellView.model.attributes.stepType = type;
    cellView.model.attributes.stepPrefix = prefix;
    cellView.model.attributes.stepName = name;
    let currentCells = graphX.getCells();
    graphX.resetCells(currentCells);
  });

  //PORTS-DIV
  let h3PortsInput = h3.cloneNode();
  h3PortsInput.appendChild(document.createTextNode("Input-Ports"));
  let h3PortsOutput = h3.cloneNode();
  h3PortsOutput.appendChild(document.createTextNode("Output-Ports"));
  let formInput = form.cloneNode();
  let btnInputAdd = inputBtn.cloneNode();
  btnInputAdd.setAttribute('value', "add In-Port");
  btnInputAdd.addEventListener('click', function(){
    cellView.model.addPort(inPort);
  });
  formInput.appendChild(btnInputAdd);
  let fieldsetInput = fieldset.cloneNode();
  formInput.appendChild(fieldsetInput);
  let legendInput = fieldsetInput.appendChild(legend.cloneNode());
  legendInput.appendChild(document.createTextNode("In-Port"));
  let formOutput = form.cloneNode();
  let btnOutputAdd = inputBtn.cloneNode();
  btnOutputAdd.setAttribute('value', "add Out-Port");
  btnOutputAdd.addEventListener('click', function(){
    cellView.model.addPort(outPort);
  });
  formOutput.appendChild(btnOutputAdd);
  let fieldsetOutput = fieldset.cloneNode();
  formOutput.appendChild(fieldsetOutput);
  let legendOutput = fieldsetOutput.appendChild(legend.cloneNode());
  legendOutput.appendChild(document.createTextNode("Out-Port"));

  //OPTIONS-DIV
  let formOptions = form.cloneNode();
  let btnOptionAdd = inputBtn.cloneNode();
  btnOptionAdd.setAttribute('value', "add Option");
  btnOptionAdd.addEventListener('click', function(){
    // cellView.model.addPort(inPort);
    console.log("Here comes an Option!");
  });
  formOptions.appendChild(btnOptionAdd);
  let fieldsetOption = fieldset.cloneNode();
  formOptions.appendChild(fieldsetOption);
  let legendOption = fieldsetOption.appendChild(legend.cloneNode());
  legendOption.appendChild(document.createTextNode("Option"));
  //PUSH ELEMENTS
  if (step.type === "xproc.Pipeline") {
    //MetaInfo - push Elements
    metaInfo.appendChild(formInfo);
    formInfo.appendChild(fieldsetName);
    fieldsetName.appendChild(labelPrefix);
    fieldsetName.appendChild(labelName);
    fieldsetName.appendChild(btnName);
  } else {
    //MetaInfo - push Elements
    let type = document.createElement('h3');
    let id = document.createElement('p');
    let idNum = cellView.model.attributes.attrs[".word2"].text;
    id.appendChild(document.createTextNode(idNum));
    type.appendChild(document.createTextNode(stepType));
    metaInfo.appendChild(type);
    metaInfo.appendChild(id);
  }
  //Push Ports-Elements
  metaPorts.appendChild(h3PortsInput);
  metaPorts.appendChild(formInput);

  metaPorts.appendChild(h3PortsOutput);
  metaPorts.appendChild(formOutput);


  //Push Option-Elements
  metaOptions.appendChild(formOptions);


});
paper.on('cell:pointerdblclick', function (cellView, evt) {
  cellPointerDblClick(cellView, evt);
});

function cellPointerDblClick(cellView, evt) {
  let modelType = cellView.model.attributes.type;
  let modelId = cellView.model.attributes.stepId;
  console.log(cellView.model.id);
  console.log(cellView.model.toJSON());
  // console.log(cellView);
  if (modelType === "xproc.Compound") {
    createPaperBtn(modelId, evt, cellView);
    globalPipeline = modelId;
    // localStorage.setItem(modelId, modelString);
  }
}