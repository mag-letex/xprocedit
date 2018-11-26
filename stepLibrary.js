//Atomic Steps Declaration
let pAddAttributeD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:add-attribute"}
    },
    stepType: "pAddAttribute",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "match",
            required: true
        },
        {
            name: "attribute-name",
            required: true
        },
        {
            name: "attribute-prefix"
        },
        {
            name: "attribute-namespace"
        },
        {
            name: "attribute-value",
            required: true
        }
    ]
});
// pAddAttributeD.embed(newBoeppel);
localStorage.setItem('pAddAttribute', JSON.stringify(pAddAttributeD));
// graph.addCell(pAddAttributeD.clone().translate(xRel, yRel));
// graph.addCell(newBoeppel);
// graph.addCell(pAddAttributeD.clone());
let pAddXmlBaseD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:add-xml-base"}
    },
    stepType: "pAddXmlBase",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "all",
            required: false
        },
        {
            name: "relative",
            required: true
        }
    ]
});

localStorage.setItem('pAddXmlBase', JSON.stringify(pAddXmlBaseD));

let pCompareD = new joint.shapes.xproc.Atomic({
    inPorts: ["source", "alternate"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:compare"}
    },
    stepType: "pCompare",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
        },
        {
            portId: "alternate",
            portGroup: "in",
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "fail-if-not-equal",
            required: false
        }
    ]
});
localStorage.setItem('pCompare', JSON.stringify(pCompareD));

let pCountD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:count"}
    },
    stepType: "pCount",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
            portSequence: true
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "limit",
            select: 0
        }
    ]
});
localStorage.setItem('pCount', JSON.stringify(pCountD));

let pDeleteD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:delete"}
    },
    stepType: "pDelete",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "match",
            required: true
        }
    ]
});
localStorage.setItem('pDelete', JSON.stringify(pDeleteD));

let pDirectoryListD = new joint.shapes.xproc.Atomic({
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:directory-list"}
    },
    stepType: "pDirectoryList",
    portData: [
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "path",
            required: true
        },
        {
            name: "include-filter"
        },
        {
            name: "exclude-filter"
        }
    ]
});
localStorage.setItem('pDirectoryList', JSON.stringify(pDirectoryListD));

let pErrorD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:error"}
    },
    stepType: "pError",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
        {
            name: "code",
            required: true
        },
        {
            name: "code-prefix"
        },
        {
            name: "code-namespace"
        }
    ]
});
localStorage.setItem('pError', JSON.stringify(pErrorD));

let pEscapeMarkupD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:escape-markup"}
    },
    stepType: "pEscapeMarkup",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: true,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
        }
    ],
    stepOption: [
        {
            name: "cdata-section-elements",
            select: ""
        },
        {
            name: "doctype-public"
        },
        {
            name: "doctype-system"
        },
        {
            name: "escape-uri-attributes",
            select: false
        },
        {
            name: "include-content-type",
            select: true
        },
        {
            name: "indent",
            select: false
        },
        {
            name: "media-type"
        },
        {
            name: "method",
            select: "xml"
        },
        {
            name: "omit-xml-declaration",
            select: true
        },
        {
            name: "standalone",
            select: "omit"   //true, false, omit
        },
        {
            name: "undeclare-prefixes",
            select: "1.0 "
        }
    ]
});
localStorage.setItem('pEscapeMarkup', JSON.stringify(pEscapeMarkupD));


// Compound Steps

let pForEachD = new joint.shapes.xproc.Compound({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:for-each"}
    },
    stepType: "pForEach",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
        {
            name: "code",
            required: true
        },
        {
            name: "code-prefix"
        },
        {
            name: "code-namespace"
        }
    ]
});
localStorage.setItem('pForEach', JSON.stringify(pForEachD));

let pViewportD = new joint.shapes.xproc.Compound({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:viewport"}
    },
    stepType: "pViewport",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
        {
            name: "code",
            required: true
        },
        {
            name: "code-prefix"
        },
        {
            name: "code-namespace"
        }
    ]
});
localStorage.setItem('pViewport', JSON.stringify(pViewportD));

