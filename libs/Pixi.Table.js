//Version 1.0.4

/**
 * Creates a new table that can have any PIXI.DisplayObject attached to it. The way to address updates is to use rows and cells.
 * You are given a starting row when the class is initialized.
 * The only argument passed is an options object.
 */
class Table extends PIXI.Container{
    /**
     * Ivoke to get a new Table.
     * @param {*} options An options parameter that contains all of the data necessary for the table to display correctly. Default values are set and can be configured manually after the fact.
     */
    constructor(options = {
        debugMode: false,
        rowSeparation : 10,
        columnSeparation : 10,
        rowStartPosition: {x:5,y:5},
        cellStartPosition: {x:5, y:5},
        tableTitle: null
    }){
        super();
        //options
        this.debugMode = options.debugMode; //for displaying information about what's happening. Goes to the console.log
        this.rowBuffer = options.rowSeparation; //the buffer between rows to be added
        this.columnBuffer = options.columnSeparation; //the buffer between columns to be added
        this.rowStartPosition = options.rowStartPosition; //the start position for all rows
        this.cellStartPosition = options.cellStartPosition; //the starting position for all cells
        this.title = options.tableTitle; //the title of the table. Optional. Null will not draw the title.

        //display objects
        this.drawTitle();
        this.rows = [new PIXI.Container()];
        this.rows[0].position.set(this.rowStartPosition.x,this.rowStartPosition.y);
        this.rowCount = this.rows.length;
        this.maxCols = 0;
        this.addChild(this.rows[0]);
    }

    /**
     * INTERNAL USE, NEVER CALL.
     */
    drawTitle(){
        if(this.title != null){
            this.title.pivot.x = this.title.width / 2;
        }
        else{
            this.title = new PIXI.Text();
            this.title.pivot.x = this.title.width / 2;
        }
        this.addChild(this.title);
    }

    /**
     * Adds a blank row to the table.
     */
    addRow(){
        this.debugLog("add row");
        this.rows.push(new PIXI.Container());
        this.rowCount++;
        let row = this.rows[this.rows.length -1];
        
        if(this.rowCount > 1){
            row.position.set(
                this.rowStartPosition.x,
                this.rows[this.rows.length -2].y + this.rows[this.rows.length -2].height
            )
        }
        else{
            row.position.set(this.rowStartPosition.x,this.rowStartPosition.y);
        }

        this.addChild(row);
    }

    /**
     * Adds a row at the specified location. 
     * @param {} rowNumber The row number to splice at
     */
    addRowAt(rowNumber){
        this.debugLog("add row at", {rowNumber:rowNumber});
        this.rows.splice(rowNumber, 0, new PIXI.Container());
        
        
        this.addChildAt(this.rows[rowNumber], rowNumber );

        let row = this.rows[rowNumber];
        if(this.rowCount > 1){
            row.position.set(
                this.rowStartPosition.x,
                this.rows[this.rows.length -2].y + this.rows[this.rows.length -2].height
            )
        }
        else{
            row.position.set(this.rowStartPosition.x,this.rowStartPosition.y);
        }
        
        this.updateRows();
    }

    /**
     * Adds a cell at the specified x,y location
     * @param {*} displayObject The display object to add
     * @param {*} rowNumber The row number
     * @param {*} cellNumber The cell number
     */
    addCellAt(displayObject, rowNumber, cellNumber){
        this.debugLog("add cell at", {rowNumber:rowNumber, cellNumber:cellNumber});
        let row = this.rows[rowNumber];
            if(typeof row.cells == 'undefined' && cellNumber == 0){
                row.cells = [];
                row.cells.push(displayObject);
                row.addChild(row.cells[row.cells.length -1]);
                let cell = row.cells[row.cells.length -1];
                cell.position.set(this.cellStartPosition.x,this.cellStartPosition.y);
            }
            else if(cellNumber > row.cells.length){
                row.cells.push(displayObject);
                row.addChild(row.cells[row.cells.length -1]);
            }
            else{
                row.cells.splice(cellNumber, 0, displayObject);
                row.addChildAt(displayObject, cellNumber);
            }
        

        this.updateRows();
    }

    /**
     * Deletes a row from the table by row ID. Redraws the entire object by creating a new one.
     * @param {*} rowNumber The row number to delete.
     */
    deleteRow(rowNumber){
        this.debugLog("delete row", {rowNumber:rowNumber});
        if(rowNumber > -1 && rowNumber < this.rowCount){
            this.rows[rowNumber].destroy(true);
            this.rowCount--;
            this.rows.splice(rowNumber, 1);
        }
        else{
            throw "Unable to delete row " + rowNumber + ". Row does not exist.";
        }
        this.updateRows();
    }

    /**
     * Adds a cell to the row that's passed in. Default is the last row created.
     * @param {*} displayObject The display object that should be written to the row.
     * @param {int} rowNumber The row number that the cell should be inserted into.
     */
    addCell(displayObject, rowNumber = this.rowCount - 1){
        this.debugLog("add cell");
        if(this.rowCount === 0){
            throw "Can't add cell when there are no rows!";
        }
        else{
            let row = this.rows[rowNumber];
            if(typeof row.cells == 'undefined'){
                row.cells = [];
            }
            //first, get the display object in the array
            row.cells.push(displayObject);
            let cell = row.cells[row.cells.length -1];
            //check to see how long the array is. If it's length of 1, default to (5,5). if not, calculate.
            if(row.cells.length > 1){
                cell.position.set(
                    row.cells[row.cells.length -2].x + row.cells[row.cells.length -2].width + this.columnBuffer, //default to 10 over for a 5 px spacing between cells
                    this.cellStartPosition.y //default to 5 pixels from the top
                )
            }
            else{
                cell.position.set(this.cellStartPosition.x,this.cellStartPosition.y);
            }
            row.addChild(cell);
            if(row.cells.length > this.maxCols){
                this.maxCols = row.cells.length;
            }
        }

        this.updateRows();
    }

