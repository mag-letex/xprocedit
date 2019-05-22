// let metaPanelDeux = Backbone.View.extend ({
//   el: '#meta2',
//   initialize: function(){
//     this.render();
//   },
//   render: function(){
//     this.$el.html("Hello TutorialsPoint!!!");
// }
// });
// let metaView = new metaPanelDeux();


// // create a model class
// let testModel = Backbone.Model.extend({});
//
// // create a model instance
// let testItem = new testModel({
//   description: 'Pick up milk',
//   status: 'incomplete',
//   id: 1
// }) ;
//
// // to get an attribute
// testItem.get('description');
// // to set an attribute
// testItem.set({status: 'complete'});
// // sync to server
// testItem.save();
//
//
// // create a view class
// let testView = Backbone.View.extend({
//   render: function(){
//     let html = '<h3>' + this.model.get('description') + '</h3>';
//     $(this.el).html(html);
//   }
// });
// // create a view instance
// let viewInstance = new testView({
//   model: testItem
// });
// testView.render();

// Load Steps into Paper
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
      if (group === "xproc.Custom") {
        loadCustomStep(i, stepIdNum, stepId, placeX, placeY);
      }
    }
  }
  let cell = paperX.findViewByModel(stepId);
  metaPanel(cell);
}

function loadAtomicStep(i, stepIdNum, stepId, placeX, placeY) {
  let newCell = new joint.shapes.xproc.Atomic(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
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

function loadCompoundStep(i, stepIdNum, stepId, placeX, placeY) {
  testGraph.push(stepId);
  let newCell = new joint.shapes.xproc.Compound(superObj[i])
    .prop('id', stepId)
    .prop('stepId', stepId)
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
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
    .attr({'.word2': {text: stepIdNum}})
    .position(placeX, placeY);
  graphX.addCell(newCell);
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
  if (modelType === "xproc.Compound") {
    createPaperBtn(modelId, evt, cellView);
    globalPipeline = modelId;
  }
}

//HIGHLIGHTING FUNCTION
let oldCellView = null;
clickHighlight = 0;
paper.on('element:pointerdown', function (cellView) {
  //HIGHLIGHTING FUNCTION
  if (oldCellView != null) {
    oldCellView.unhighlight(null, {
      highlighter: {
        name: 'addClass',
        options: {
          className: 'highlight-class'
        }
      }
    });
    // V(paper.findViewByModel(oldCellView.model).el).removeClass('highlight-class');
  }
  if (oldCellView !== cellView) {
    // V(paper.findViewByModel(cellView.model).el).addClass('highlight-class');
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
});
document.addEventListener('keydown', function (e) {
  if (e.which === 46) {
    if (oldCellView.model.attributes.type !== "xproc.Pipeline") {
      let connectedLinks = graphX.getConnectedLinks(oldCellView.model);
      let embeds = oldCellView.model.getEmbeddedCells();
      console.log(connectedLinks);
      console.log("DELETE");
      graphX.removeCells(embeds);
      graphX.removeCells(connectedLinks);
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
let name = "unset";

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
const optionUnset = option.cloneNode();
optionUnset.appendChild(document.createTextNode("unset"));
const optionTrue = option.cloneNode();
optionTrue.appendChild(document.createTextNode("true"));
const optionFalse = option.cloneNode();
optionFalse.appendChild(document.createTextNode("false"));
const optionString = option.cloneNode();
optionString.appendChild(document.createTextNode("xs-string"));
const h3 = document.createElement('h3');
const div = document.createElement('div');


const fieldsetPort = fieldset.cloneNode();
fieldsetPort.classList.add("port-field");
const legendPort = fieldsetPort.appendChild(legend.cloneNode());
legendPort.appendChild(document.createTextNode("Port"));


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

function metaPanel(cellView) {
  //Step-Information
  currentCell = cellView;
  let step = cellView.model.toJSON();
  let stepType = cellView.model.attributes.stepType;
  let stepPrefix = cellView.model.attributes.stepPrefix;
  let stepName = cellView.model.attributes.stepName;
  let portData = cellView.model.attributes.portData;
  let inPorts = cellView.model.attributes.inPorts;
  let outPorts = cellView.model.attributes.outPorts;
  let stepOptions = cellView.model.attributes.stepOption;
  let optName = cellView.model.attributes.optionName;
  let optRequired = cellView.model.attributes.optionRequired;
  let optValue = cellView.model.attributes.optionValue;
  let inputPorts = [];
  let outputPorts = [];
  console.log(step);
  for (let i = 0; i < portData.length; i++) {
    if (portData[i].portGroup === "in") {
      inputPorts.push(portData[i]);
    } else if (portData[i].portGroup === "out") {
      outputPorts.push(portData[i]);
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
  let fieldsetName = fieldset.cloneNode();
  let legendName = fieldsetName.appendChild(legend.cloneNode());
  legendName.appendChild(document.createTextNode("Name"));
  let labelName = label.cloneNode();
  labelName.appendChild(document.createTextNode("Type: "));
  let inputName = labelName.appendChild(input.cloneNode());
  inputName.setAttribute('type', 'text');
  inputName.classList.add("inputNameInfo");
  if (stepName === "unset") {
    inputName.setAttribute('value', "");
  } else {
    inputName.setAttribute('value', name);
  }
  inputName.setAttribute('placeholder', stepType);
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
  selectPrefix.addEventListener('change', function () {
    prefix = this.value;
    let type = "" + prefix + name;
    stepPrefix = prefix;
    stepType = type;
    cellView.model.attr({".label": {text: type}});
    console.log(cellView.model);
  });
  inputName.addEventListener('change', function () {
    name = this.value;
    let type = "" + prefix + "-" + name;
    let label = "" + prefix + ":" + name;
    stepName = name;
    stepType = type;
    cellView.model.attr({".label": {text: label}});
  });
  inputName.addEventListener('keyup', function (e) {
    if (e.which !== 13) {
      name = this.value;
      let type = "" + prefix + "-" + name;
      let label = "" + prefix + ":" + name;
      stepName = this.value;
      stepType = type;
      cellView.model.attr({".label": {text: label}});
    }
  });

  // Ports-DIV
  let divPortsHead = div.cloneNode();
  divPortsHead.setAttribute('id', "divPortsHead");

  //Port-Primary Dummy
  let portPrimary = label.cloneNode(true);
  portPrimary.appendChild(document.createTextNode("primary"));
  let selectPrimary = select.cloneNode(true);
  selectPrimary.appendChild(optionUnset.cloneNode(true));
  selectPrimary.appendChild(optionTrue.cloneNode(true));
  selectPrimary.appendChild(optionFalse.cloneNode(true));
  portPrimary.appendChild(selectPrimary);

  //Port-Sequence Dummy
  let portSequence = label.cloneNode(true);
  portSequence.appendChild(document.createTextNode("sequence"));
  let selectSequence = select.cloneNode(true);
  selectSequence.appendChild(optionUnset.cloneNode(true));
  selectSequence.appendChild(optionTrue.cloneNode(true));
  selectSequence.appendChild(optionFalse.cloneNode(true));
  portSequence.appendChild(selectSequence);

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
      divOutput.style.display = "none";
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
      divInput.style.display = "none";
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
    createPortContent(portId, true, outputPorts, formOutput, "out");
    cellView.model.attributes.portData.push(portObject);
  });
  let fieldsetOutput = fieldset.cloneNode();
  fieldsetOutput.classList.add("port-field");
  let legendOutput = fieldsetOutput.appendChild(legend.cloneNode());
  legendOutput.appendChild(document.createTextNode("Out-Port"));

  function createPortContent(portId, btn, ports, formPorts, inout) {
    // Basic Elements
    let field = fieldsetPort.cloneNode(true);
    let name = label.cloneNode(true);
    name.classList.add("port-name");
    // Delete-Button
    let btnDelete = inputBtn.cloneNode();
    btnDelete.setAttribute('value', "X");

    function loadBtnDelete(btn, id, field) {
      btn.setAttribute('portId', id);
      btn.addEventListener('click', function (e) {
        let thisId = e.target.attributes.portId.nodeValue;
        if (inout === "in") {
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
          }
          let currentCells = graphX.getCells();
          graphX.resetCells(currentCells);
        }
      });
    }

    //Load when clicking Step
    if (btn === false) {
      // if(step.type === xProc)
      for (let i = 0; i < ports.length; i++) {
        let port = ports[i].portId;
        let primary = ports[i].portPrimary;
        let sequence = ports[i].portSequence;
        let thisField = field.cloneNode(true);
        let thisName = name.cloneNode(true);
        let noInputName = name.cloneNode(true);
        let nameInput = thisName.appendChild(input.cloneNode(true));
        nameInputLoad(port, nameInput);
        //Primary Select Settings
        let thisFieldPrimary = portPrimary.cloneNode(true);
        let primarySelect = thisFieldPrimary.childNodes[1];
        selectBoolean("port", cellView, portData, port, primary, primarySelect, "primary");
        //Sequence Select Settings
        let thisFieldSequence = portSequence.cloneNode(true);
        let sequenceSelect = thisFieldSequence.childNodes[1];
        selectBoolean("port", cellView, portData, port, sequence, sequenceSelect, "sequence");
        //Delete Button
        let thisBtnDelete = btnDelete.cloneNode(true);
        loadBtnDelete(thisBtnDelete, port, thisField);

        //Initialization
        if (step.type === "xproc.Pipeline") {
          formPorts.appendChild(thisField);
          thisField.appendChild(thisName);
          thisField.appendChild(thisFieldPrimary);
          thisField.appendChild(thisFieldSequence);
          thisField.appendChild(thisBtnDelete);
        } else {
          formPorts.appendChild(thisField);
          thisField.appendChild(noInputName);
          noInputName.appendChild(document.createTextNode(ports[i].portId));
          thisField.appendChild(thisFieldPrimary);
          thisField.appendChild(thisFieldSequence);
          primarySelect.setAttribute('disabled', "disabled");
          sequenceSelect.setAttribute('disabled', "disabled");
        }
      }
      //Load when Button is Clicked
    } else if (btn === true) {
      let primary = "unset";
      let sequence = "unset";
      let thisField = field.cloneNode(true);
      let thisName = name.cloneNode(true);
      let nameInput = thisName.appendChild(input.cloneNode(true));
      nameInputLoad(portId, nameInput);
      let thisFieldPrimary = portPrimary.cloneNode(true);
      let primarySelect = thisFieldPrimary.childNodes[1];
      selectBoolean("port", cellView, portData, portId, primary, primarySelect, "primary");
      let thisFieldSequence = portSequence.cloneNode(true);
      let sequenceSelect = thisFieldSequence.childNodes[1];
      selectBoolean("port", cellView, portData, portId, sequence, sequenceSelect, "sequence");
      let thisBtnDelete = btnDelete.cloneNode(true);
      loadBtnDelete(thisBtnDelete, portId, thisField);
      formPorts.appendChild(thisField);
      thisField.appendChild(thisName);
      thisField.appendChild(thisFieldPrimary);
      thisField.appendChild(thisFieldSequence);
      thisField.appendChild(thisBtnDelete);
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
  let selectRequired = select.cloneNode(true);
  selectRequired.appendChild(optionUnset.cloneNode(true));
  selectRequired.appendChild(optionTrue.cloneNode(true));
  selectRequired.appendChild(optionFalse.cloneNode(true));
  optionRequired.appendChild(selectRequired);
  let fieldsetOptionAdd = fieldset.cloneNode();
  let btnOptionAdd = fieldsetOptionAdd.appendChild(inputBtn.cloneNode());
  btnOptionAdd.setAttribute('value', "add Option");
  btnOptionAdd.addEventListener('click', function () {
    getId();
    let optionId = "option-" + newId;
    let optionObject = {
      "name": optionId,
      "required": "unset",
    };
    createOptionContent(optionId, true);
    cellView.model.attributes.stepOption.push(optionObject);
  });
  let selectOptionAdd = fieldsetOptionAdd.appendChild(select.cloneNode(true));
  selectOptionAdd.appendChild(optionString.cloneNode(true));

  function optionInputLoad(dataId, input) {
    input.setAttribute('type', 'text');
    input.setAttribute('option', dataId);
    input.setAttribute('placeholder', dataId);
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

  function optionValueLoad(dataId, input, cellView) {
    input.setAttribute('type', 'text');
    input.setAttribute('option', dataId);
    input.setAttribute('placeholder', dataId);
    input.addEventListener('change', function () {
      cellView.model.attributes.optionValue = this.value;
    });
  }

  function createOptionContent(optionId, btn) {
    // Basic Elements
    let name = label.cloneNode(true);
    name.classList.add("option-name");
    // Delete Button
    let btnDelete = inputBtn.cloneNode();
    btnDelete.setAttribute('value', "X");

    function loadBtnDelete(btn, id, field) {
      btn.setAttribute('optionid', id);
      btn.addEventListener('click', function (e) {
        let thisId = e.target.attributes.optionid.nodeValue;
        for (let i = 0; i < stepOptions.length; i++) {
          if (stepOptions[i].name === thisId) {
            console.log("true");
            stepOptions.splice(i, 1);
          }
        }
        formOptions.removeChild(field);
      });
    }

    if (btn === false) {
      for (let i = 0; i < stepOptions.length; i++) {
        let optName = stepOptions[i].name;
        let optRequired = stepOptions[i].required;
        let thisField = fieldsetOption.cloneNode(true);
        let thisName = name.cloneNode(true);
        thisName.classList.add("option-name");
        let nameInput = thisName.appendChild(input.cloneNode(true));
        optionInputLoad(optName, nameInput);
        let noInputName = name.cloneNode(true);
        noInputName.classList.add("option-name");
        //Required Select Settings
        let thisFieldRequired = optionRequired.cloneNode(true);
        let requiredSelect = thisFieldRequired.childNodes[1];
        selectBoolean("opt", cellView, stepOptions, optName, optRequired, requiredSelect);
        //Delete Button
        let thisBtnDelete = btnDelete.cloneNode(true);
        loadBtnDelete(thisBtnDelete, optName, thisField);

        //Initialization
        if (step.type === "xproc.Pipeline") {
          formOptions.appendChild(thisField);
          thisField.appendChild(thisName);
          thisField.appendChild(thisFieldRequired);
          thisField.appendChild(thisBtnDelete);
        } else {
          formOptions.appendChild(thisField);
          thisField.appendChild(noInputName);
          noInputName.appendChild(document.createTextNode(optName));
          thisField.appendChild(thisFieldRequired);
          requiredSelect.setAttribute('disabled', "disabled");
        }
      }
      //Load when Button is Clicked
    } else if (btn === true) {
      let required = "unset";
      let thisField = fieldsetOption.cloneNode(true);
      let thisName = name.cloneNode(true);
      let nameInput = thisName.appendChild(input.cloneNode(true));
      optionInputLoad(optionId, nameInput);
      let thisFieldRequired = optionRequired.cloneNode(true);
      let requiredSelect = thisFieldRequired.childNodes[1];
      selectBoolean("opt", cellView, stepOptions, optionId, required, requiredSelect);
      let thisBtnDelete = btnDelete.cloneNode(true);
      loadBtnDelete(thisBtnDelete, optionId, thisField);
      formOptions.appendChild(thisField);
      thisField.appendChild(thisName);
      thisField.appendChild(thisFieldRequired);
      thisField.appendChild(thisBtnDelete);
    }
  }

  //Push Meta-Elements
  if (step.type === "xproc.Pipeline") {
    // Info
    metaInfo.appendChild(formInfo);
    formInfo.appendChild(fieldsetName);
    fieldsetName.appendChild(labelPrefix);
    fieldsetName.appendChild(labelName);
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
    let fieldRequired = optionRequired.cloneNode(true);
    let thisFieldRequired = fieldRequired.cloneNode(true);
    let requiredSelect = thisFieldRequired.childNodes[1];
    selectBoolean("opt", cellView, stepOptions, optName, optRequired, requiredSelect);
    formOptions.appendChild(fieldRequired);
  } else {
    // Info
    let type = document.createElement('h3');
    let id = document.createElement('p');
    let idNum = cellView.model.attributes.attrs[".word2"].text;
    id.appendChild(document.createTextNode(idNum));
    type.appendChild(document.createTextNode(stepType));
    metaInfo.appendChild(type);
    metaInfo.appendChild(id);
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
  }
}