let pTryCatchD = new joint.shapes.xproc.Compound({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:try-catch"}
    },
    stepType: "pTryCatch",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
        {
            name: "code",
            required: true
        },
        {
            name: "code-prefix"
        },
        {
            name: "code-namespace"
        }
    ]
});
localStorage.setItem('pTryCatch', JSON.stringify(pTryCatchD));

let pChooseD = new joint.shapes.xproc.Compound({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "p:choose"}
    },
    stepType: "pChoose",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
        {
            name: "code",
            required: true
        },
        {
            name: "code-prefix"
        },
        {
            name: "code-namespace"
        }
    ]
});
localStorage.setItem('pChoose', JSON.stringify(pChooseD));


//Customizable Steps
let xMyAtomicStepD = new joint.shapes.xproc.Atomic({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "x:my-atomic-step"},
        rect: { fill: '#d25c29', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },

    },
    stepType: "xMyAtomicStep",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
    ]
});

localStorage.setItem('xMyAtomicStep', JSON.stringify(xMyAtomicStepD));
let xMyCompoundStepD = new joint.shapes.xproc.Compound({
    inPorts: ["source"],
    outPorts: ["result"],
    attrs: {
        '.label': {text: "x:my-compound-step"},
        // '.word2': {text: newId},
        rect: { fill: '#d25c29', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 }

    },
    stepType: "xMyCompoundStep",
    portData: [
        {
            portId: "source",
            portGroup: "in",
            portPrimary: false,
        },
        {
            portId: "result",
            portGroup: "out",
            portPrimary: true,
            portSequence: true
        }
    ],
    stepOption: [
    ]
});
localStorage.setItem('xMyCompoundStep', JSON.stringify(xMyCompoundStepD));

let xTestObject = new joint.shapes.xproc.Atomic({
    inPorts: ["in1", "in2"],
    outPorts: ["out1", "out2"],
    attrs: {
        '.label': {text: 'Undefined', 'font-weight': 'bold'},
        rect: {fill: '#fc81ff'}
    },
    stepType: 'xTestObject',
    portData: [
        {
            portId: "erstens",
            portGroup: "in",
            portPrimary: true,
            portSequence: false,
            portContentTypes: "app/xml"
        },
        {
            portId: "erstens",
            portGroup: "in",
            portPrimary: false,
            portSequence: true,
            portContentTypes: "appli/xml"
        },
        {
            portId: "erstens",
            portGroup: "out",
            portPrimary: true,
            portSequence: false,
            portContentTypes: "applica/xml"
        },
        {
            portId: "erstens",
            portGroup: "out",
            portPrimary: false,
            portSequence: true,
            portContentTypes: "application/xml"
        }
    ]
});

// // xProc - localStorage - Bibliothek
// function loadEditor() {
//
//     //Atomic Steps
//     pAddAttribute = JSON.parse(localStorage.getItem('pAddAttribute'));
//     pAddXmlBase = JSON.parse(localStorage.getItem('pAddXmlBase'));
//     pCompare = JSON.parse(localStorage.getItem('pCompare'));
//     pCount = JSON.parse(localStorage.getItem('pCount'));
//     pDelete = JSON.parse(localStorage.getItem('pDelete'));
//     pDirectoryList = JSON.parse(localStorage.getItem('pDirectoryList'));
//     pError = JSON.parse(localStorage.getItem('pError'));
//     pEscapeMarkup = JSON.parse(localStorage.getItem('pEscapeMarkup'));
//
//     //Compound Steps
//     pForEach = JSON.parse(localStorage.getItem('pForEach'));
//     pViewport = JSON.parse(localStorage.getItem('pViewport'));
//     pTryCatch = JSON.parse(localStorage.getItem('pTryCatch'));
//     pChoose = JSON.parse(localStorage.getItem('pChoose'));
//
//     //Transpect Modules
//     trXsdVal = JSON.parse(localStorage.getItem('trXsdVal'));
//
//     //MySteps
//     xMyAtomicStep = JSON.parse(localStorage.getItem('xMyAtomicStep'))
//     xMyCompoundStep = JSON.parse(localStorage.getItem('xMyCompoundStep'))
// }