// Reset Function
// window.addEventListener("load", function () {
//   let lastGraphState = localStorage.getItem('lastGraphState');
//   lastGraphState = JSON.parse(lastGraphState);
//   if (lastGraphState !== undefined) {
//     graph.fromJSON(lastGraphState);
//   }
// });
// window.addEventListener("unload", function () {
//   saveLastGraphState();
// });

// GLOBAL VARIABLES
let failedId = "";
let newId = "";
let idGlobal = [];
let paperIdGlobal;
let paperX;
let graphX;
let currentCell;

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

//BUTTON-INITIALIZATION
let btnJSON = document.getElementById('btn_json');
let btnLSClear = document.getElementById('btnLSClear');
let btnLSGet = document.getElementById('btnLSGet');
// let btnLink = document.getElementById('btn_link');
let btnClearPipeline = document.getElementById('btnClearPipeline');
let btnOrderPipeline = document.getElementById('btnOrderPipeline');
let btnSavePipe = document.getElementById('btnSavePipe');
let btnBack = document.getElementById('btnBack');
let btnForward = document.getElementById('btnForward');
// let btnInPortAdd = document.getElementById('btnInPortAdd');
// let btnOutPortAdd = document.getElementById('btnOutPortAdd');
let btnPaperNew = document.getElementById('btnPaperNew');

let globalPipeline;
let testGraph = [];
let testBtnArray = [];

//GET STEP-LIBRARIES
let xhr = new XMLHttpRequest();
let obj;
let superObj = [];
xhr.open("GET", "steplibs/steps.json", true);
xhr.responseType = "json";
xhr.send();
xhr.onload = function (e) {
  //HTML-OUTPUT
  if (e.target.responseType === 'json') {
    obj = xhr.response;
  } else {
    obj = JSON.parse(e.target.responseText);
  }
  for (let i = 0; i < obj.atomicSteps.length; i++) {
    document.querySelector("#atomicUL").innerHTML +=
      "<li id='" + obj.atomicSteps[i].stepType + "' class='step atomicStep' draggable='true'>"
      + obj.atomicSteps[i].attrs[".label"].text + "</li>";
    superObj.push(obj.atomicSteps[i]);
  }
  for (let j = 0; j < obj.compoundSteps.length; j++) {
    document.querySelector("#compoundUL").innerHTML +=
      "<li id='" + obj.compoundSteps[j].stepType + "' class='step compoundStep' draggable='true'>"
      + obj.compoundSteps[j].attrs[".label"].text + "</li>";
    superObj.push(obj.compoundSteps[j]);
  }
  let stepsHtml = document.querySelectorAll('.step');
  stepsHtml.forEach(function (elem) {
    elem.addEventListener('dragstart', function (e) {
      let id = e.target.id;
      e.dataTransfer.setData('text', id);
    });
    elem.addEventListener('dblclick', function () {
      let placeX = 100;
      let placeY = 100;
      stepLoad(elem, placeX, placeY);
    });
  });
};

// XProc-Step Drag and Drop
window.addEventListener("dragover", function (e) {
  e = e || event;
  e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
  e = e || event;
  e.preventDefault();
}, false);

// Step - Load
window.onload = function () {
  getId();
  let btnId = "btn-newPipeline_" + newId;
  let pipelineId = "newPipeline_" + newId;
  let defaultBtn = document.getElementById("btnDefaultOpen");
  testBtnArray.push(btnId);
  defaultBtn.id = btnId;
  defaultBtn.innerHTML = pipelineId;
  defaultBtn = document.getElementById(btnId);
  globalPipeline = pipelineId;
  defaultBtn.addEventListener('click', function (event) {
    switchPaper(event, 'paper1', btnId);
    globalPipeline = pipelineId;
  });
  defaultBtn.click();
  document.getElementById('paper1')
    .addEventListener('drop', function (e) {
      let data = e.dataTransfer.getData('text');
      let dropElem = document.querySelector('#' + data);
      let dropElemSibl = dropElem.nextSibling;
      console.log(dropElem.nextSibling);
      let placeX = e.layerX - 80;
      let placeY = e.layerY - 20;
      e.target.appendChild(document.getElementById(data));
      stepLoad(dropElem, placeX, placeY);
      if (dropElemSibl !== null) {
        dropElemSibl.parentNode.insertBefore(dropElem, dropElemSibl);
      } else {
        document.querySelector("#customUL").appendChild(dropElem);
      }
    });
  loadPipeline(pipelineId);
  // Initialization SaxonJS
  SaxonJS.transform({
    sourceLocation: "xsl/xproceditor.sef",
    stylesheetLocation: "xsl/xproceditor.sef"
  });
};

