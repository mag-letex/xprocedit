// // Helpers.
// // --------
//
// function buildGraphFromAdjacencyList(adjacencyList) {
//
//   var elements = [];
//   var links = [];
//
//   _.each(adjacencyList, function(edges, parentElementLabel) {
//     elements.push(makeElement(parentElementLabel));
//
//     _.each(edges, function(childElementLabel) {
//       links.push(makeLink(parentElementLabel, childElementLabel));
//     });
//   });
//
//   // Links must be added after all the elements. This is because when the links
//   // are added to the graph, link source/target
//   // elements must be in the graph already.
//   return elements.concat(links);
// }
//
// function makeLink(parentElementLabel, childElementLabel) {
//
//   return new joint.dia.Link({
//     source: { id: parentElementLabel },
//     target: { id: childElementLabel },
//     attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' } },
//     smooth: true
//   });
// }
//
// function makeElement(label) {
//
//   var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;
//
//   // Compute width/height of the rectangle based on the number
//   // of lines in the label and the letter size. 0.6 * letterSize is
//   // an approximation of the monospace font letter width.
//   var letterSize = 8;
//   var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
//   var height = 2 * ((label.split('\n').length + 1) * letterSize);
//
//   return new joint.shapes.basic.Rect({
//     id: label,
//     size: { width: width, height: height },
//     attrs: {
//       text: { text: label, 'font-size': letterSize, 'font-family': 'monospace' },
//       rect: {
//         width: width, height: height,
//         rx: 5, ry: 5,
//         stroke: '#555'
//       }
//     }
//   });
// }

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({

  el: $('#paper'),
  width: 1000,
  height: 2000,
  gridSize: 1,
  model: graph
});

var rect = new joint.shapes.devs.Coupled({
  size: {width: 100, height: 100},
  attrs:
    {
      text: {text: 'Model 1'}
    },
  inPorts: ['in'],
  outPorts: ['out']
});

var rect2 = new joint.shapes.devs.Atomic({
  size: {width: 100, height: 100},
  attrs:
    {
      text: {text: 'Model 2'}
    },
  inPorts: ['in'],
  outPorts: ['out1', "out2"]
});

var rect3 = new joint.shapes.devs.Atomic({
  size: {width: 100, height: 100},
  attrs:
    {
      text: {text: 'Model 3'}
    },
  inPorts: ['in'],
  outPorts: ['out']
});

var rect4 = new joint.shapes.devs.Atomic({
  size: {width: 100, height: 100},
  attrs:
    {
      text: {text: 'Model 4'}
    },
  inPorts: ['in'],
  outPorts: ['out']
});

var rect5 = new joint.shapes.devs.Coupled({
  size: {width: 100, height: 100},
  attrs:
    {
      text: {text: 'Model 5'}
    },
  inPorts: ['in'],
  outPorts: ['out']
});


// var link2 = new joint.dia.Link({
//   source: { id: rect },
//   target: { id: rect2 },
//   attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' } },
//   smooth: true
// });
//
// var link23 = new joint.dia.Link({
//   source: { id: rect2 },
//   target: { id: rect3 },
//   attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' } },
//   smooth: true
// });
// var link34 = new joint.dia.Link({
//   source: { id: rect3 },
//   target: { id: rect4 },
//   attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' } },
//   smooth: true
// });

// Main.
// -----


// // Just give the viewport a little padding.
// V(paper.viewport).translate(20, 20);

// $('#btn-layout').on('click', layout);

graph.addCells([rect, rect2, rect3, rect4, rect5]);
rect.embed(rect2);
rect.embed(rect3);
rect.embed(rect4);

// let cells = [];
// cells.push(rect, rect2, rect3, rect4, rect5);

// graph.addCells([rect, rect2, rect3, rect4, link2, link23, link34]);

function order(el) {
  let cells = graph.getCells();
  let compId = rect.id;
  let links = graph.getLinks();
  console.log(cells);
  console.log(compId);
  console.log(links);
  let critLinksId = [];
  let critLinksCells = [];
  for (let i = 0; i < links.length; i++) {
    let source = links[i].attributes.source.id;
    let target = links[i].attributes.target.id;
    let link = links[i].id;
    let linkCell = links[i];
    if (source === compId || target === compId) {
      critLinksId.push(link);
      critLinksCells.push(linkCell);
    }
  }
  console.log(critLinksCells);
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < critLinksCells.length; j++) {
      if (cells[i].cid === critLinksCells[j].cid) {
        cells.splice(i, 1);
      }
    }
  }
  let graphBBox = joint.layout.DirectedGraph.layout(cells, {
    rankDir: "LR",
    nodeSep: 80,
    edgeSep: 80,
    rankSep: 100,
    marginX: 50,
    marginY: 50,
    clusterPadding: {left: 30, right: 30, top: 50, bottom: 30}
    // _isCompound: true,
    // setLabels: true
  });
  // console.log('x:', graphBBox.x, 'y:', graphBBox.y)
  // console.log('width:', graphBBox.width, 'height:', graphBBox.height);
  console.log(graphBBox);
}

let btn = document.getElementById('btn-layout');
btn.addEventListener('click', function () {
  let graphy = graph.toGraphLib();
  let nodes = graphy.nodes();
  let graphLi = graphlib.alg.isAcyclic(graph.toGraphLib());
  graphy._isCompound = true;

  console.log(graphy);
  console.log(nodes);

  console.log(graphLi);
  order(graphy);
});

// function layout() {
//
//   try {
//     var adjacencyList = eval('adjacencyList = ' + $('#adjacency-list').val());
//   } catch (e) { alert(e); }
//
//   var cells = buildGraphFromAdjacencyList(adjacencyList);
//   graph.resetCells(cells);
//   joint.layout.DirectedGraph.layout(graph, { setLinkVertices: false });
// }
// layout();