    /**
     * Deletes a specified cell
     * @param {*} rowNumber The row number
     * @param {*} cellNumber The cell number
     */
    deleteCell(rowNumber, cellNumber){
        this.debugLog("delete cell", {rowNumber:rowNumber, cellNumber:cellNumber});
        if(rowNumber > -1 && rowNumber < this.rowCount){
            if(cellNumber < this.rows[rowNumber].cells.length && cellNumber > -1){
                this.rows[rowNumber].cells[cellNumber].destroy(true);
                this.rows[rowNumber].cells.splice(cellNumber,1);
            }
        }
        else{
            throw "Unable to delete cell (" + rowNumber +", " + cellNumber + "). Row does not exist.";
        }
        this.updateRows();
    }

    /**
     * Gets a cell given a row and cell number. Returns -1 if the cell/row does not exist.
     * @param {*} rowNumber The row number
     * @param {*} cellNumber The cell number on the row
     */
    getCell(rowNumber, cellNumber){
        this.debugLog("get cell", {rowNumber:rowNumber, cellNumber:cellNumber});
        try{
            return this.rows[rowNumber].cells[cellNumber];
        }
        catch{
            return false;
        }
    }

    update(){
        this.updateRows();
    }

    /**
     * INTERNAL USE: Used to separate out all the display objects into auto-sizing areas on the x-axis.
     */
    updateRows(){
        this.debugLog("update rows");

        //first thing's first; get the title, if any, and update it
        this.title.pivot.x = this.title.width / 2;
        this.title.position.x = this.width / 2;

        //we know the maximum amount of columns. We just have to parse through all of them.
        let currentColumn = 0;
        let maxColWidth = 0;
        let columnSeparation = [this.cellStartPosition.x];
        let _inst = this;
        let rowSeparation = [this.rowStartPosition.y + this.title.height];
        
        //first thing to do is find out what the highest cell is for each row, and get its height.
        //add that to the previous entry, and you're good to go.
        this.rows.forEach(function(row, index){
            rowSeparation.push(0);
            if(typeof row.cells != 'undefined'){
                row.cells.forEach(function(cell){
                     if(cell.height + _inst.rowBuffer + rowSeparation[index] > rowSeparation[index + 1]){
                        rowSeparation[index + 1] = cell.height + _inst.rowBuffer + rowSeparation[index];
                     }
                });
            }
            else{
                rowSeparation[index + 1] = rowSeparation[index] + _inst.rowBuffer;
            }
        })
        
        
        while(currentColumn < this.maxCols){
            this.rows.forEach(function(row, index){
                if(_inst.getCell(index, currentColumn)){
                    let cell = _inst.getCell(index, currentColumn);
                    //if you're here, check the width of the current cell
                    if(cell.width > maxColWidth) maxColWidth = cell.width;
                }
            });

            if(columnSeparation.length > 0){
                columnSeparation.push(columnSeparation[columnSeparation.length -1] + maxColWidth + _inst.columnBuffer);
            }
            else{
                columnSeparation.push(maxColWidth + _inst.columnBuffer);
            }
            

            currentColumn++;
            maxColWidth = 0;
        }

        currentColumn = 0;
        //after figuring out the column width of each column, then you can space things out as needed.
        while(currentColumn < this.maxCols){
            this.rows.forEach(function(row, index){
                if(_inst.getCell(index, currentColumn)){
                    let cell = _inst.getCell(index, currentColumn);
                    //if you're here, check the width of the current cell
                    cell.position.x = columnSeparation[currentColumn];
                }
                row.position.y = rowSeparation[index];
            });
            currentColumn++;
        }
        
    }

    /**
     * Reduces the amound of space between cells.
     * @param {*} amount The amount of space to reduce by.
     */
    clampCells(amount = 2){
        this.columnBuffer -= amount;
        this.updateRows();
    }

    /**
     * Reduces the amount of space between rows.
     * @param {*} amount The amount of space to reduce by.
     */
    clampRows(amount = 2){
        this.rowBuffer -= amount;
        this.updateRows;
    }

    /**
     * Internal use. Can help trace where the function goes wrong.
     * @param {string} method The method invoked.
     * @param {object} value A value object with properties displayed per method.
     */
    debugLog(method, value){
        if(this.debugMode){
            switch(method){
                case "update rows":
                    console.log("Updating rows...");
                    break;
                case "get cell":
                    console.log("Getting the cell (" + value.rowNumber + ", " + value.cellNumber+")");
                    break;
                case "delete cell":
                    console.log("Deleting cell (" + value.rowNumber + ", " + value.cellNumber+")");
                    break;
                case "add cell":
                    console.log("Adding cell to farthest row...");
                    break;
                case "delete row":
                    console.log("Deleting row " + value.rowNumber);
                    break;
                case "add cell at":
                    console.log("Adding cell at ("+ value.rowNumber + ", " + value.cellNumber+")");
                    break;
                case "add row at":
                    console.log("Adding row at " + value.rowNumber);
                    break;
                case "add row":
                    console.log("Adding row to end of stack");
                    break;
                default:
                    console.log("New method detected. Nothing to show here.");
            }
        }
    }
}