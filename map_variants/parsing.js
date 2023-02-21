const fs = require("fs")
const path = require("path")
const bs = require('./bitstream.js')
const { mapVariant } = require('./map_variant_mvar.js')

const axios = require('axios');
require('dotenv').config()
const apikey = process.env.APIKEY

let base = "./"
const out = {}
//const out = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'ledger.json')));
const xuids = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'xuids.json')));
let extensions = ['mvar','mvar.mvar']
let names = []
let map;
const map_ids = {
    730: 'Sandbox',
    480: 'Foundry',
    706: 'Waterfall',
    31: 'Icebox',
    380: 'Narrows',
    300: 'Construct',
    390: 'The Pit',
    310: 'High Ground',
    320: 'Guardian',
    330: 'Isolation',
    340: 'Valhalla',
    350: 'Epitaph',
    30: 'Last Resort',
    580: 'Rats Nest',
    410: 'Standoff',
    600: 'Cold Storage',
    490: 'Assembly',
    440: 'Longshore',
    740: 'Citadel',
    590: 'Ghost Town',
    520: 'Blackout',
    720: 'Heretic',
    470: 'Avalanche',
    500: 'Orbital',
    703: 'Edge'
 }
 

getAllFiles(base).then(
    function(value) {
        console.log('Beat the Loop')
        //fs.writeFileSync('ledger.json', JSON.stringify(out, undefined, 2));
        //fs.writeFileSync('xuids.json', JSON.stringify(xuids, undefined, 2));
    },
    function(error) {console.log(error)}
);

async function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
      
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
          let ext = file.slice(file.indexOf(".")+1,file.length)
          if(extensions.includes(ext)){
              let file_buffer = fs.readFileSync(dirPath + "/" + file);
              let type = readType(file_buffer)
              if(type == 'athr'){
                    let arrayBuffer = toArrayBuffer(file_buffer)
                    newMvar(arrayBuffer,file).then(console.log('added'));
  
              } else if(type == 'chdr'){
                    oldMvar(file_buffer, file).then(console.log('added'));
              }
              let mname = file.slice(file.indexOf('-')+1,file.indexOf('.mvar'))
              //console.log(file)
              rename(file, mname)
          }
      }
    });
    return arrayOfFiles
}


async function newMvar(b,file){
    let mname = file.slice(file.indexOf('-')+1,file.length)
    let a = file.slice(0, file.indexOf('-')-1)
    let stream = new bs.Bitstream(b)
    let mvar = toObject(new mapVariant(stream))
    map = mvar.map_id
    let entry = {
        "map": mvar.map_id,
        "file": file,
        "name": mvar.title,
        "xuid": mvar.xuid,
        "description": mvar.description,
        "difficulty":0,
        "tags":[],
        "author":a
    }
    addToList(entry)
}

async function oldMvar(b, file){
    let mname = file.slice(file.indexOf('-')+1,file.length)
    let a = file.slice(0, file.indexOf('-')-1)
    let map_title = b.slice(73,104)
    let description = b.slice(104,b.indexOf("0000", 0, "hex")).toString().replace(/\u0000/gi, '')
    let map_id = map_ids[b.readInt32BE(288)]
    let xuid = b.readBigInt64BE(256).toString()
    let i = map_title.indexOf("0000", 0, "hex")
    map_title = map_title.slice(0,i).toString().replace(/[^a-z0-9 ]/gi, '')
    let entry = {
        "map": map_id,
        "file": file,
        "name": map_title,
        "xuid": xuid,
        "description": description,
        "difficulty":0,
        "tags":[],
        "author":a
    }

    addToList(entry)
}

function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}


function addToList(data){
    let map = data.map
    delete data.xuid
    delete data.map
    if(out[map] == undefined){
        out[map] = []
    }
    out[map].push(data)
    fs.writeFileSync('new.json', JSON.stringify(out, undefined, 2));
    //fs.writeFileSync('xuids.json', JSON.stringify(xuids, undefined, 2));
}

function readType(buf){
    let type = buf.slice(48,52).toString()
    return type
}

function rename(file, newName){
    fs.rename(file, `./${map}/${newName}.mvar`, () => {
        //console.log("\nFile Renamed!\n");
    });
}

function toObject(json) {
    return JSON.parse(JSON.stringify(json, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value // return everything else unchanged
    ));
}

