class QueryManager {
  createProxy(queries){
    Object.entries(queries)
    const queryProxy = new Proxy(, {get: this.constructor.proxyGetter});
  }

  static proxyGetter(target, prop){
    if (!(prop in target))
      return undefined;

    return this;
  }
}

export default QueryManager;
