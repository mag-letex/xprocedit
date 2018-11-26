// Buttons
let btnFile = document.getElementById('drpdwn_file');
// let btnLink = document.getElementById('btn_link')
let btnJSON = document.getElementById('btn_json');
let btnCreate = document.getElementById('btn_create');
let btnLoad = document.getElementById('btn_load');
let btnCompound = document.getElementById('btn_compound');
let btnClear = document.getElementById('btn_clear');
let btnGet = document.getElementById('btn_get');
let btnReset = document.getElementById('btn_reset');

btnFile.addEventListener('mousemove', function(){
    let id= this.id;
    filemenu(this.id, "drp_file");
});
btnFile.addEventListener('mouseout', function(){
    // let id= this.id;
    leave(this.id,"drp_file");
});

btnLink.addEventListener('click', function () {
   let val = btnLink.getAttribute('value');
   // console.log(paper.("width"));
   if(val=== "off"){
       btnLink.setAttribute('value', "on");
       btnLink.innerHTML = "Standard Link";
   }else{
       btnLink.setAttribute('value', "off");
       btnLink.innerHTML = "Main Link";
   }
});
btnJSON.onclick = getJSON;
btnCreate.onclick = graphFromJSON;
btnCompound.onclick = extendCompound;
btnClear.onclick = clearLS;
btnGet.onclick = getLS;
btnReset.onclick = resetGraph;
// let clicks = 0;

function makeBoeppl(cellView, boeppelId, optionName){
    let modelX = cellView.model.get('position').x;
    let modelY = cellView.model.get('position').y;
    let modelString = JSON.stringify(cellView.model);
    let modelObject = JSON.parse(modelString);
    let modelIdNow = modelObject.id;
    let modelColor = '#16766D';
    if (modelObject.stepType == "pipeline"){
        modelColor = '#647664';
    }
    if (modelObject.type == 'xproc.Atomic'){
        modelColor = '#c3b0ff';
    }
    if (modelObject.type == 'xproc.Compound' && modelObject.stepType != 'pipeline'){
        modelColor = '#a1c9ff';
    }
    if (modelObject.stepType == 'xMyAtomicStep' || modelObject.stepType == 'xMyCompoundStep'){
        modelColor = '#D25C29';
    }

    console.log("stepType: " + modelObject.stepType);
    console.log("Model-Id-Now: "+modelIdNow);
    console.log("Model-Id-Old: "+modelIdOld);
    if(modelIdNow != modelIdOld){
        clicks = 0;
    }
    clicks++;
    modelNewHeight = modelNewHeight + 20;
    let clicko = '<p>'+clicks+'</p>';
    document.getElementById("click").innerHTML = clicko;


    if(modelObject.stepType == "pipeline"){
        modelX = modelX + 100;
        modelY = modelY + 600;
    }
    if (clicks == 1){
        // console.log("clicks: " + clicks);
        let boeppelIdX = boeppelId + clicks;
        console.log(boeppelIdX);
        let modelYbottom = modelY + 100;
        if(modelObject.stepType == "pipeline"){
            graph.addCell(newBoeppel.clone()
                .translate(modelX, modelYbottom)
                .size({width: 600, height:20})
                .attr(
                    {   text: {text: optionName},
                        rect: {fill: modelColor}
                    }).prop('id',boeppelIdX)
            );
        }
        else{
            graph.addCell(newBoeppel.clone().translate(modelX, modelYbottom).attr(
                {
                    text: {text: optionName},
                    rect: {fill: modelColor}
                }).prop('id',boeppelIdX)
            );
        }
        console.log("height: " + modelNewHeight);
        if(modelObject.stepType == "pipeline"){
            modelNewHeight = modelNewHeight+600;
            console.log("chello: "+modelNewHeight);
            $('.xplEl>.element-tools>.element-tool-boeppel').css("transform", "translate(90px,675px)");
        }

        let chello = graph.getCell(boeppelIdX);
        cellView.model.embed(chello);
        V(paper.findViewByModel(chello).el).addClass('newBoeppel');
        // clicks++;
    }
    else if(clicks>1){
        console.log("clicks: " + clicks);
        if (clicks == 2){
            let boeppelIdX = boeppelId + 1; //vorheriger Böppel soll gewählt werden
        }
        else if (clicks > 2){
            console.log("clicks: " + clicks);
            clickso = clicks - 1;
            let boeppelIdX = boeppelId + clickso;
        }
        // console.log(boeppelIdX);
        let chello = graph.getCell(boeppelIdX);
        // console.log(chello);
        let chelloY = chello.get('position').y;
        console.log(chelloY);
        if(modelObject.stepType == "pipeline"){
            graph.addCell(newBoeppel.clone().translate(modelX, chelloY+20).size({width: 600, height:20}).attr(
                {text: {text: optionName},rect:{fill: modelColor}}).prop('id',boeppelId + clicks));
        }
        else{
            graph.addCell(newBoeppel.clone().translate(modelX, chelloY+20).attr(
                {text: {text: optionName},rect:{fill: modelColor}}).prop('id',boeppelId + clicks)
            );
        }

        console.log("clicks: " + clicks);
        let chelloNew = graph.getCell(boeppelId + clicks);
        cellView.model.embed(chelloNew);
        console.log(chelloNew.get('position').y);
        let chelloNewY = chelloNew.get('position').y;
        console.log("height: " + modelNewHeight);
        if(modelObject.stepType == "pipeline"){
            modelNewHeight = modelNewHeight+600;
            console.log("chello: "+modelNewHeight);
            $('.element-tool-boeppel').css("transform", "translate(90px,675px)");
        }
        V(paper.findViewByModel(chelloNew).el).addClass('newBoeppel');
    }
    modelIdOld = modelObject.id;
    console.log("IdOld: " + modelIdOld);
}

