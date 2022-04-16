class BaseEvent {
  constructor(target, eventName, {once = false} = {}){
    let handlerType = once ? "once" : "on";
    target[handlerType](eventName, this.beforeRun.bind(this));
  }

  beforeRun(...args){

    if (this.checkCondition?.(...args) === false)
      return;

    this.run(...args);
  }
}

export default BaseEvent;
