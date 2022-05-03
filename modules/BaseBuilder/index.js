/**
@useExample
SimpleBuilder extends BaseBuilder
You must set BUILDER_METHODS in enclosing class!

const proxied = new SimpleBuilder().build(data);
*/

class BuilderContext {
  constructor(...args){
    this.data = {};
    this.data.args = args;

    this.state = 0;
  }

  get stateAPI(){
    const api = {
      set:    (state) => this.state = state,
      add:    (state) => this.state |= state,
      remove: (state) => this.state ^= state,
      has:    (state) => (this.state & state) === state
    }
    return api;
  }

  complete(value){
    this.complete = value;
  }
}



class BaseBuilder {
  build(...args){
    const context = new BuilderContext(...args);
    return this.#proxy(context);
  }


  #proxy(context){
    const boop = () => {};
    const traps = Object.fromEntries(
      this.constructor.#TRAPS
      .map(this.#proxyHandler.bind(this, context))
    );

    const proxy = new Proxy(boop, traps);
    return proxy;
  }

  #proxyHandler(context, key){
    const methods = [ ...this.constructor.BUILDER_METHODS ]
      .filter(({type}) => type === key);

    const callback = (...args) => {
      methods.filter(method => context.stateAPI.has(method.state));
      methods.forEach(method => method.callback.apply(context, args));
      return context.complete ?? this.#proxy();
    };
    return [key, callback];
  }


  // { type: "get", callback: <proxyTrap>, state?: <bit> }
  static BUILDER_METHODS = [];

  // { <key>: <bit> }
  // @example {USER: 1, MODERATOR: 2, ADMIN: 4, OWNER: 7}
  static BUILDER_STATES = {};

  static #TRAPS = ["get", "set", "has", "apply", "construct", "deleteProperty", "defineProperty", "ownKeys", "getOwnPropertyDescriptor", "preventExtensions"];

  static BuilderContext = BuilderContext;
}






export default BaseBuilder;
