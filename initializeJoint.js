    let browserHeight = window.innerHeight;
    console.log(browserHeight);
    // document.querySelector("#container").style["max-height"] = browserHeight - 50 + "px";
    // document.querySelector("#container").style["min-height"] = browserHeight - 50 + "px";

    // $(document).on("mousemove", function (event) {
    //     pageX = event.pageX;
    //     pageY = event.pageY;
    //     $("#log").text("pageX: " + event.pageX + ", pageY: " + event.pageY);
    // });

    // Step Panel Function --> W3schools
    let atomicInput = document.querySelector("#inputAtomicStep");
    atomicInput.addEventListener("keyup", function () {
        let input, filter, ul, li, a, i;
        input = document.getElementById("inputAtomicStep");
        filter = input.value.toUpperCase();
        ul = document.getElementById("atomicUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            }
            else {
                li[i].style.display = "none";
            }
        }
    });
    let compoundInput = document.querySelector("#inputCompoundStep");
    // let compoundInput = document.getElementById("inputCompoundStep");
    compoundInput.addEventListener("keyup", function () {
        let input, filter, ul, li, a, i;
        input = document.getElementById("inputCompoundStep");
        filter = input.value.toUpperCase();
        ul = document.getElementById("compoundUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            }
            else {
                li[i].style.display = "none";
            }
        }
    });
    let transpectInput = document.querySelector("#inputTranspectStep");
    // let transpectInput = document.getElementById("inputCompoundStep");
    transpectInput.addEventListener("keyup", function () {
        let input, filter, ul, li, a, i;
        input = document.getElementById("inputTranspectStep");
        filter = input.value.toUpperCase();
        ul = document.getElementById("transpectUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            }
            else {
                li[i].style.display = "none";
            }
        }
    });
    let customInput = document.querySelector("#inputCustomStep");
    // let customInput = document.getElementById("inputCustomStep");
    customInput.addEventListener("keyup", function () {
        let input, filter, ul, li, a, i;
        input = document.getElementById("inputCustomStep");
        filter = input.value.toUpperCase();
        ul = document.getElementById("customUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            }
            else {
                li[i].style.display = "none";
            }
        }
    });

    let devsLink = joint.dia.Link.define('devs.StandLink', {});
    let devsStandLink = new devsLink({
        router: {name:'manhattan'},
        connector: {name:'rounded'},
        attrs:{
            '.connection': {fill: '#fff7ec', stroke: '#FFF7EC', 'stroke-width': 3},
            '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
        }
    });
    let devsMainLink = new devsLink({
        router: {name:'manhattan'},
        connector: {name:'rounded'},
        attrs:{
            '.connection': {fill: '#BB471B', stroke: '#BB471B', 'stroke-width': 5},
            '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
        }
    });

    let btnLink = document.getElementById('btn_link');
    // Canvas Initialization
    let canvas = document.querySelector('#papers');

    let graph = new joint.dia.Graph,
        paper = new joint.dia.Paper({
            el: $('#paper1'),
            model: graph,
            // width: 938,
            // height: 854,
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            defaultLink: function(elementView, magnet) {
                if (btnLink.innerHTML === "Main Link") return devsMainLink.clone();
                else return devsStandLink.clone();
            },
            snapLinks: true,
            linkPinning: false,
            gridSize: 15,
            drawGrid: {
                name: 'mesh',
                args: [
                    { color: 'black', thickness: 1 } // settings for the primary mesh
                    // { color: 'green', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
                ]},
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
                if (sourceGroup != targetGroup) {
                    return true;
                }
            }
        });
    let graph2 = new joint.dia.Graph,
        paper2 = new joint.dia.Paper({
            el: $('#paper2'),
            model: graph2,
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            // width: 938,
            // height: 854
            width: $('#paper2').width(),
            height: $('#paper2').height()
        });
    let graph3 = new joint.dia.Graph,
        paper3 = new joint.dia.Paper({
            el: $('#paper3'),
            model: graph3,
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            width: 938,
            height: 854
        });
    let graph4 = new joint.dia.Graph,
        paper4 = new joint.dia.Paper({
            el: $('#paper4'),
            model: graph4,
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            width: 938,
            height: 854
        });
    let graph5 = new joint.dia.Graph,
        paper5 = new joint.dia.Paper({
            el: $('#paper5'),
            model: graph5,
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            width: 938,
            height: 854
        });

    // Paper-Switch-Event
    $('.papercontent').css("display", "none");

    function switchPaper(evt, paperId) {
        // Declare all variables
        let i, papercontent, tablink;

        // Get all elements with class="papercontent" and hide them
        papercontent = document.getElementsByClassName("papercontent");
        for (i = 0; i < papercontent.length; i++) {
            papercontent[i].style.display = "none";
        }
        // Get all elements with class="tablink" and remove the class "active"
        tablink = document.getElementsByClassName("tablink");
        for (i = 0; i < tablink.length; i++) {
            tablink[i].className = tablink[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(paperId).style.display = "block";
        evt.currentTarget.className += " active";
        // console.log(paperId);
        paperI = paperId;

        switch (paperI) {
            case "paper1":
                paperX = paper;
                graphX = graph;
                // paperToGo = "#paper1";
                break;
            case "paper2":
                paperX = paper2;
                graphX = graph2;
                // paperToGo = "#paper2";
                break;
            case "paper3":
                paperX = paper3;
                graphX = graph3;
                // paperToGo = "#paper3";
                break;
            case "paper4":
                paperX = paper4;
                graphX = graph4;
                // paperToGo = "#paper4";
                break;
            case "paper5":
                paperX = paper5;
                graphX = graph5;
                // paperToGo = "#paper5";
                break;
        }
    }
    document.getElementById("defaultOpen").click();

    // MARKUP - MANIPULATION
    joint.shapes.xproc = {};

    joint.shapes.xproc.toolElementAtomic = joint.shapes.devs.Atomic.extend({

        toolMarkup: ['<g class="element-tools">',
            '<g class="element-tool-remove"><circle fill="red" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove this element from the model</title>',
            '</g>',
            // '<g class="element-tool-big" transform="translate(200,0)  rotate(45)"><circle fill="blue" r="11"/>',
            // '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            // '<title>Maximize</title>',
            // '</g>',
            '<g class="element-tool-small" transform="translate(200,0)  rotate(45)"><circle fill="pink" r="11"/>',
            '<path transform="matrix(0.8,0,0,0.8,-12.8,-12.8)" d="m 24.777,10.415 -2.828,-2.83 c 0,0 0.257243,-0.2562432 -13.833,13.834 l 2.83,2.829 z"/>',
            '<title>Minimize</title>',
            '</g>',
            // '<g class="element-tool-meta"><circle fill="grey" r="20"/>',
            // '<text text-anchor="middle" stroke="#fff" stroke-width="2px" dy=".3em">M</text>',
            // '<title>Open Meta-Information</title>',
            // '</g>',
            '<g class="element-tool-options"><circle fill="#7642B2" r="10"/>',
            '<text text-anchor="middle" stroke="#fff" stroke-width="1px" dy=".3em">O</text>',
            '<title>Open Options</title>',
            '</g>',
            '<g class="element-tool-boeppel">',
            '<path d="M 2,2 l 0,12 6,0" fill="none" stroke="white" stroke-width="1.5"/>',
            // '<path d="M0,-2 l 200,0 0,25 -200,0z" fill="white" fill-opacity="0.1" cursor="default"/>',
            '<g class="element-tool-boeppelClick" id="boepplo" transform="translate(-6,0)" cursor="pointer">',
            '<path d="M15,2 l20,0 0,20 -20,0z" fill="grey" fill-opacity="0.1"/>',
            '<path stroke="white" fill="white" stroke-width="1.5" d="M20,12 l 10,0 M 25,7 l0,10"/>',
            '<circle fill="none" stroke="white" cx="25" cy="12" r="8"/>',
            '</g>',
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

    joint.shapes.xproc.Atomic = joint.shapes.xproc.toolElementAtomic.extend({

        markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text class="label"/><text class="word2"></text></g>',

        defaults: joint.util.deepSupplement({

            type: 'xproc.Atomic',
            attrs: {
                rect: {
                    fill: '#A876FF',
                    stroke: 'black',
                    'stroke-width': 1,
                    'follow-scale': true,
                    width: 160,
                    height: 80
                },
                text: {ref: 'rect'},
                '.label': {ref: 'rect'},
                '.word2': {y: 60, x: 100}
            },
            size: {width: 200, height: 100},
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
                                r: 12,
                                fill: '#fff'
                                // magnet: 'passive'
                            }
                            // 'circle': {fill: 'green'}
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
                                r: 12,
                                // magnet: 'passive'
                            }
                            // 'circle': {fill: 'green'}
                        },
                        markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
                    }
                }
            },
            stepType: "unset",
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

    joint.shapes.xproc.toolElementCompound = joint.shapes.devs.Coupled.extend({

        toolMarkup: ['<g class="element-tools">',
            '<g class="element-tool-remove"><circle fill="red" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove this element from the model</title>',
            '</g>',
            '<g class="element-tool-big"><circle fill="blue" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>maximize</title>',
            '</g>',
            '<g class="element-tool-small"><circle fill="pink" r="11"/>',
            '<path transform="matrix(0.8,0,0,0.8,-12.8,-12.8)" d="m 24.777,10.415 -2.828,-2.83 c 0,0 0.257243,-0.2562432 -13.833,13.834 l 2.83,2.829 z"/>',
            '<title>Minimize</title>',
            '</g>',
            // '<g class="element-tool-meta"><circle fill="grey" r="20"/>',
            // '<text text-anchor="middle" stroke="#fff" stroke-width="2px" dy=".3em">M</text>',
            // '<title>Open Meta-Information</title>',
            // '</g>',
            '<g class="element-tool-embed" transform="translate(150,60)"><circle fill="grey" r="20"/>',
            '<text text-anchor="middle" stroke="#fff" stroke-width="2px" dy=".3em">E</text>',
            '<title>Get Embedded Cells</title>',
            '</g>',
            '<g class="element-tool-options"><circle fill="#7642B2" r="10"/>',
            '<text text-anchor="middle" stroke="#fff" stroke-width="1px" dy=".3em">O</text>',
            '<title>Open Options</title>',
            '</g>',
            '<g class="element-tool-boeppel">',
            '<path d="M 2,2 l 0,12 6,0" fill="none" stroke="white" stroke-width="1.5"/>',
            // '<path d="M0,-2 l 200,0 0,25 -200,0z" fill="white" fill-opacity="0.1" cursor="default"/>',
            '<g class="element-tool-boeppelClick" id="boepplo" transform="translate(-6,0)" cursor="pointer">',
            '<path d="M15,2 l20,0 0,20 -20,0z" fill="grey" fill-opacity="0.1"/>',
            '<path stroke="white" fill="white" stroke-width="1.5" d="M20,12 l 10,0 M 25,7 l0,10"/>',
            '<circle fill="none" stroke="white" cx="25" cy="12" r="8"/>',
            '</g>',
            '</g>',
            '</g>'].join(''),

        defaults: joint.util.deepSupplement({
            // attrs: {
            //     text: { 'font-weight': 'bold', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': 0.4, 'y-alignment': 'middle' },
            // },
        }, joint.shapes.devs.Coupled.prototype.defaults)
    });

    //COMPOUND - DECLARATION
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
                // '.word1': {'dx':0, 'dy': 20},
                '.label': {ref: 'rect', 'font-weight': 'bold', 'font-size': 20},
                '.word2': {y: 60, x: 100}
            },
            size: {width: 200, height: 100},
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
                                r: 12,
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
                                r: 12,
                                // magnet: 'passive'
                            }
                            // 'circle': {fill: 'red'}
                        },
                        markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
                    }
                }
            },
            stepType: "unset",
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
        }, joint.shapes.xproc.toolElementCompound.prototype.defaults)
    });


    //Element Tools
    modelIdOld = "";
    clicks = 0;
    modelNewHeight = 100;
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
                case 'element-tool-big':
                    this.model.resize(400, 400);
                    $('.element-tool-big').css('display', 'none');
                    $('.element-tool-meta').css('transform', 'translate(200px,200px)');
                    $('.element-tool-boeppel').css('transform', 'translate(0,400px)');
                    $('.element-tool-options').css('transform', 'translate(15px,386px)');
                    $('.element-tool-small').css({
                        "display": "block",
                        "transform": "translate(400px,0) rotate(45deg)"
                    });
                    console.log(className);
                    return;
                    break;
                case 'element-tool-small':
                    this.model.resize(200, 100);
                    $('.element-tool-small').css('display', 'none');
                    $('.element-tool-big').css('display', 'block');
                    return;
                    break;
                // case 'element-tool-meta':
                //     metaActive();
                //     return;
                //     break;
                case 'element-tool-embed':
                    // let embed = this.model.getEmbeddedCells();
                    // console.log(embed);
                    return;
                    break;
                case 'element-tool-boeppelClick':
                    let optionName = "unset";
                    let boeppelId = "" + this.model.id + "_boep";
                    makeBoeppl(this, boeppelId, optionName);
                    return;
                    break;
                case 'element-tool-options':
                    // $('.newBoeppel,.element-tool-boeppel').toggle();
                    console.log(this.model.getEmbeddedCells());
                    let thisCells = this.model.get('embeds');
                    let thisCellsLength = thisCells.length;
                    for (i = 0; i < thisCellsLength; i++) {
                        let currentCell = graphX.getCell(thisCells[i]);
                        let currentDisplay = currentCell.attr('./display');
                        if (currentDisplay == null || currentDisplay == 'block') {
                            currentCell.attr('./display', 'none');
                        }
                        console.log(currentDisplay);
                        if (currentDisplay == 'none') {
                            currentCell.attr('./display', 'block');
                        }
                    }
                    return;
                    break;
                default:
            }
            joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
        }
    });
    joint.shapes.xproc.AtomicView = joint.shapes.xproc.ToolElementView;
    joint.shapes.xproc.CompoundView = joint.shapes.xproc.ToolElementView;

    let xplD = new joint.shapes.xproc.Compound({
        position: {
            x: 50,
            y: 30
        },
        size: {
            width: canvas.offsetWidth - (canvas.offsetWidth*10/100),
            height: canvas.offsetHeight -(canvas.offsetHeight*10/100)
        },
        stepType: "pipeline",
        attrs: {
            rect: {
                fill: '#647664',
                stroke: 'black',
                'stroke-width': 1,
                'follow-scale': true,
                width: 160,
                height: 80,
                'rx': 6,
                'ry': 6
            },
            '.label': {text: "Xproc-Pipeline", fill: "#FFF7EC", 'font-size': '1.4em'}
        },
        inPorts: ["source"],
        outPorts: ["result"],
        portData: [
            {
                portId: "source",
                portGroup: "in",
                portPrimary: true,
            },
            {
                portId: "result",
                portGroup: "pipe-out",
                portPrimary: true,
                portSequence: true
            }
        ]
    });

    xplD.portProp('source', 'markup', '<g><circle class="port-body in-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
    xplD.portProp('result', 'markup', '<g><circle class="port-body out-ports primary" r="10"/><text fill="#000" y="5" text-anchor="middle" font-weight="bold">P</text></g>');
    xplD.portProp('source', 'attrs/g/port-group', 'pipe-in');
    xplD.portProp('result', 'attrs/g/port-group', 'pipe-out');
    graph.addCells([xplD]);
    V(paper.findViewByModel(xplD).el).addClass('xplEl');

    window.addEventListener("resize", function(){
        let canvasWidth = canvas.offsetWidth;
        let canvasHeight =  canvas.offsetHeight;
        paper.setDimensions(canvasWidth, canvasHeight);
        let xplWidth = canvasWidth * 0.8 + (canvas.offsetWidth*10/100);
        let xplHeight = canvasWidth * 0.6;
        xplD.resize(xplWidth, xplHeight);
    });

    //Definition of a custom Model object
    let xprocOption = joint.shapes.devs.Model.define('xproc.Option', {
        //default attributes
        type: "devs.Model",
        // markup: [{
        //     tagName: 'xproc',
        //     selector: 'xproc'}
        // ],
        // position: {
        //     x: 200,
        //     y: 250
        // },
        size: {
            width: 200,
            height: 20
        },
        attrs: {
            ".label": {text: 'Böppel 1', fill: 'white', 'font-weight': 'bold', 'font-size': '0.9em', 'ref-y': 2},
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
                            r: 10,
                            fill: '#fff'
                            // magnet: 'passive'
                        },
                        'circle': {fill: 'red'}
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
                                x: 20
                            }
                        }
                    },
                    attrs: {
                        '.port-body': {
                            fill: '#fff',
                            r: 10,
                            // magnet: 'passive'
                        },
                        'circle': {fill: 'red'}
                    },
                    markup: "<circle class=\"port-body out-ports\" r=\"10\" stroke=\"#000\" fill=\"#fff\"/>"
                }
            }
        },
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

    let newBoeppel = new joint.shapes.xproc.Option({
        inPorts: ["in"],
        outPorts: ["out"],
        portData: [
            {
                portId: "in",
                portGroup: "in",
                portPrimary: "unset",
                portSequence: "unset",
                portContentTypes: "unset",
                portSerialization: {indent: "unset"}
            },
            {
                portId: "in",
                portGroup: "out",
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

