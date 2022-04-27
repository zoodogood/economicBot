import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname( fileURLToPath(import.meta.url) );

import FileSystem from 'fs';
import { VM } from 'vm2';


class LocalesStructure {

  constructor(){
    this.categories = {};
    this.filesPaths = this.#searchFiles();
    //this.#parse();
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

  builder(userLocale){
    const getCategory = (_, prop) => {
      if (!(prop in this.categories))
        return undefined;

      const properties = this.categories[ prop ];
      return new Proxy(properties, {get: getContent});
    }

    const getContent = (locales, prop) => {

      const locale = locales[userLocale] && (prop in locales[userLocale]) ?
        userLocale :
        this.constructor.defaultLocale;



      const line = locales[locale][prop];

      if (line === undefined)
        return undefined;

      return this.#handleLine(line);
    }
    return new Proxy({}, {get: getCategory});
  }


  #parse(){
    const locales = FileSystem.readdirSync(this.constructor.PATH)
      .filter(name => /.+?\.ini$/.test(name));

    for (const name of locales)
      this.#parseFile(name);
  }

  #parseFile(fileName){
    const category = /\[.+?\]/;

    const path = `${ this.constructor.PATH }/${fileName}`;
    const plainCategories = FileSystem.readFileSync(path, "utf-8")
      .split(
        new RegExp(`(?=${ category }|(?:\s*$))`, "g")
      )
      .filter(plain => category.test(plain));

    plainCategories.forEach(plain => {
      const categoryName = plain.match(category).at(0)
        .slice(1, -1)
        .trim();

      const lines = plain.match(/[a-zA-Z].*?=(?:.+)/g);
      if (lines === null)
        return;

      this.categories[categoryName] ||= {};

      const localeName = fileName.split(".").at(0);


      const entries = Object.fromEntries( lines.map(this.#parseLine) );
      this.categories[categoryName][localeName] = entries;
    });
  }

  #parseLine(line){
    const [key, ...value] = line.split("=");
    return [key, value.join("=")];
  }



  #handleLine(line){

  }

  static defaultLocale = "ru-ru";

  static FOLDER = "./languages";
}

class LocaleContent {
  constructor(path){

  }
}

export default LocalesStructure;
