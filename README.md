# pixi-table
A framework for creating tables in Pixi JS

## WHAT IS THIS FOR?
Pixi.Table is a class that you can include in your Pixi projects for displaying a table of any size. This aims to have basic functionality similar to tables in HTML5. This is not terribly efficient, hwoever; large tables may take a very long time to update.

## HOW DO I INCLUDE THIS?

Download the latest version from the releases section, and include on your page via a script tag. For example:

```
<script src="./libs/Pixi.Table.js"></script>
```

## CAN I SEE WHAT IT DOES?

Yes! Clone the repo, and run the following commands:

```
$ npm install
$ node app.js
```

Navigate to [your localhost, port 5000](http://localhost:5000) to check out the small demo I've created to show functionality.

## BASIC USAGE

- Create a new class using
```
let table = new Table();
```

- Start adding cells immediately using the following:
```
table.addCell(<PIXI.DisplayObject here>);
```
- To add a new row, do the following:
```
table.addRow();
```
- To delete a row:
```
table.deleteRow(rowNumber);
```
- To address a cell directly:
```
table.rows[rowNumber].cells[cellNumber]
```
