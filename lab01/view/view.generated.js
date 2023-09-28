
const NODES_JSON = '[{"id":0,"label":"s2/y1"},{"id":1,"label":"s3/y2"},{"id":2,"label":"s1/y2"},{"id":3,"label":"s1/y1"}]'
const EDGES_JSON = '[{"from":0,"to":2,"label":"x0","length":250},{"from":0,"to":3,"label":"x1","length":250},{"from":1,"to":0,"label":"x0","length":250},{"from":1,"to":1,"label":"x1","length":250},{"from":2,"to":0,"label":"x0","length":250},{"from":2,"to":1,"label":"x1","length":250},{"from":3,"to":0,"label":"x0","length":250},{"from":3,"to":1,"label":"x1","length":250}]'

window.onload = () => {
    var nodes = new vis.DataSet(JSON.parse(NODES_JSON));

// create an array with edges
    var edges = new vis.DataSet(JSON.parse(EDGES_JSON));

    var data = {
        nodes: nodes,
        edges: edges,
    };
    var options = {
        edges: {
            font: {
                align: "top",
                size: 10,
            },
            arrows: {
                to: { enabled: true, scaleFactor: 0.5, type: "arrow" }
            },
        },
    }
    new vis.Network(document.getElementsByClassName('container')[0], data, options);
}
