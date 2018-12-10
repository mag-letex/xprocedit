// BUTTON FUNCTIONS
btnFile.addEventListener('mousemove', function () {
  filemenu(this.id, "drp_file");
});
btnFile.addEventListener('mouseout', function () {
  leave(this.id, "drp_file");
});
btnLink.addEventListener('click', function () {
  let val = btnLink.getAttribute('value');
  if (val === "off") {
    btnLink.setAttribute('value', "on");
    btnLink.innerHTML = "Standard Link";
  } else {
    btnLink.setAttribute('value', "off");
    btnLink.innerHTML = "Main Link";
  }
});
btnJSON.addEventListener('click', function(){
  let graphJSON = graphX.toJSON();
  let graphJSONstring = JSON.stringify(graphJSON);
  console.log(graphJSON);
  console.log(graphJSONstring);
});
btnLSClear.addEventListener('click', function(){
    localStorage.clear();
});
btnLSGet.addEventListener('click', function(){
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
  for (i = 0; i < localStorage.length; i++)   {
    console.log(localStorage.key(i));
  }
});
btnClearGraph.addEventListener('click', function(){
  graph.clear();
  graph.addCell(xplD);
});
// let clicks = 0;
btnBack.addEventListener('click', function(){
  getLastGraphState();
});
btnForward.addEventListener('click', function(){
  getNextGraphState();
});
btnInPortAdd.addEventListener('click', function(){
  let pipe = graph.getCell('XProc-Pipeline');
  pipe.addPort(inPort);
});
btnOutPortAdd.addEventListener('click', function(){
  let pipe = graph.getCell('XProc-Pipeline');
  pipe.addPort(outPort);
});
$('#btnShowOptions').on('click', function(){
  $('.joint-type-xproc-option').fadeOut('fast');
  $('#btnShowOptions').hide();
  $('#btnHideOptions').show();

});
$('#btnHideOptions').on('click', function(){
  $('.joint-type-xproc-option').fadeIn('fast');
  $('#btnHideOptions').hide();
  $('#btnShowOptions').show();
});
paper.on('element:pointerdown', function(){
  saveLastGraphState();
});
paper.on('element:pointerup', function(){
  saveNextGraphState();
});

function filemenu(handler, object){
  let hndlr = document.getElementById(handler);
  let obj = document.getElementById(object);
  obj.style.display = "block";
  hndlr.style.backgroundColor = "#ececec";
}
function leave(handler, object) {
  let hndlr = document.getElementById(handler);
  let obj = document.getElementById(object);
  obj.style.display = "none";
  hndlr.style.backgroundColor = null;
}

// FALLBACK-STATES
function saveLastGraphState(){
  let graphJSONstring = JSON.stringify(graphX.toJSON());
  localStorage.setItem('lastGraphState', graphJSONstring);
}
function saveNextGraphState(){
  let graphJSONstring = JSON.stringify(graphX.toJSON());
  localStorage.setItem('nextGraphState', graphJSONstring);
}
function getLastGraphState(){
  let lastGraphState = localStorage.getItem('lastGraphState');
  lastGraphState = JSON.parse(lastGraphState);
  graph.clear();
  graph.fromJSON(lastGraphState);
}
function getNextGraphState(){
  let nextGraphState = localStorage.getItem('nextGraphState');
  nextGraphState = JSON.parse(nextGraphState);
  graph.clear();
  graph.fromJSON(nextGraphState);
}

//HIGHLIGHTING und META-FUNCTION
let oldCellView = null;
clickHighlight = 0;

paper.on('element:pointerdown', function (cellView, evt, x, y) {
  let model = this.model.toJSON();
  if (model.inPorts != null || model.outPorts != null) {
    metaActive(cellView);
  }

  //HIGHLIGHTING FUNCTION
  if (oldCellView != null) {
    oldCellView.unhighlight();
    V(paper.findViewByModel(oldCellView.model).el).removeClass('highlight-class');
  }
  if (oldCellView != cellView) {
    V(paper.findViewByModel(cellView.model).el).addClass('highlight-class');
    cellView.highlight(null, {
      highlighter: {
        name: 'addClass',
        options: {
          className: 'foo-class'
        }
      }
    });
    oldCellView = cellView;
  } else {
    oldCellView = null;
  }
  return;
});

