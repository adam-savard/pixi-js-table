/**
 * Creates a new table that can have any PIXI.DisplayObject attached to it. The way to address updates is to use rows and cells.
 * You are given a starting row when the class is initialized.
 * The only argument passed is an options object.
 */
class Table extends PIXI.Container{
    /**
     * Ivoke to get a new Table.
     * @param {*} options Contains single option for now, drawGridLines.
     */
    constructor(options = {
        drawGridLines: false
    }){
        super();
        //options
        this.drawGridLines = options.drawGridLines;

        //display objects
        this.rows = [new PIXI.Container()];
        this.rows[0].position.set(5,5);
        this.rowCount = this.rows.length;
        this.maxCols = 0;
        this.addChild(this.rows[0]);
    }

    /**
     * Adds a blank row to the table.
     */
    addRow(){
        this.rows.push(new PIXI.Container());
        this.rowCount++;
        let row = this.rows[this.rows.length -1];
        
        if(this.rowCount > 1){
            row.position.set(
                5,
                this.rows[this.rows.length -2].y + this.rows[this.rows.length -2].height
            )
        }
        else{
            row.position.set(5,5);
        }

        this.addChild(row);
    }

    /**
     * Deletes a row from the table by row ID. Redraws the entire object by creating a new one.
     * @param {*} rowNumber The row number to delete.
     */
    deleteRow(rowNumber){

        if(rowNumber > -1 && rowNumber < this.rowCount){
            this.rows[rowNumber].destroy(true);
            this.rowCount--;
        }
        else{
            throw "Unable to delete row " + rowNumber + ". Row does not exist.";
        }
    }

    /**
     * Adds a cell to the row that's passed in. Default is the last row created.
     * @param {*} displayObject The display object that should be written to the row.
     * @param {int} rowNumber The row number that the cell should be inserted into.
     */
    addCell(displayObject, rowNumber = this.rowCount - 1){
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
                    row.cells[row.cells.length -2].x + row.cells[row.cells.length -2].width + 10, //default to 10 over for a 5 px spacing between cells
                    5 //default to 5 pixels from the top
                )
            }
            else{
                cell.position.set(5,5);
            }
            row.addChild(cell);
            if(row.cells.length > this.maxCols){
                this.maxCols = row.cells.length;
            }
        }

        this.updateRows();
    }

    /**
     * Gets a cell given a row and cell number. Returns -1 if the cell/row does not exist.
     * @param {*} rowNumber The row number
     * @param {*} cellNumber The cell number on the row
     */
    getCell(rowNumber, cellNumber){
        try{
            return this.rows[rowNumber].cells[cellNumber];
        }
        catch{
            return false;
        }
    }

    /**
     * INTERNAL USE: Used to separate out all the display objects into auto-sizing areas on the x-axis.
     */
    updateRows(){
        //we know the maximum amount of columns. We just have to parse through all of them.
        let currentColumn = 0;
        let maxColWidth = 0;
        let columnSeparation = [0];
        let _inst = this;
        
        while(currentColumn < this.maxCols){
            this.rows.forEach(function(row, index){
                if(_inst.getCell(index, currentColumn)){
                    let cell = _inst.getCell(index, currentColumn);
                    //if you're here, check the width of the current cell
                    if(cell.width > maxColWidth) maxColWidth = cell.width;
                }
            });
            if(columnSeparation.length > 0){
                columnSeparation.push(columnSeparation[columnSeparation.length -1] + maxColWidth + 10);
            }
            else{
                columnSeparation.push(maxColWidth + 10);
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
            });
            currentColumn++;
        }

        console.log(columnSeparation);
    }
}