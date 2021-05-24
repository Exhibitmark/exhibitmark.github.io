const fs = require('fs');
const XLSX = require('xlsx');

let creators = {}
// Parse a file
var workbook = XLSX.readFile('m.xlsx');

var first_sheet_name = workbook.SheetNames[6];
let game = first_sheet_name.toLowerCase().replace(' ','_')

/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];
let current;

Object.keys(worksheet).forEach((e, i) => {
    if(e.startsWith('A') && i > 1){
        if(worksheet[e].v){
            current = worksheet[e].v
            creators[worksheet[e].v] =  []
        }
        
        let index = e.replace('A','')
        let start = 'A'
        for(var j = 0; j < 1;){
            start = nextChar(start);
            let x = start+index
            if(worksheet[x] && worksheet[x].v && worksheet[x].l){
                let f = {}
                f.title = worksheet[x].v
                f.link = worksheet[x].l.Target
                let u = f.link.replace('https://youtu.be/','')
                f.thumbnail = `https://i.ytimg.com/vi/${u}/hqdefault.jpg`
                creators[current].push(f)
            } else {
                j = 1
            }   
        }
    }
});
writeFile(creators,game)


function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function writeFile(o,name){
    console.log(o)
    fs.writeFile(name+'.json', JSON.stringify(o),'utf8',function(err) {
        
    });
}