//META
// paper.on('blank:pointerdown', function () {
//   $("#stringCont").remove();
// });
function metaActive(cellView) {
  let thisView = cellView.model;
  let thisModel = cellView.model.toJSON();
  let inPortLength = thisModel.inPorts.length;
  let outPortLength = thisModel.outPorts.length;
  let optionLength = thisModel.stepOption.length;
  let itemLength = thisModel.ports.items.length;
  let thisColor = thisView.attributes.attrs.rect.fill;
  let modelHead = thisModel.attrs[".label"].text;

  let modelString = "";
  modelString += '<div id="stringCont">'
  modelString += '<div class="modelString" style="background-color:' + thisColor + '99;">';
  modelString += '<h3 class="model-head">' + modelHead + '</h3>';

  if (inPortLength > 0 && thisModel.portData != null) {
    modelString += '<h4 class="port-head">Input-Ports</h4>';
    modelString += '<table>';
    modelString += '<tbody>';
    modelString += '<tr>';

    for (let i = 0; i < inPortLength; i++) {
      let currentIdIn = thisModel.portData[i].portId;
      let currentPortPrimaryIn = thisModel.portData[i].portPrimary;
      let currentPortSequenceIn = thisModel.portData[i].portSequence;
      let currentContentTypesIn = thisModel.portData[i].portContentTypes;
      modelString += '<th>' + currentIdIn + '</th>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Primary: </td>';
      modelString += '<td class="toggle text">';
      let prime;
      if (currentPortPrimaryIn == true) {
        prime = 'checked';
      } else {
        prime = 'unchecked';
      }
      modelString += '<label style="color: #050805"><input type="checkbox" ' + prime + '><span class="slider"></span> </label>';
      modelString += '</label>';
      modelString += '</td>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Sequence: </td>';
      modelString += '<td>' + currentPortSequenceIn + '</td>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Content Types: </td>';
      modelString += '<td>' + currentContentTypesIn + '</td>';
      modelString += '</tr>';
    }
    modelString += '</tbody>';
    modelString += '</table>';
  }

  if (outPortLength > 0 && thisModel.portData != null) {
    modelString += '<h4 class="port-head">Output-Ports</h4>';
    modelString += '<table>';
    modelString += '<tbody>';
    let idOld = "";
    for (let j = inPortLength; j < itemLength; j++) {
      let currentIdOut = thisModel.ports.items[j].id;
      let currentSourcePrimaryOut = thisModel.portData[j].portPrimary;
      let currentSourceSequenceOut = thisModel.portData[j].portSequence;
      let currentContentTypesOut = thisModel.portData[j].portContentTypes;
      modelString += '<tr>';
      modelString += '<th>' + currentIdOut + '</th>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Primary: </td>';
      modelString += '<td class="toggle text">';
      let prime;
      if (currentSourcePrimaryOut == true) {
        prime = 'checked';
      } else {
        prime = 'unchecked';
      }

      modelString += '<label style="color: #050805"><input type="checkbox" ' + prime + '><span class="slider"></span> </label>';
      modelString += '</label>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Sequence: </td>';
      modelString += '<td>' + currentSourceSequenceOut + '</td>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Content Types: </td>';
      modelString += '<td>' + currentContentTypesOut + '</td>';
      modelString += '</tr>';
      modelString += '<tr>';
      modelString += '<td>Serialization: </td>';
      modelString += '</tr>';
      modelString += '<tr>';
    }
    modelString += '</tbody>';
    modelString += '</table>';
  }
  if (optionLength > 0 || thisModel.stepOption != null) {
    modelString += '<div id="draggable">';
    modelString += '<h4 class="port-head">Options</h4>';

    modelString += '<div id="accordion" style="font-weight: bold;color: #fff;">';
    let stepOptionName;
    if (optionLength > 0) {
      for (let k = 0; k < optionLength; k++) {
        stepOptionName = thisModel.stepOption[k].name;
        modelString += '<div>';
        modelString += '<h3 class="toggleClick toggleClose">' + stepOptionName + '</h3>';
        modelString += '<div class="toggle text toggleView">';
        modelString += '<table>';
        modelString += '<tbody>';
        modelString += '<tr style="color: #000;">';
        modelString += '<th>attribute</th>';
        modelString += '<th>state</th>';
        modelString += '</tr>';
        modelString += '<tr>';
        modelString += '<td style="color: #050805">required</td>';
        let isChecked;
        if (thisModel.stepOption[k].required == true) {
          isChecked = 'checked';
        } else {
          isChecked = 'unchecked';
        }
        modelString += '<td>';
        modelString += '<label><input type="checkbox" ' + isChecked + '><span class="slider"></span> </label>';
        modelString += '</label>';
        modelString += '</td>';
        modelString += '</tr>';

        modelString += '</tbody>';
        modelString += '</table>';
        modelString += '</div>';
        modelString += '</div>';
      }
    }
    else {
      modelString += '<ul class="toggle text" style="list-style-type: none; padding: 0.2em;">';
      modelString += '<li style="color: #050805">required';
      let isChecked;
      if (thisModel.stepOption.required == true) {
        isChecked = 'checked';
      } else {
        isChecked = 'unchecked';
      }
      modelString += '<label>required<input type="checkbox" ' + isChecked + '> <span class="slider"></span> </label>';
      modelString += '</label>';
      modelString += '</li>';
      modelString += '</ul>';
      modelString += '</li>';
    }
    modelString += '</div>';
    modelString += '</div>';
  }
  modelString += '</div>';
  modelString += '</div>';

  let myElem = document.getElementById('stringCont');

  if (myElem === null) {
    $("#metaTest").append(modelString);
    idOld = thisModel.id;
  }
  else if (thisModel.id !== idOld) {
    $("#stringCont").remove();
    $("#meta").append(modelString);
  }

  $('.toggleClick').click(function () {
    $(this).siblings('.toggleView').toggle(250, function () {
      $(this).siblings('h3').toggleClass('toggleOpen').toggleClass('toggleClose');
    });
  });
}