// Step Panel Function
let stepInput = document.querySelectorAll('[id^="input"]');
stepInput.forEach(function (elem) {
  elem.addEventListener("input", function () {
    let filter, ul, li, i;
    filter = elem.value.toUpperCase();
    ul = elem.parentElement.children[2];
    li = ul.children;
    for (i = 0; i < li.length; i++) {
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  })
});

// JOINT JS
// Dev-Model-Link Initialization
let devsLink = joint.dia.Link.define('devs.StandLink', {});

let devsStandLink = new devsLink({
  router: {name: 'manhattan'},
  connector: {name: 'rounded'},
  attrs: {
    '.connection': {fill: '#7decff', stroke: '#7decff', 'stroke-width': 4},
    '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'},
  }
});
devsStandLink.set('z', 1);

let devsMainLink = new devsLink({
  router: {name: 'manhattan'},
  connector: {name: 'rounded'},
  attrs: {
    '.connection': {fill: '#BB471B', stroke: '#BB471B', 'stroke-width': 5},
    '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
  }
});
devsMainLink.set('z', 1);

let devsOptionLink = new devsLink({
  router: {name: 'manhattan'},
  connector: {name: 'rounded'},
  attrs: {
    '.connection': {fill: '#30dde3', stroke: '#30dde3', 'stroke-width': 5},
    '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
  }
});
devsOptionLink.set('z', 1);

// Canvas/JointJS-Paper Initialization
let canvas = document.querySelector('#papers');
let graph = new joint.dia.Graph,
  paper = new joint.dia.Paper({
    el: $('#paper1'),
    model: graph,
    // width: 938,
    // height: 854,
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
    defaultLink: function (cellView) {
      if (cellView.model.attributes.type === "xproc.Option") {
        return devsOptionLink.clone();
      }
      else return devsStandLink.clone();
    },
    snapLinks: true,
    linkPinning: false,
    gridSize: 15,
    drawGrid: {
      name: 'mesh',
      args: [
        {color: 'black', thickness: 1} // settings for the primary mesh
        // { color: 'green', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
      ]
    },
    // drawGrid:true,
    embeddingMode: true,
    highlighting: {
      'default': {
        name: 'stroke',
        options: {
          padding: 6
        }
      },
      'embedding': {
        name: 'addClass',
        options: {
          className: 'highlighted-parent'
        }
      }
    },
    validateEmbedding: function (childView, parentView) {
      return parentView.model instanceof joint.shapes.xproc.Compound;
    },
    validateConnection: function (sourceView, sourceMagnet, targetView, targetMagnet) {
      let sourceGroup = sourceMagnet.getAttribute('port-group');
      let targetGroup = targetMagnet.parentElement.getAttribute('port-group');
      if (sourceGroup !== targetGroup) {
        return true;
      }
    },
    interactive: function (cellView) {
      if (cellView.model.attributes.type === "xproc.Option") {
        return {
          linkMove: true,
          labelMove: true,
          elementMove: false,
          addLinkFromMagnet: true
        };
      } else return true;
    }
    // Missing Code
  });

// Create New Paper (Button)
btnPaperNew.addEventListener('click', function (evt) {
  getId();
  let oldPipeline = graphX.getCell(globalPipeline);
  let newCellView = paperX.findViewByModel(oldPipeline);
  let newPipelineId = "newPipeline" + "_" + newId;
  createPaperBtn(newPipelineId, evt, newCellView);
  globalPipeline = newPipelineId;
});