$('.stencilAtomic').on('click', function(){
    stencilId = this.id;
    console.log(stencilId);
    blaFunc();
});

function filemenu(handler, object){
    // let list = document.getElementById("drp_file");
    let hndlr = document.getElementById(handler);
    let obj = document.getElementById(object);
        // console.log(object);
        obj.style.display = "block";
        hndlr.style.backgroundColor = "#ececec";
}
function leave(handler, object){
    let hndlr = document.getElementById(handler);
    let obj = document.getElementById(object);
    // console.log(object);
    obj.style.display = "none";
    hndlr.style.backgroundColor = null;
}

function graphFromJSON(){
    graphX.fromJSON(graphJSON);
}

function getJSON(){
    graphJSON = graphX.toJSON();
   let graphJSONparsed = JSON.stringify(graphJSON);
    console.log(graphJSON);
    console.log(graphJSONparsed);
}

function extendCompound(){
    // pForEachD.resize(400, 400);
    console.log(pForEachD);
    pForEachD.transition('size/width', 400,{
        delay: 100,
        duration: 250,
        // valueFunction: joint.util.interpolate.unit,
        timingFunction: joint.util.timing.linear
    });
    pForEachD.transition('size/height', 400,{
        delay: 100,
        duration: 250,
        // valueFunction: joint.util.interpolate.unit,
        timingFunction: joint.util.timing.inout
    });
}

function clearLS() {
    localStorage.clear();
}
function getLS() {
    let i;

    console.log(">>>>> local storage");
    for (i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
    }

    console.log(">>>>> session storage");
    for (i = 0; i < sessionStorage.length; i++) {
        console.log(sessionStorage.key(i) + "=[" + sessionStorage.getItem(sessionStorage.key(i)) + "]");
    }
    // console.log("in Short: ");
    // for (i = 0; i < localStorage.length; i++)   {
    //     console.log(localStorage.key(i));
    // }
}
function resetGraph() {
    graph.clear();
    graph.addCell(xplD);
}

function getCells(){
   let xprocCells = xplD.getEmbeddedCells();
   let xprocCellsIds = xplD.get('embeds');
   let xprocCellsIdsLength = xprocCellsIds.length;
   console.log(xprocCells);
   console.log(xprocCellsIds);
   // xprocCells.resize(400,400);
    for (i=0; i<xprocCellsIdsLength; i++){
        let currentCell = graphX.getCell(xprocCellsIds[i]);
        if (globalWidth >= pipelineWidth && globalHeight >= pipelineHeight){
            currentCell.resize(pipelineWidth/xprocCellsIdsLength,globalHeight-100);
        }

    }
}

function falseFunc() {
    pChoose.portData[0].portPrimary = false;
    localStorage.setItem('p:choose', JSON.stringify(pChoose));
    console.log(pChoose);
}

paper.on('blank:pointerdown', function () {
    // $("#meta").fadeOut();
    $("#stringCont").remove();
});

//HIGHLIGHTING und META-FUNCTION
let selectedElement;
let oldCellView = null;
clickHighlight = 0;

paper.on('element:pointerdown', function(cellView, evt, x, y){
    // console.log(cellView.model.id);
    // console.log(cellView.model.toJSON());
    let model = this.model.toJSON();
    if(model.inPorts != null || model.outPorts != null){
        metaActive(cellView);
    }

    //HIGHLIGHTING Function
    if (oldCellView != null) {
        oldCellView.unhighlight();
        V(paper.findViewByModel(oldCellView.model).el).removeClass('highlight-class');
        console.log("Hello Highlighting!");
    }

    if (oldCellView != cellView) {
        // console.log('ungleich!');
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
        // console.log("Hello UnHighlighting!");
    } else {
        oldCellView = null;
        // console.log("Hello NochUnHighlighting!");
    }
    return;

    });

//META

