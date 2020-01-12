# pixi-table
A framework for creating tables in Pixi JS

## WHAT IS THIS FOR?
Pixi.Table (invoked by `new Table();`) is a class that you can include in your Pixi projects for displaying a table of any size. This aims to have basic functionality similar to tables in HTML5. This is not terribly efficient, hwoever; large tables may take a very long time to update.

## HOW DO I USE THIS?

Download the latest version from the releases section, and include on your page via a script tag. For example:

```html
<script src="./libs/Pixi.Table.js"></script>
```

Make sure you load this AFTER pixi.js or pixi.min.js.

## CAN I SEE WHAT IT DOES?

Yes! Clone the repo, and run the following commands:

```bash
npm install
node app.js
```

Navigate to [your localhost, port 5000](http://localhost:5000) to check out the small demo I've created to show functionality. You can press c,r,n,a or d to manipluate the table using the build-in functions.

## HOW DO I CHANGE DATA IN A CELL?

When you want to point to a specific cell:
`table.rows[rowNumber].cells[cellNumber]`
OR
`table.getCell(rowNumber,cellNumber)`

While the two lines may seem identical, _`table.getCell()` handles out of range errors be returning `false`, so you can wrap commands like this:_

```javascript
let cell;
if(cell = table.getCell(0,1)){
  //do something
}
```

## COMMAND RUNDOWN

| Command  | Description |
| ------------- | ------------- |
|`let table = new Table();`  | Creates a new Table class. One row exists at creation, but no cells.  |
| `table.addRow();`  | Adds a blank row to the end of the table  |
| `table.addRowAt(rowNumber);`  | Adds a blank row to the location specified. Shifts all rows _down_ from that point.  |
| `table.addCell(displayObject, rowNumber);`  | Adds a displayObject as a cell in the table to the _end_ of the row specified. Note that the default for the rowNumber is the last row created. |
| `table.addCellAt(displayObject, rowNumber, cellNumber);`  | Adds a cell to the specified location. If the row is blank, the first cell will be populated.  |
| `table.deleteRow(rowNumber);`  | Deletes an entire row from the table. Note: this calls the `DisplayObject.destroy(true)` function. _All data in this section WILL be lost, and any references to the objects will cause errors!_  |
| `table.deleteCell(rowNumber, cellNumber);`  | Deletes the specified cell. Note: this calls the `DisplayObject.destroy(true)` function. _All data in this cell WILL be lost, and any references to the cell will cause errors!_  |
| `table.getCell(rowNumber, cellNumber);`  | Gets the specified cell; returns false if the cell does not exist.  |
| `table.updateRows();`  | Called automatically when any changes to the table are made, but NOT when data in the cells change. Call this to cascade through the table so automatic spacing is preserved.  |
| `table.debugLog(method, value);`  | Internal use. To turn on debugging information, pass in an options object to the class on creation (`{debugLog:true}`)  |

## LIMITATIONS:
- The default is a 5px padding from the edge of whatever container you attach this to. This cannot be overwritten as of yet.
- Support for multiple objects in a single cell is limited. The solution is to package everything in a pre-laid-out format via attaching everything to a container.
- There are no gridlines at the moment. _I don't plan to include them unless it is specifically requested._ You can submit a pull request to have them included if you wish.
- The table size is automatic; _there is no way to clamp table sizes._
- If data changes inside of a cell, the table will not update its sizing. _Use `table.updateRows()` to address this._
- There is no way to specify rows/columns at creation. _This may change in a later update_