function createPaperBtn(modelId, evt, cellView) {
  //CREATE BUTTON
  let newBtn = document.createElement('button');
  let btnId = 'btn-' + modelId;
  newBtn.appendChild(document.createTextNode(modelId));
  newBtn.classList.add('tablink', 'active');
  newBtn.setAttribute('id', btnId);
  let btnAll = document.querySelector('.tab').children;
  let checkArr = [];
  //CREATE PAPER
  let paperCont = document.querySelector('#papers');
  let newPaper = document.createElement('div');
  let paperId = 'paper-' + modelId;
  paperIdGlobal = paperId;
  newPaper.classList.add('paperContent');
  newPaper.setAttribute('id', paperId);
  //DROP-EVENT
  newPaper.addEventListener('drop', function (e) {
    let data = e.dataTransfer.getData('text');
    let dropElem = document.querySelector('#' + data);
    let dropElemSibl = dropElem.nextSibling;
    let placeX = e.layerX - 80;
    let placeY = e.layerY - 20;
    e.target.appendChild(document.getElementById(data));
    stepLoad(dropElem, placeX, placeY);
    dropElemSibl.parentNode.insertBefore(dropElem, dropElemSibl);
  });
  for (let i = 0; i < btnAll.length; i++) {
    checkArr.push(btnAll[i].innerText);
  }
  let check = checkArr.includes(modelId);
  if (check === false) {
    btnPaperNew.parentNode.insertBefore(newBtn, btnPaperNew);
    testBtnArray.push(btnId);
    newBtn.addEventListener('click', function () {
      switchPaper(evt, paperId, btnId, paperNew, graphNew);
      globalPipeline = modelId;
    });
    paperCont.appendChild(newPaper);
    let graphNew = new joint.dia.Graph,
      paperNew = new joint.dia.Paper({
        el: $('#' + paperId),
        model: graphNew,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        defaultLink: function (cellView) {
          if (cellView.model.attributes.type === "xproc.Option") {
            return devsOptionLink.clone();
          }
          else return devsStandLink.clone();
        },
        snapLinks: true,
        linkPinning: false,
        gridSize: 15,
        drawGrid: {
          name: 'mesh',
          args: [
            {color: 'black', thickness: 1} // settings for the primary mesh
            // { color: 'green', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
          ]
        },
        // drawGrid:true,
        embeddingMode: true,
        highlighting: {
          'default': {
            name: 'stroke',
            options: {
              padding: 6
            }
          },
          'embedding': {
            name: 'addClass',
            options: {
              className: 'highlighted-parent'
            }
          }
        },
        validateEmbedding: function (childView, parentView) {
          return parentView.model instanceof joint.shapes.xproc.Compound;
        },
        validateConnection: function (sourceView, sourceMagnet, targetView, targetMagnet) {
          let sourceGroup = sourceMagnet.getAttribute('port-group');
          let targetGroup = targetMagnet.parentElement.getAttribute('port-group'); //JavaScript Befehl
          if (sourceGroup !== targetGroup) {
            return true;
          }
        },
        interactive: function (cellView) {
          if (cellView.model.attributes.type !== "xproc.Option") {
            return true;
          }
        }
      });

    paperNew.on('cell:pointerdblclick', function (cellView, evt) {
      cellPointerDblClick(cellView, evt);
    });
    let stepPipeWidth = canvas.offsetWidth - (canvas.offsetWidth * 10 / 100);
    let stepPipeHeight = canvas.offsetHeight - (canvas.offsetHeight * 10 / 100);
    let stepColor;
    let stepType = cellView.model.toJSON().type;
    if (stepType === "xproc.Compound") {
      stepColor = '#85dfff';
    } else {
      stepColor = '#58ada4';
    }
    graphNew.addCell(cellView.model.clone()
      .resize(stepPipeWidth, stepPipeHeight)
      .prop('stepId', modelId)
      .prop('id', modelId)
      .position(50, 30)
      .attr({
        rect: {
          fill: stepColor
        },
        ".word2": {y: 60, x: stepPipeWidth / 2}
      })
    );
    switchPaper(evt, paperId, btnId, paperNew, graphNew);
  } else if (check === true) {
    switchPaper(evt, paperId, btnId);
  }
}

