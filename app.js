var fs = require('fs');

var cells = {
	snow: 'o',
	block: '#',
	clear: '.',
	houses: 'h'
};

fs.readFile('./input.txt', function (err, data) {
    if (err) {
        console.log(err);
    } else {        
        var inputs = data.toString().split('\n\r\n');
        for (var i = 0; i < inputs.length; i++) {
            var lines = inputs[i].split('\n');
            var temp = lines[0].trim().split(' ');
            var width = temp[0];
            var height = temp[1];
            lines.shift();
            if ((width > 0) && (height > 0)) {
                solve(lines, width, height);                
            }
        }
    }
})

function solve (lines, width, height) {
    var map = [];
    var obstacles = [];
    var houses = [];
    var houseMarks = ['A','B','C','D'];
    var plowed = [];
    
    for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < width; x++) {
            if (lines[y][x] === cells.block) {
                obstacles.push([x,y]);
            } else if (lines[y][x] === cells.clear) {
                plowed.push([x, y]);
            } else if (houseMarks.indexOf(lines[y][x]) > -1) {
                houses.push([x, y]);
            }
            row.push(lines[y][x]);
        }
        map.push(row);
    }
    console.log('obs');
    console.log(obstacles);
    console.log('houses');
    console.log(houses);
    console.log('plowed');
    console.log(plowed);
    
    var p2ps = [];
    var c = 0;
    while (c < houses.length) {
        var row = [];
        var d = 0;
        while (d < houses.length) {
            row.push([]);
            d++;
        }
        p2ps.push(row);
        c++;
    }

    var e = 0;
    while (e < houses.length -1) {
        var f = e + 1;
        while (f < houses.length) {
            var walked = [houses[e]];
            p2ps[e][f] = generatePaths(map, houses[e][0], houses[e][1], houses[f][0], houses[f][1], obstacles, walked);
            f++;
        }
        e++;
    }

    var smallestPlowMaps = getSmallestSets(generatePlowMaps(0,1))

    for (var v = 0; v < smallestPlowMaps.length; v++) {
        console.log(smallestPlowMaps[v].filter(notHouse).length);
    }

    function getSmallestSets (fullSet) {
        var smallestSet = [];
        var smallestSetLength = 0;
        if (fullSet.length > 0) {
            //initialize smallest to first element of fullSet
            smallestSet.push(fullSet[0]);
            smallestSetLength = fullSet[0].length;
            
            //loop through fullSet to get the smallest sets
            for (var u = 1; u < fullSet.length; u++) {
                if (fullSet[u].length < smallestSetLength) {
                    smallestSet = [];
                    smallestSet.push(fullSet[u]);
                    smallestSetLength = fullSet[u].length;
                } else if (fullSet[u].length === smallestSetLength) {
                    smallestSet.push(fullSet[u]);
                }
            }
        }
        return smallestSet;
    }

    function generatePlowMaps (a,b,plowMaps) {
        var plowMaps = [];
        //console.log(p2ps[0][1][0].concat(p2ps[1][2][0]).concat(p2ps[2][3][0]));
        var xf = p2ps[0][1].length;
        var yf = p2ps[0][2].length;
        var zf = p2ps[0][3].length;
        for (var x = 0; x < xf; x++) {
            for (var y = 0; y < yf; y++) {
                for (var z = 0; z < zf; z++) {
                    var tempMap = p2ps[0][1][x].concat(p2ps[0][2][y]).concat(p2ps[0][3][z]);
                    var plowMap = [];
                    for (var p = 0; p < tempMap.length; p++) {
                        addUniqueCoordinateToArray(tempMap[p], plowMap);
                    }
                    plowMaps.push(plowMap);
                }
            }
        }
        
        var xf = p2ps[0][1].length;
        var yf = p2ps[1][2].length;
        var zf = p2ps[1][3].length;
        var x = 0;
        var y = 0;
        var z = 0;
        for (var x = 0; x < xf; x++) {
            for (var y = 0; y < yf; y++) {
                for (var z = 0; z < zf; z++) {
                    var tempMap = p2ps[0][1][x].concat(p2ps[1][2][y]).concat(p2ps[1][3][z]);
                    var plowMap = [];
                    for (var p = 0; p < tempMap.length; p++) {
                        addUniqueCoordinateToArray(tempMap[p], plowMap);
                    }
                    plowMaps.push(plowMap);
                }
            }
        }
        
        
        var xf = p2ps[0][2].length;
        var yf = p2ps[1][2].length;
        var zf = p2ps[2][3].length;
        var x = 0;
        var y = 0;
        var z = 0;
        for (var x = 0; x < xf; x++) {
            for (var y = 0; y < yf; y++) {
                for (var z = 0; z < zf; z++) {
                    var tempMap = p2ps[0][2][x].concat(p2ps[1][2][y]).concat(p2ps[2][3][z]);
                    var plowMap = [];
                    for (var p = 0; p < tempMap.length; p++) {
                        addUniqueCoordinateToArray(tempMap[p], plowMap);
                    }
                    plowMaps.push(plowMap);
                }
            }
        }         
        
        return plowMaps;
    }

    function addUniqueCoordinateToArray (coordinate, toArray) {
        if (!isInCoordinateArray(coordinate[0], coordinate[1], toArray)) {
            toArray.push(coordinate);
        }
    }

    function notPlowed (coordinate) {
        return !isInCoordinateArray(coordinate[0], coordinate[1], plowed);
    }

    function notHouse (coordinate) {
        return !isInCoordinateArray(coordinate[0], coordinate[1], houses);
    }

    function cloneArray (myArray) {
        var clone = [];
        for (var i = 0; i < myArray.length; i++) {
            clone.push(myArray[i]);
        }
        return clone;
    }

    function getSmallerIndex (a, b) {
        return a < b ? a : b;
    }

    function getBiggerIndex (a, b) {
        return a > b ? a : b;
    }

    function generatePaths (map, x0, y0, x1, y1, excludedCells, walked) {
        if ((x0 === x1) && (y0 === y1)) {
            return [walked];
        } else {
            var options = [];
            var possibleOptions = [
                [x0 - 1, y0]
                ,[x0 + 1, y0]
                ,[x0, y0 - 1]
                ,[x0, y0 + 1]
            ];
            for (var i = 0; i < possibleOptions.length; i++) {
                if (checkCellAvailable(map, possibleOptions[i][0], possibleOptions[i][1], excludedCells, walked)) {
                    options.push(possibleOptions[i]);
                }
            }
            if (options.length === 0) {
                return []
            } else {
                var xs = getSmallerIndex(x0, x1);
                var xb = getBiggerIndex(x0, x1);
                var ys = getSmallerIndex(y0, y1);
                var yb = getBiggerIndex(y0, y1);
                        
                var bestOptions = [];
                var worstOptions = [];
                for (var k = 0; k < options.length; k++) {
                    if (((xs <= options[k][0]) && (options[k][0] <= xb) && (ys <= options[k][1]) && (options[k][1] <= yb)) ||
                        (isInCoordinateArray(options[k][0], options[k][1], plowed))) {
                        bestOptions.push(options[k]);
                    } else {
                        worstOptions.push(options[k]);
                    }
                }
                var paths = [];
                
                function addOptionsToPath (options) {
                    for (var m = 0; m < options.length; m++) {
                        var x2 = options[m][0];
                        var y2 = options[m][1];
                        var tempWalked = cloneArray(walked);
                        tempWalked.push(options[m]);
                        var paths2 = generatePaths(map, x2, y2, x1, y1, excludedCells, tempWalked);
                        if (paths2.length > 0) {
                            for (var b = 0; b < paths2.length; b++) {
                                if (paths2[b].length > 0) {
                                    paths.push(paths2[b].filter(notPlowed));
                                }
                            }					
                        }
                    }
                }
                
                addOptionsToPath(bestOptions);
                if (paths.length === 0) {
                    addOptionsToPath(worstOptions);
                    if (paths.length === 0) {
                        return [];
                    } else {
                        //get shortest paths
                        return getSmallestSets(paths);
                    }				
                } else {
                    //get shortest paths
                    return getSmallestSets(paths);
                }
            }
        }
    }


    function checkCellAvailable (map, x, y, excludedCells, walked) {
        var isCellAvailable = true;
        if ((y < map.length) && (y > -1)) {
            if ((x < map[y].length) && (x > -1)) {
                if (isInCoordinateArray(x, y, excludedCells)) {
                    isCellAvailable = false;
                } else if (isInCoordinateArray(x, y, walked)) {
                    isCellAvailable = false;
                } else {
                    isCellAvailable = true;
                }
            } else {
                isCellAvailable = false;
            }
        } else {
            isCellAvailable = false;
        }
        return isCellAvailable;
    }

    function isInCoordinateArray (x, y, coordinateArray) {
        var isIn = false;
        for (var i = 0; i < coordinateArray.length; i++) {
            if ((coordinateArray[i][0] === x) && (coordinateArray[i][1] === y)) {
                isIn = true;
                break;
            }
        }
        return isIn;
    }

}
