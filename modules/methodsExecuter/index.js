/***
  @useExample
  new MethodsExecuter().execute("command_help_MainButton", ...args);
  it's apply globalThis.commands.get("help").onMainButton.apply(<this>, args);
*/

class MethodsExecuter {
  execute(expression, ...args){
    const  [type, identify, method, ...rest] = expression.split( this.constructor.SEPARATOR );
    if (rest.length > 0)
      console.warn( new TypeError("A string of 3 arguments is expected. Rest parameters ignored") );

    const component = this.constructor.supportedComponents[type];
    const list = typeof component.list === "function" ?
      component.list(this) : component.list;

    const target = component.getTarget(list, identify);
    return this.#executer(target, method, ...args);
  }

  #executer(target, method, ...args){
    method = `on${ method }`;
    if (!( method in target))
      throw new Error(`${ target.constructor.name }, ${ method } is undefined`);

    return target[ method ].apply(target, args);
  }


  static supportedComponents = {
    "command": {
      list: () => globalThis.commands,
      getTarget: (list, identify) => list.get(identify)
    },
    "event": {
      list: () => globalThis.eventsList,
      getTarget: (list, identify) => list.get(identify)
    },
    // "site": {
    //   list: globalThis.site.botAPI,
    //   getTarget: (list, identify) => null // in developing
    // }
  };

  static SEPARATOR = "_";
}

export default MethodsExecuter;
