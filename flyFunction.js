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
  }
  else return alert("No Element-IDs left!");
}

//LOAD STEPS INTO PAPER
//DOUBLE-CLICK-FUNCTION
function stepLoad (elem) {
  // console.log("Hello Load-Function");
  // console.log(elem);
  getId();
  let id = elem.id;
  let step;
  let stepIdNum = newId;
  switch (id) {
    //Atomic Steps
    case "pAddAttribute":
      step = pAddAttributeD;
      break;
    case "pAddXmlBase":
      step = pAddXmlBaseD;
      break;
    case "pCompare":
      step = pCompareD;
      break;
    case "pCount":
      step = pCountD;
      break;
    case "pDelete":
      step = pDeleteD;
      break;
    case "pDirectoryList":
      step = pDirectoryListD;
      break;
    case "pError":
      step = pErrorD;
      break;
    case "pEscapeMarkup":
      step = pEscapeMarkupD;
      break;
    //Compound Steps
    case "pForEach":
      step = pForEachD;
      break;
    case "pViewport":
      step = pViewportD;
      break;
    case "pTryCatch":
      step = pTryCatchD;
      break;
    case "pChoose":
      step = pChooseD;
      break;
    default:
      step = xTestObject;
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
  graph.addCell(step.clone().translate(xRel, yRel).prop('id', '' + id + '_' + stepIdNum).attr({'.word2': {text: stepIdNum}}));
  // });
// });
}

//Fly - Function
// let blaFunc = function (cellView, e, x, y) {
//   $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:1;pointer-event:none;background-color:transparent;"></div>');
//   let flyGraph = new joint.dia.Graph,
//     flyPaper = new joint.dia.Paper({
//       el: $('#flyPaper'),
//       model: flyGraph,
//       interactive: false
//     }),
//     flyShape = cellView.model.clone(),  //könnte wieder über ein Switch zugeordnet werden
//     // cellView.model.clone()
//     pos = cellView.model.position(),
//     // cellView.model.position()
//     offset = {
//       x: x - pos.x,
//       y: y - pos.y
//     };
//   let flyJSON = cellView.model.toJSON();
//   // let flyJSONid = stencilId;
//   let flyJSONid = flyJSON.id;
//   let testtext = flyShape.prop('attrs/text/text');
//   let testcolor = flyShape.prop('attrs/rect/fill');
//
//   flyShape.position(0, 0);
//   flyGraph.addCell(flyShape);
//
//   $('#flyPaper').offset({
//     // left: pageX - offset.x,
//     // top: pageX - offset.y
//     left: e.pageX - offset.x,
//     top: e.pageY - offset.y
//   });
//   $('body').on('mousemove.fly', function (e) {
//     $("#flyPaper").offset({
//       // left: pageX - offset.x,
//       // top: pageY - offset.y
//       left: e.pageX - offset.x,
//       top: e.pageY - offset.y
//     });
//   });
//
//   $('body').on('mouseup.fly', function (e) {
//
//     let x = e.pageX,
//       y = e.pageY,
//       // x = e.pageX,
//       // y = e.pageY,
//       target = paperX.$el.offset();
//     let stepIdNum = newId;
//     // Dropped over paperX ?
//     if (x > target.left && x < target.left + paperX.$el.width() && y > target.top && y < target.top + paperX.$el.height()) {
//
//       // Referenzierung der Variablen -- String --> Variable
//       switch (flyJSONid) {
//         case "pAddAttribute":
//           stepX = pAddAttributeD;
//           break;
//         case "pAddXmlBase":
//           stepX = pAddXmlBaseD;
//           break;
//         case "pCompare":
//           stepX = pCompareD;
//           break;
//         case "pCount":
//           stepX = pCountD;
//           break;
//         case "pDelete":
//           stepX = pDeleteD;
//           break;
//         case "pDirectoryList":
//           stepX = pDirectoryListD;
//           break;
//         case "pError":
//           stepX = pErrorD;
//           break;
//         case "pEscapeMarkup":
//           stepX = pEscapeMarkupD;
//           break;
//         case "pForEach":
//           stepX = pForEachD;
//           break;
//         case "pViewport":
//           stepX = pViewportD;
//           break;
//         case "pTryCatch":
//           stepX = pTryCatchD;
//           break;
//         case "pChoose":
//           stepX = pChooseD;
//           break;
//         case "xProcTest":
//           stepX = xTestObject;
//           break;
//         case "xMyAtomicStep":
//           stepX = xMyAtomicStepD;
//           break;
//         case "xMyCompoundStep":
//           stepX = xMyCompoundStepD;
//           break;
//         default:
//           stepX = xTestObject;
//       }
//       getId();
//       let stepXmodel = stepX.toJSON();
//
//       //Erst wenn gedropped wird, wird das Element erstellt
//       if (flyJSONid == stepXmodel.stepType) {
//         stepX.position(x - target.left - offset.x, y - target.top - offset.y);
//         stepxX = stepX.clone().prop('id', '' + flyJSONid + '_' + stepIdNum).attr({'.word2': {text: stepIdNum}});
//         let stepxXstring = JSON.stringify(stepxX);
//         let stepxXmodel = JSON.parse(stepxXstring);
//         let stepxXmodelWidth = stepxXmodel.size.width;
//         let stepxXmodelHeight = stepxXmodel.size.height;
//         let stepxXprimary = stepxXmodel.portData[0].portPrimary;
//         let stepxXsequence = stepxXmodel.portData[0].portSequence;
//         let stepxXports = stepxX.getPorts();
//         let stepxXportsLength = stepxXports.length;
//         let stepxXprimaries = [];
//         let stepxXprimariesPortGroup = [];
//         let stepxXprimariessequencePortGroup = [];
//         let stepxXprimarysequence = [];
//         for (i = 0; i < stepxXportsLength; i++) {
//           if (stepxXmodel.portData[i].portPrimary == true && stepxXmodel.portData[i].portSequence != true) {
//             let portIdPrimary = stepxXmodel.portData[i].portId;
//             let portIdPrimaryPortGroup = stepxXmodel.portData[i].portGroup;
//             stepxXprimaries.push(portIdPrimary);
//             stepxXprimariesPortGroup.push(portIdPrimaryPortGroup);
//           }
//           if (stepxXmodel.portData[i].portPrimary == true && stepxXmodel.portData[i].portSequence == true) {
//             let portIdPrimarySequence = stepxXmodel.portData[i].portId;
//             let portIdPrimarySequencePortGroup = stepxXmodel.portData[i].portGroup;
//             stepxXprimarysequence.push(portIdPrimarySequence);
//             stepxXprimariessequencePortGroup.push(portIdPrimarySequencePortGroup);
//           }
//         }
//         for (j = 0; j < stepxXprimaries.length; j++) {
//           if (stepxXprimariesPortGroup[j] == "in") {
//             stepxX.portProp('' + stepxXprimaries[j], 'markup', '<g><circle class="port-body in-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
//           }
//           else if (stepxXprimariesPortGroup[j] == "out") {
//             stepxX.portProp('' + stepxXprimaries[j], 'markup', '<g><circle class="port-body out-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
//           }
//         }
//         for (k = 0; k < stepxXprimarysequence.length; k++) {
//           if (stepxXprimariessequencePortGroup[k] == "in") {
//             stepxX.portProp('' + stepxXprimarysequence[k], 'markup', '<g><circle class="port-body in-ports primary-sequence" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold" font-size="0.9em">PS</text></g>');
//           }
//           else if (stepxXprimariessequencePortGroup[k] == "out") {
//             stepxX.portProp('' + stepxXprimarysequence[k], 'markup', '<g><circle class="port-body out-ports primary-sequence" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold" font-size="0.9em">PS</text></g>');
//           }
//         }
//         // globalWidth = globalWidth + stepxXmodelWidth;
//         // globalHeight = globalHeight + stepxXmodelHeight;
//
//         graphX.addCell(stepxX);
//         cellView = paperX.findViewByModel('' + flyJSONid + '_' + stepIdNum);
//         stepxXmodel = stepxX.toJSON();
//         let boeppelId = "" + stepxX.id + "_boep_";
//         let modelX = stepxX.get('position').x;
//         let modelY = stepxX.get('position').y;
//         let modelColor = stepxX.attributes.attrs.rect.fill;
//         let modelYbottom = modelY + 100;
//         for (l = 0; l < stepxXmodel.stepOption.length; l++) {
//
//           let optionName = stepxXmodel.stepOption[l].name;
//           let optionRequired = stepxXmodel.stepOption[l].required;
//           // makeBoeppl(cellView, boeppelId, optionName);
//           graph.addCell(newBoeppel.clone()
//             .translate(modelX, modelYbottom)
//             .attr({
//               '.label': {text: optionName},
//               rect: {fill: modelColor}
//             })
//             .prop('id', boeppelId + (l + 1))
//             .prop('stepOption/name', optionName)
//             .prop('stepOption/required', optionRequired)
//           );
//           modelYbottom = modelYbottom + 20;
//           let newOption = graph.getCell(boeppelId + (l + 1));
//           V(paper.findViewByModel(newOption).el).addClass('newBoeppel');
//           cellView.model.embed(newOption);
//         }
//         V(paperX.findViewByModel(stepxX).el).addClass('xprocStep');
//         xplD.embed(stepxX);
//       }
//       else {
//         xTestObject.position(x - target.left - offset.x, y - target.top - offset.y);
//         graphX.addCell(xTestObject);
//       }
//     }
//     $('body').off('mousemove.fly').off('mouseup.fly');
//     flyShape.remove();
//     $('#flyPaper').remove();
//
//     cellView = paperX.findViewByModel('' + flyJSONid + '_' + stepIdNum);
//
//     metaActive(cellView);
//   });
// };
// stencilPaper.on('cell:pointerdown', blaFunc);