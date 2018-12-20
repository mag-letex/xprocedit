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
paper.on('cell:pointerdblclick', function (cellView, evt) {
  cellPointerDblClick(cellView, evt);
});

function cellPointerDblClick(cellView, evt) {
  let modelType = cellView.model.attributes.type;
  let modelId = cellView.model.attributes.stepId;
  console.log(cellView.model.id);
  console.log(cellView);
  console.log(cellView.model);
  console.log(cellView.model.toJSON());
  // console.log(cellView);
  if (modelType === "xproc.Compound") {
    createPaperBtn(modelId, evt, cellView);
    globalPipeline = modelId;
    // localStorage.setItem(modelId, modelString);
  }
}

// let stepPrimary = [];
// let stepPrimaryPortGroup = [];
// let stepPrimarySequencePortGroup = [];
// let stepPrimarySequence = [];
// let stepPorts = step.getPorts();
// let stepPortsLength = stepPorts.length;
// for (let i = 0; i < stepPortsLength; i++) {
//   let stepString = JSON.stringify(step);
//   let stepModel = JSON.parse(stepString);
//   if (stepModel.portData[i].portPrimary === true && stepModel.portData[i].portSequence !== true) {
//     let portIdPrimary = stepModel.portData[i].portId;
//     let portIdPrimaryPortGroup = stepModel.portData[i].portGroup;
//     stepPrimary.push(portIdPrimary);
//     stepPrimaryPortGroup.push(portIdPrimaryPortGroup);
//   }
//   if (stepModel.portData[i].portPrimary === true && stepModel.portData[i].portSequence === true) {
//     let portIdPrimarySequence = stepModel.portData[i].portId;
//     let portIdPrimarySequencePortGroup = stepModel.portData[i].portGroup;
//     stepPrimarySequence.push(portIdPrimarySequence);
//     stepPrimarySequencePortGroup.push(portIdPrimarySequencePortGroup);
//   }
// }
// for (let j = 0; j < stepPrimary.length; j++) {
//   if (stepPrimaryPortGroup[j] === "in") {
//     step.portProp('' + stepPrimary[j], 'markup', '<g><circle class="port-body in-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
//   }
//   else if (stepPrimaryPortGroup[j] === "out") {
//     step.portProp('' + stepPrimary[j], 'markup', '<g><circle class="port-body out-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
//   }
// }
// for (let k = 0; k < stepPrimarySequence.length; k++) {
//   if (stepPrimarySequencePortGroup[k] === "in") {
//     step.portProp('' + stepPrimarySequence[k], 'markup', '<g><circle class="port-body in-ports primary-sequence" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold" font-size="0.9em">PS</text></g>');
//   }
//   else if (stepPrimarySequencePortGroup[k] === "out") {
//     step.portProp('' + stepPrimarySequence[k], 'markup', '<g><circle class="port-body out-ports primary-sequence" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold" font-size="0.9em">PS</text></g>');
//   }
// }
// graph.addCell(step.clone().translate(xRel, yRel).prop('id', '' + id + '_' + stepIdNum).attr({'.word2': {text: stepIdNum}}));
// });
// });