function metaActive(cellView) {
    let cellViewX = cellView;
    let thisView = cellView.model;
    let thisModel = cellView.model.toJSON();
    let thisString = JSON.stringify(thisView);
    let inPortLength = thisModel.inPorts.length;
    let outPortLength = thisModel.outPorts.length;
    let optionLength = thisModel.stepOption.length;
    let itemLength = thisModel.ports.items.length;
    let thisColor = thisView.attributes.attrs.rect.fill;
    let modelHead = thisModel.attrs[".label"].text;

    modelString = "";
    modelString += '<div id="stringCont">'
    modelString += '<div class="modelString" style="background-color:'+ thisColor +'99;">';
    modelString += '<h3 class="model-head">' + modelHead +  '</h3>';

    if(inPortLength > 0 && thisModel.portData != null) {
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
            if(currentPortPrimaryIn == true){
                prime = 'checked';
            } else {prime = 'unchecked';}
            modelString += '<label style="color: #050805"><input type="checkbox" '+ prime +'><span class="slider"></span> </label>';
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

    if(outPortLength > 0 && thisModel.portData != null) {
        modelString += '<h4 class="port-head">Output-Ports</h4>';
        modelString += '<table>';
        modelString += '<tbody>';
        let idOld = "";
        for (let j = inPortLength; j < itemLength; j++) {
            let currentIdOut = thisModel.ports.items[j].id;
            let currentSourcePrimaryOut = thisModel.portData[j].portPrimary;
            let currentSourceSequenceOut = thisModel.portData[j].portSequence;
            let currentContentTypesOut = thisModel.portData[j].portContentTypes;
            // if (step.portData[j].portSerialization.indent !== null){
            //     let currentSerializationIndentOut = step.portData[j].portSerialization.indent;
            // }
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
    if (optionLength > 0 || thisModel.stepOption != null){
        modelString += '<div id="draggable">';
        modelString += '<h4 class="port-head">Options</h4>';

        modelString += '<div id="accordion" style="font-weight: bold;color: #fff;">';
        let stepOptionName;
        if (optionLength > 0){
            for (let k=0; k<optionLength; k++){
                stepOptionName = thisModel.stepOption[k].name;
                // console.log(stepOptionName);
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
                if(thisModel.stepOption[k].required == true){
                    isChecked = 'checked';
                } else {isChecked = 'unchecked';}
                modelString += '<td>';
                modelString += '<label><input type="checkbox" '+ isChecked +'><span class="slider"></span> </label>';
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
            stepOptionName = thisModel.stepOption.name;
            modelString += '<ul class="toggle text" style="list-style-type: none; padding: 0.2em;">';
            modelString += '<li style="color: #050805">required';
            let isChecked;
            if(thisModel.stepOption.required == true){
                isChecked = 'checked';
            } else {isChecked = 'unchecked';}
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

    $('.toggleClick').click(function(){
        $(this).siblings('.toggleView').toggle(250, function(){
            $(this).siblings('h3').toggleClass('toggleOpen').toggleClass('toggleClose');
        });
    });
}


// Console Function
paper.on('cell:pointerdblclick', function(cellView,evt,x,y){
    console.log(cellView.model.id);
    console.log(cellView.model.toJSON());
});

paper.on('cell:highlight', function(){
    $(document).bind('keydown',function(e){
        if(e.keyCode == 46) {
            // mydiv.fadeIn();
            console.log("ENTF");
            if (oldCellView != null) {
                oldCellView.remove();
            }
        }
    });
});

// //Button-based zoom-function
// $('#paper1').append('<div id="button_zoomIn" style="position:absolute; top: 820px; left: 1165px; z-index:100;opacity:1;"><button id="btn_zoomIn">+</button></div>');
// $('#paper1').append('<div id="button_zoomOut" style="position:absolute; top: 820px; left: 1087px; z-index:100;opacity:1;"><button id="btn_zoomOut">-</button></div>');
// $('#paper1').append('<div id="button_zoomReset" style="position:absolute; top: 820px; left: 1125px; z-index:100;opacity:1;"><button id="btn_zoomReset">^</button></div>');
//
// let btnZoomIn = document.getElementById('btn_zoomIn');
// let btnZoomOut = document.getElementById('btn_zoomOut');
// let btnZoomReset = document.getElementById('btn_zoomReset');
// btnZoomIn.onclick = zoomIn;
// btnZoomOut.onclick = zoomOut;
// btnZoomReset.onclick = zoomReset;

let graphScale = 1;

let paperScale = function(sx, sy) {
    paper.scale(sx, sy);
};

function zoomOut() {
    graphScale -= 0.1;
    paperScale(graphScale, graphScale);
};

function zoomIn() {
    graphScale += 0.1;
    paperScale(graphScale, graphScale);
};

function zoomReset() {
    graphScale = 1;
    paperScale(graphScale, graphScale);
};

paper.on('cell:contextmenu', function(cellView, evt, x, y){
    console.log("Heyhohey!");
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

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("stencil").style.width = "180px";
}
/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */

function closeNav() {
    let styleWidth = document.getElementById("stencil").style.width;
    // console.log(styleWidth);
    if (styleWidth == "180px"){
        document.getElementById("stencil").style.width = "20px";
        document.getElementById("stencil").style["background-color"] = "20px";
        document.getElementById("paper1").style["margin-left"] = "20px";
        document.getElementById("paperSwitch").style["margin-left"] = "20px";

    }
    else {
        document.getElementById("stencil").style.width = "180px";
        document.getElementById("stencil").style.width = "180px";
        document.getElementById("paper1").style["margin-left"] = "180px";
        document.getElementById("paperSwitch").style["margin-left"] = "180px";
    }
    // $('#stencil').toggle();
}