// Paper-Switch-Panel
function switchPaper(evt, paperId, btnId, paperNew, graphNew) {
  let btnText = document.querySelector('#' + btnId);
  let elem = btnText.innerText;
  // Declare all variables
  let i, paperContent, tablink;
  // Get all elements with class="paperContent" and hide them
  paperContent = document.getElementsByClassName("paperContent");
  for (i = 0; i < paperContent.length; i++) {
    paperContent[i].style.display = "none";
  }
  // Get all elements with class="tablink" and remove the class "active"
  tablink = document.getElementsByClassName("tablink");
  for (i = 0; i < tablink.length; i++) {
    tablink[i].className = tablink[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(paperId).style.display = "block";
  let btn = document.getElementById(btnId);
  btn.classList.add("active");
  paperIdGlobal = paperId;
  if (paperIdGlobal === "paper1") {
    paperX = paper;
    graphX = graph;
  } else {
    paperX = paperNew;
    graphX = graphNew;
  }
  let cell = paperX.findViewByModel(elem);
  if (cell !== undefined) {
    metaPanel(cell);
  }
  paperX.on('cell:pointerclick', function (cellView, evt) {
    metaPanel(cellView);
    currentCell = cellView;
  });
  paperX.on('cell:pointerdblclick', function (cellView, evt) {
    cellPointerDblClick(cellView, evt);
  });
  paperX.on('link:connect', function(linkView, evt, elementViewConnected){
    console.log(linkView);
    console.log(evt);
    console.log(elementViewConnected);
    let source = linkView.sourceView.model.attributes.type;
    let sourcePort = linkView.sourceMagnet.attributes["port-group"].nodeValue;
    let targetPort = linkView.targetMagnet.attributes["port-group"].nodeValue;
    let target = elementViewConnected.model.attributes.type;
    if(source === "xproc.Option"){
      alert("You are not allowed to use an option as source-port!");
      linkView.remove();
    }
    else if (sourcePort === "out" && targetPort === "out" && source == "xproc.Pipeline"){
      alert("You are only allowed to connect these two ports the other way around!");
      linkView.remove();
    }
    else if (sourcePort === "out" && targetPort === "out" && target !== "xproc.Pipeline"){
      alert("You are not allowed to connect these two ports!");
      linkView.remove();
    }
    else if(sourcePort === "in" && targetPort === "in" && target == "xproc.Pipeline"){
      alert("You are only allowed to connect these two ports the other way around!");
      linkView.remove();
    }
    else if(sourcePort === "in" && targetPort === "in" && source !== "xproc.Pipeline"){
      alert("You are not allowed to connect these two ports!");
      linkView.remove();
    }
    else if(sourcePort === "in" && targetPort === "out" && source !== "xproc.Pipeline" && target === "xproc.Pipeline"){
      alert("You are not allowed to connect these two ports!");
      linkView.remove();
    }
  });

}

// JointJS-Devs Markup-Manipulation
// Definition of XProc Atomic Step Model
joint.shapes.xproc = {};
joint.shapes.xproc.toolElementAtomic = joint.shapes.devs.Atomic.extend({
  toolMarkup: ['<g class="element-tools">',
    '<g class="element-tool-remove"><circle fill="red" r="11"/>',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
    '<title>Remove this element from the model</title>',
    '</g>',
    '<g class="element-tool-small" transform="translate(200,0)  rotate(45)"><circle fill="pink" r="11"/>',
    '<path transform="matrix(0.8,0,0,0.8,-12.8,-12.8)" d="m 24.777,10.415 -2.828,-2.83 c 0,0 0.257243,-0.2562432 -13.833,13.834 l 2.83,2.829 z"/>',
    '<title>Minimize</title>',
    '</g>',
    '<g class="element-tool-options">',
    '<image x="5" y="75" width="25" height="25" href="img/btn-options-show.svg" />',
    '<image style="display: none" x="5" y="75" width="25" height="25" href="img/btn-options-hide.svg" />',
    '<title>Open Options</title>',
    '</g>',
    '</g>'].join(''),

  defaults: joint.util.deepSupplement({
    // attrs: {
    //     text: { 'font-weight': 'bold', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': 0.4, 'y-alignment': 'middle' },
    // },
  }, joint.shapes.devs.Atomic.prototype.defaults)
});
xRel = 100;
yRel = 100;

// xproc.Atomic - Default
joint.shapes.xproc.Atomic = joint.shapes.xproc.toolElementAtomic.extend({
  markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text class="label"/><text class="word2"></text></g>',
  defaults: joint.util.deepSupplement({
    type: 'xproc.Atomic',
    attrs: {
      rect: {
        fill: '#ff6d5c',
        stroke: 'black',
        'stroke-width': 1,
        'follow-scale': true,
        width: 160,
        height: 80
      },
      text: {ref: 'rect'},
      '.label': {ref: 'rect'},
      '.word2': {y: 60, x: 90}
    },
    size: {width: 180, height: 100},
    ports: {
      groups: {
        'in': {
          position: 'left',
          label: {
            position: {
              name: 'manual',
              args: {
                y: 5,
                x: -35,
                attrs: {'.': {'text-anchor': 'right'}}
              }
            }
          },
          attrs: {
            '.port-body': {
              r: 10,
              fill: '#fff'
              // magnet: 'passive'
            }
            // 'circle': {fill: 'green'}
          },
          markup: "<circle class=\"port-body in-ports\" r=\"8\" stroke=\"#000\" fill=\"#fff\"/>",
          // markup: '<path d="M-20 0 l -10 30 l 20 0 Z" stroke="black"/>'
        },
        'out': {
          position: 'right',
          label: {
            position: {
              name: 'manual',
              args: {
                y: 5,
                x: 35,
                attrs: {'.': {'text-anchor': 'left'}}
              }
            }
          },
          attrs: {
            '.port-body': {
              fill: '#fff',
              r: 10,
              // magnet: 'passive'
            }
            // 'circle': {fill: 'green'}
          },
          markup: "<circle class=\"port-body out-ports\" r=\"8\" stroke=\"#000\" fill=\"#fff\"/>"
        }
      }
    },
    stepGroup: "xproc.Atomic",
    stepType: "unset",
    stepId: "unset",
    portData: [
      {
        portId: "unset",
        portGroup: "unset",
        portPrimary: "unset",
        portSequence: "unset",
        portContentTypes: "unset",
        portSerialization: {indent: "unset"}
      }
    ],
    stepOption: [
      {
        name: "unset",
        required: "unset"
      }
    ]
  }, joint.shapes.xproc.toolElementAtomic.prototype.defaults)
});

// Definition of XProc Compound Step Model
joint.shapes.xproc.toolElementCompound = joint.shapes.devs.Coupled.extend({
  toolMarkup: ['<g class="element-tools">',
    '<g class="element-tool-remove"><circle fill="red" r="11"/>',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
    '<title>Remove this element from the model</title>',
    '</g>',
    '<g class="element-tool-options">',
    '<image x="5" y="75" width="25" height="25" href="img/btn-options-show.svg" />',
    '<image style="display: none" x="5" y="75" width="25" height="25" href="img/btn-options-hide.svg" />',
    '<title>Open Options</title>',
    '</g>',
    '</g>'].join(''),
  defaults: joint.util.deepSupplement({
    // attrs: {
    //     text: { 'font-weight': 'bold', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': 0.4, 'y-alignment': 'middle' },
    // },
  }, joint.shapes.devs.Coupled.prototype.defaults)
});

// xproc.Compound - Default
joint.shapes.xproc.Compound = joint.shapes.xproc.toolElementCompound.extend({
  markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text class="label"></text><text class="word2"></text></g>',
  defaults: joint.util.deepSupplement({
    type: 'xproc.Compound',
    attrs: {
      rect: {
        fill: '#6FB7FF',
        stroke: 'black',
        'stroke-width': 1,
        'follow-scale': true,
        width: 160,
        height: 80,
        'rx': 6,
        'ry': 6
      },
      text: {ref: 'rect'},
      '.label': {ref: 'rect', 'font-weight': 'bold', 'font-size': 20},
      '.word2': {y: 60, x: 90}
    },
    size: {width: 180, height: 100},
    ports: {
      groups: {
        'in': {
          position: 'left',
          label: {
            position: {
              name: 'manual',
              args: {
                y: 5,
                x: -35,
                attrs: {'.': {'text-anchor': 'right'}}
              }
            }
          },
          attrs: {
            '.port-body': {
              r: 10,
              fill: '#fff'
              // magnet: 'passive'
            }
            // 'circle': {fill: 'red'}
          },
          markup: "<circle class=\"port-body in-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>",
          // markup: '<path d="M-20 0 l -10 30 l 20 0 Z" stroke="black"/>'
        },
        'out': {
          position: 'right',
          label: {
            position: {
              name: 'manual',
              args: {
                y: 5,
                x: 35,
                attrs: {'.': {'text-anchor': 'left'}}
              }
            }
          },
          attrs: {
            '.port-body': {
              fill: '#fff',
              r: 10,
              // magnet: 'passive'
            }
            // 'circle': {fill: 'red'}
          },
          markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
        }
      }
    },
    stepGroup: "xproc.Compound",
    stepType: "unset",
    stepId: "unset",
    stepPrefix: "unset",
    stepName: "unset",
    portData: [
      {
        portId: "unset",
        portGroup: "unset",
        portPrimary: "unset",
        portSequence: "unset",
        portContentTypes: "unset",
        portSerialization: {indent: "unset"}
      }
    ],
    stepOption: []
    //   {
    //     name: "unset",
    //     required: "unset"
    //   }
    // ]
  }, joint.shapes.xproc.toolElementCompound.prototype.defaults)
});

// Element Tool Settings
joint.shapes.xproc.ToolElementView = joint.dia.ElementView.extend({
  initialize: function () {
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.renderTools();
    this.update();
    return this;
  },
  renderTools: function () {
    let toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
    if (toolMarkup) {
      let nodes = V(toolMarkup);
      V(this.el).append(nodes);
    }
    return this;
  },
  pointerclick: function (evt, x, y) {
    this._dx = x;
    this._dy = y;
    this._action = '';
    let className = evt.target.parentNode.getAttribute('class');

    switch (className) {
      case 'element-tool-remove':
        this.model.remove();
        return;
        break;
      case 'element-tool-options':
        let parentId = this.id;
        let btn = document.querySelector('#' + parentId + ' .element-tool-options');
        let btnSelect1 = btn.childNodes[0];
        let btnSelect2 = btn.childNodes[1];
        let thisCells = this.model.get('embeds');
        thisCells.forEach(function (elem) {
          let htmlElem = document.querySelector('[model-id="' + elem + '"]');
          $('#' + htmlElem.id).fadeToggle('fast');
        });
        $(btnSelect1).fadeToggle('fast');
        $(btnSelect2).fadeToggle('fast');
        return;
        break;
      default:
    }
    joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
  }
});
joint.shapes.xproc.AtomicView = joint.shapes.xproc.ToolElementView;
joint.shapes.xproc.CompoundView = joint.shapes.xproc.ToolElementView;

// xproc.Pipeline Initialization and Default
let stepPipeWidth = canvas.offsetWidth - (canvas.offsetWidth * 10 / 100);
joint.shapes.xproc.Compound.define('xproc.Pipeline', {
  type: "xproc.Compound",
  stepType: "pipeline",
  attrs: {
    rect: {
      fill: '#58ada4',
      stroke: 'black',
      'stroke-width': 1,
      'follow-scale': true,
      // width: 160,
      // height: 80,
      'rx': 6,
      'ry': 6
    },
    '.label': {
      text: "Anonymous Pipeline",
      fill: "#FFF7EC",
      'font-size': '1.4em'
    },
    '.word2': {y: 60, x: stepPipeWidth / 2}
  },
  ports: {
    groups: {
      'in': {
        position: 'left',
        label: {
          position: {
            name: 'manual',
            args: {
              y: 5,
              x: 35,
              attrs: {'.': {'text-anchor': 'left'}}
            }
          }
        },
        attrs: {
          '.port-body': {
            r: 10,
            fill: '#fff'
            // magnet: 'passive'
          }
          // 'circle': {fill: 'red'}
        },
        markup: "<circle class=\"port-body in-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>",
      },
      'out': {
        position: 'right',
        label: {
          position: {
            name: 'manual',
            args: {
              y: 5,
              x: -35,
              attrs: {'.': {'text-anchor': 'right'}}
            }
          }
        },
        attrs: {
          '.port-body': {
            fill: '#fff',
            r: 10,
            // magnet: 'passive'
          }
          // 'circle': {fill: 'red'}
        },
        markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
      }
    }
  },
  portData: [
    {
      portId: "source",
      portGroup: "in",
      portPrimary: true,
      portSequence: false
    },
    {
      portId: "result",
      portGroup: "out",
      portPrimary: true,
      portSequence: false
    }
  ]
});

function loadPipeline(pipelineId) {
  getId();
  graphX.clear();
  let newPipeline = new joint.shapes.xproc.Pipeline({
    position: {
      x: 30,
      y: 20
    },
    size: {
      width: canvas.offsetWidth - (canvas.offsetWidth * 8 / 100),
      height: canvas.offsetHeight - (canvas.offsetHeight * 8 / 100)
    }
  });
  globalPipeline = pipelineId;
  newPipeline.prop('id', pipelineId)
    .prop('stepId', pipelineId);
  newPipeline.addInPort("source");
  newPipeline.addOutPort("result");
  graphX.addCell(newPipeline);
  let cell = paperX.findViewByModel(pipelineId);
  metaPanel(cell);
}

// xproc.Custom - Initialization and Default
joint.shapes.xproc.Compound.define('xproc.Custom', {
  type: 'xproc.Compound',
  attrs: {
    rect: {
      fill: '#359b2b',
      stroke: 'black',
      'stroke-width': 1,
      'follow-scale': true,
      width: 160,
      height: 80,
      'rx': 6,
      'ry': 6
    },
    text: {ref: 'rect'},
    // '.word1': {'dx':0, 'dy': 20},
    '.label': {ref: 'rect', 'font-weight': 'bold', 'font-size': 20},
    '.word2': {y: 60, x: 90}
  },
  size: {width: 180, height: 100},
  ports: {
    groups: {
      'in': {
        position: 'left',
        label: {
          position: {
            name: 'manual',
            args: {
              y: 5,
              x: -40,
              attrs: {'.': {'text-anchor': 'middle'}}
            }
          }
        },
        attrs: {
          '.port-body': {
            r: 10,
            fill: '#fff'
            // magnet: 'passive'
          }
          // 'circle': {fill: 'red'}
        },
        markup: "<circle class=\"port-body in-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>",
        // markup: '<path d="M-20 0 l -10 30 l 20 0 Z" stroke="black"/>'
      },
      'out': {
        position: 'right',
        label: {
          position: {
            name: 'manual',
            args: {
              y: 5,
              x: 40
            }
          }
        },
        attrs: {
          '.port-body': {
            fill: '#fff',
            r: 10,
            // magnet: 'passive'
          }
          // 'circle': {fill: 'red'}
        },
        markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
      }
    }
  },
  stepGroup: "xproc.Custom",
  stepType: "unset",
  stepId: "unset",
  stepPrefix: "unset",
  stepName: "unset",
  portData: [
    {
      portId: "unset",
      portGroup: "unset",
      portPrimary: "unset",
      portSequence: "unset",
      portContentTypes: "unset",
      portSerialization: {indent: "unset"}
    }
  ],
  stepOption: [
    {
      name: "unset",
      required: "unset"
    }
  ]
});


// xproc.Option - Initialization and Default
joint.shapes.devs.Model.define('xproc.Option', {
  type: "devs.Model",
  // markup: [{
  //     tagName: 'xproc',
  //     selector: 'xproc'}
  // ],
  inPorts: [""],
  size: {
    width: 180,
    height: 20
  },
  attrs: {
    ".label": {text: 'New Option', fill: 'white', 'font-weight': 'bold', 'font-size': '0.9em', 'ref-y': 2},
    rect: {fill: '#36d260', rx: '5', ry: '5', opacity: 0.8}
  },

  ports: {
    groups: {
      'in': {
        position: 'left',
        label: {
          position: {
            name: 'manual',
            args: {
              y: 5,
              x: -20,
              attrs: {'.': {'text-anchor': 'middle'}}
            }
          }
        },
        attrs: {
          '.port-body': {
            r: 8,
            fill: '#fff'
            // magnet: 'passive'
          },
          'circle': {fill: 'red'}
        },
        markup: "<circle class=\"port-body in-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>",
      }
    }
  },
  portData: [
    {
      portId: "in",
      portGroup: "in",
      portPrimary: "unset",
      portSequence: "unset",
      portContentTypes: "unset",
      portSerialization: {indent: "unset"}
    }
  ],
  optionName: "unset",
  optionValue: "unset",
  optionRequired: "unset",
  optionSelect: "unset"
});

function resize(){
  let canvasWidth = canvas.offsetWidth;
  let canvasHeight = canvas.offsetHeight;
  paperX.setDimensions(canvasWidth, canvasHeight);
  let xplWidth = canvasWidth * 0.8 + (canvas.offsetWidth * 10 / 100);
  let xplHeight = canvasWidth * 0.6;
  let currentPipeline = graphX.getCell(globalPipeline);
  currentPipeline.resize(xplWidth, xplHeight);
}

// Window Responsive - has to be below paper initialization
window.addEventListener("resize", function () {
  resize();
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