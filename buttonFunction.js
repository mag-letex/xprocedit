// BUTTON FUNCTIONS
// btnFile.addEventListener('mousemove', function () {
//   fileMenue(this.id, "drp_file");
// });
// btnFile.addEventListener('mouseout', function () {
//   leave(this.id, "drp_file");
// });
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
// let h2Ports = document.getElementById('h2Ports');
// let h2Options = document.getElementById('h2Options');

// h2Ports.addEventListener('click', function(){
//   let sibling = h2Ports.parentNode.childNodes;
//   console.log(sibling);
//   for (let i=2; i<sibling.length; i++){
//     sibling[i].style.display = "none";
//     }
//   });

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
  let embeds = currentPipeline.getEmbeddedCells();
  getId();
  let id = "newPipeline_" +  newId;
  graphX.removeCells(currentPipeline);
  loadPipeline(id);
});
btnGetEmbeds.addEventListener('click', function () {
  let currentPipeline = graphX.getCell(globalPipeline);
  let embeds = currentPipeline.getEmbeddedCells();
  console.log(embeds);
});
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
  if (json.stepPrefix !== "unset" && json.stepName !== "unset"){

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
  li.addEventListener('dblclick', function (e) {
    let placeX = 100;
    let placeY = 100;
    stepLoad(li, placeX, placeY);
    console.log(string);
  });
  }
  else return alert("You have to set a name and prefix for the pipeline");
}

  btnSavePipe.addEventListener('click', function () {
    let cellModelType = currentCell.model.attributes.type;
    console.log(currentCell);
    if (cellModelType === "xproc.Pipeline") {
      savePipeline(currentCell);
    } else return alert("This is a Built-in Step that you can't save!");
  });


  let graphArray = [];
  btnExportTest.addEventListener('click', function () {
    pipelineExport();
  });

  function pipelineExport() {
    graphArray = [];
    let i;
    for (i = 0; i < testBtnArray.length; i++) {
      let btnId = testBtnArray[i];
      let btn = document.getElementById(btnId);
      btn.click();
      let graphJSON = graphX.toJSON();
      let graphCells = graphJSON.cells;
      graphArray.push(graphCells);
      document.getElementById(testBtnArray[0]).click();
    }
    console.log(">>>>> GRAPH ARRAY");
    console.log(graphArray);
    console.log(JSON.stringify(graphArray));
  }

// btnBack.addEventListener('click', function () {
//   getLastGraphState();
// });
// btnForward.addEventListener('click', function () {
//   getNextGraphState();
// });
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

// function fileMenue(handler, object) {
//   let hndlr = document.getElementById(handler);
//   let obj = document.getElementById(object);
//   obj.style.display = "block";
//   hndlr.style.backgroundColor = "#ececec";
// }
//
// function leave(handler, object) {
//   let hndlr = document.getElementById(handler);
//   let obj = document.getElementById(object);
//   obj.style.display = "none";
//   hndlr.style.backgroundColor = null;
// }

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
// function keycode(elem){
//   console.log(elem);
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
    if (newScale > 0.4 && newScale < 2) {
      paper.setOrigin(0, 0);
      paper.scale(newScale, newScale, p.x, p.y);
    }
  });

  function offsetToLocalPoint(x, y) {
    let svgPoint = paper.svg.createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;
    return svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
  }