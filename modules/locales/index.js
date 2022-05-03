import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname( fileURLToPath(import.meta.url) );

import BaseBuilder from '@global/base-builder'
import FileSystem from 'fs';
import { VM } from 'vm2';
import Util from '@global/util';


function isTranslateFile(path){
  const INDICATOR = /.+?\.ini$/;
  return INDICATOR.test( path );
}

function disassemblePath(path){
  const baseLength = LocalesStructure.FOLDER.split("/").length;
  path = path.split("/").slice(baseLength);
  path[path.length - 1] = path.at(-1).replace(".ini", "");
  return path;
}




class LocalesStructure {

  constructor(){
    this.categories = {};
    this.filesPaths = this.#searchFiles()
      .filter(isTranslateFile);

    this.#setLocales();
  }

  #searchFiles(){
    const basePath = this.constructor.FOLDER;

    const files = [];
    const queue = [basePath];

    const readDirectory = (path) => {
      const directoryFiles = FileSystem.readdirSync(`${ __dirname }/${ path }`)
        .map(name => `${ path }/${ name }`);

      for (const file of directoryFiles){
        const receiver = FileSystem.lstatSync(`${ __dirname }/${ file }`).isDirectory()
          ? queue : files;

        receiver.push(file);
      }
    }

    while (queue.length)
      readDirectory( queue.shift() );

    return files;
  }

  #setLocales(){
    const structure = {};

    const locales = this.filesPaths.map(path => new LocaleContent(path));
    locales.forEach(({path, lines}) => {
      path = disassemblePath(path);

      let currentPosition = structure;
      for (const property of path)
        currentPosition = currentPosition[ property ] ||= {};

      for (const line of lines)
        currentPosition[ line.key ] = { type: line.type, value: line.value };

    });

    this.locales = structure;
  }

  build(){
    return new LocaleBuilder(this.locales).build();
  }


  static FOLDER = "./languages";
}





class LocaleContent {
  constructor(path){
    this.path = path;
    this.plainText = this.#readFile();

    this.lines = this.#parse(this.plainText);
  }


  #readFile(){
    return FileSystem.readFileSync(`${ __dirname }/${ this.path }`, "utf-8");
  }


  #parse(plainText){
    const commentRegex = /(?:^|\n)\/\/.+/g;
    plainText = plainText.replaceAll(commentRegex, "");

    const lineRegex = this.constructor.getLineRegex();
    const matched = [...plainText.matchAll(lineRegex)];

    const lines = matched.map(([full, key, separator, value]) => {
      const line = {};
      line.key   = key;
      line.value = value;
      line.type  = separator.length - 1; // variants =, =*, =**
      return line;
    });

    return lines;
  }


  static getLineRegex(){
    const separator = "=\\*?\\*?";
    const key       = "[a-zA-Z_$]+";
    const content   = "(?:.|\\n)+?";
    const end       = `(?=(?:\\s|\\n)*(?:${ key }\\s*${ separator }|$))`;

    const plain = `(?:\\n|\\s)*(${ key })\\s*(${ separator })\\s*\\n?(${ content })${ end }`;
    return new RegExp(plain, "g");
  }
}





class LocaleBuilder extends BaseBuilder {
  constructor(structure){
    super();
    this.structure = structure;
    this.locale = this.constructor.defaultLocale;
  }

  lineResolver(way, selectLocale){
    if (!(way instanceof Array))
      throw new TypeError("Way must be Array");

    let current = this.structure;
    for (const point of way)
      current = current?.[ point ];

    if (current === undefined)
      return selectLocale !== this.constructor.defaultLocale ?
        this.lineResolver(way, null) :
        undefined;

    if (!this.constructor.isEnd(current))
      throw new Error("incomplete way");

    return this.#resolveLine.bind(this, current);
  }

  build(){
    const startPoint = this.structure[ this.constructor.defaultLocale ];
    const params = {
      builder: this,
      point: startPoint,
      isEnd: this.constructor.isEnd,
      way: []
    }
    const proxied = super.build(params);
    return proxied;
  }

  setLocale(locale){
    if (typeof locale !== "string")
      throw new TypeError("expected locale name");

    if (!(locale in this.structure)){
      const expectedLocales = Object.keys(this.structure);
      throw new Error(`Cannot find ${ locale } of [${ expectedLocales.join(", ") }]`);
    }


    this.locale = locale;
  }


  // line: {type: <0-2>, value: <string>}
  #resolveLine(line, ...args){
    switch (line.type) {
      case 1:
        line.value = line.value.replaceAll(/(?<!\\)\{\{.+?\}\}/g, () => args.shift());
        break;

      case 2:
        const vm = new VM({ sandbox: {Util, args} });
        line.value = vm.run(`\`${ line.value }\``);
        break;
    }
    return line.value;
  }

  static BUILDER_STATES = {
    END: 0,
    _DEFAULT: 1
  };


  static BUILDER_METHODS = [
    {
      type: "get",
      callback: function(target, name){
          const {point} = this.data;

          if (name in point){
            this.data.way.push(name);
            this.data.point = point[ name ];
            return;
          }

          return this.complete(undefined);
      }
    },
    {
      type: "get",
      callback: function(target, name){
          const {point, isEnd} = this.data;
          if ( isEnd(point) ){
            this.stateAPI.set( LocaleBuilder.BUILDER_STATES.END );
          }
      }
    },
    {
      type: "apply",
      state: this.BUILDER_STATES.END,
      callback: function(target, thisContext, ...args){
          const {builder, point} = this.data;
          const way = [builder.locale, ...this.data.way];

          const resolver = builder.lineResolver(way, builder.locale);
          const value = resolver(point, ...args);
          this.complete(value);
      }
    },
    {
      type: "apply",
      state: this.BUILDER_STATES._DEFAULT,
      callback: function(target, thisContext, locale){
          this.data.builder.setLocale(locale);
      }
    }
  ];



  static isEnd = (obj) => "value" in obj && "type" in obj;
  static defaultLocale = "ru";
}




export default LocalesStructure;


const structure = new LocalesStructure();