// CONSOLE-FUNCTION
paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
  console.log(cellView.model.id);
  console.log(cellView.model);
  console.log(cellView.model.toJSON());
  console.log(graphX.getConnectedLinks(cellView.model));
});

paper.on('cell:highlight', function () {
  $(document).bind('keyup', function (e) {
    if (e.keyCode == 46) {
      // let graphJSON = graphX.toJSON();
      let graphJSONstring = JSON.stringify(graphX.toJSON());
      localStorage.setItem('lastGraphState', graphJSONstring);
      console.log("ENTF");
      if (oldCellView != null) {
        oldCellView.remove();
      }
    }
  });
});

// //Button-based zoom-function
// let btnZoomIn = document.getElementById('btn_zoomIn');
// let btnZoomOut = document.getElementById('btn_zoomOut');
// let btnZoomReset = document.getElementById('btn_zoomReset');
// btnZoomIn.onclick = zoomIn;
// btnZoomOut.onclick = zoomOut;
// btnZoomReset.onclick = zoomReset;
// let graphScale = 1;
// let paperScale = function (sx, sy) {
//   paper.scale(sx, sy);
// };
// function zoomOut() {
//   graphScale -= 0.1;
//   paperScale(graphScale, graphScale);
// }
// function zoomIn() {
//   graphScale += 0.1;
//   paperScale(graphScale, graphScale);
// }
// function zoomReset() {
//   graphScale = 1;
//   paperScale(graphScale, graphScale);
// }

// Mousewheel-ZOOM-function
paper.$el.on('mousewheel DOMMouseScroll', function onMouseWheel(e) {
  //function onMouseWheel(e){
  e.preventDefault();
  e = e.originalEvent;
  let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) / 50;
  let offsetX = (e.offsetX || e.clientX - $(this).offset().left);
  let offsetY = (e.offsetY || e.clientY - $(this).offset().top);
  let p = offsetToLocalPoint(offsetX, offsetY);
  let newScale = V(paper.viewport).scale().sx + delta;
  // console.log(' delta' + delta + ' ' + 'offsetX' + offsetX + 'offsety--' + offsetY + 'p' + p.x + 'newScale' + newScale)
  if (newScale > 0.4 && newScale < 2) {
    paper.setOrigin(0, 0);
    paper.scale(newScale, newScale, p.x, p.y);
  }
});
function offsetToLocalPoint(x, y) {
  let svgPoint = paper.svg.createSVGPoint();
  svgPoint.x = x;
  svgPoint.y = y;
  let pointTransformed = svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
  return pointTransformed;
}