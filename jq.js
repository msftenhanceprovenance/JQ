var extend = function(from, to) {
  for (var p in from) {
    to[p] = from[p];
  }
};

exports.JQ = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  var jq = function(prop, value) {
    var jsons = [];
    var paths = [];
    filter(json, jsons, [], paths, prop, value);
    return new JQ(json, jsons, paths);
  };

  jq._baseObject = json;
  jq._jsons = [json];
  jq._paths = [];

  extend(JQ.prototype, jq);
  return jq;
};

var filter = function(json, result, path, paths, prop, value) {
  if (typeof json === 'number') return;
  if (typeof json === 'string') return;
  if (typeof json === 'boolean') return;
  if (json === null) return;

  if (Array.isArray(json)) {
    for (var i = 0, l = json.length; i < l; i++) {
      path.push(i);
      filter(json[i], result, path, paths, prop, value);
      path.pop();
    }
    return;
  }

  if (typeof json === 'object') {
    for (var p in json) {
      if (p === prop && (value === undefined || json[p] === value)) {
        var _path = path.slice();
        _path.push(p);
        paths.push(_path);
        result.push(json);
      }
      path.push(p);
      filter(json[p], result, path, paths, prop, value);
      path.pop();
    }
  }
};

var JQ = function(json, jsons, paths) {
  this._baseObject = json;
  this._jsons = jsons;
  this._paths = paths;
};

JQ.prototype.hello = function() {
  if (console) {
    if (console.log) {
      console.log("hello! I'm a JQ library!");
      return;
    }
  }
  if (alert) {
    alert("hello! I'm a JQ library!");
  }
};
  
JQ.prototype.isJQ = function() {
  return true;
};

JQ.prototype.baseObject = function() {
  return this._baseObject;
};

JQ.prototype.size = function() {
  return this._jsons.length;
};

JQ.prototype.get = function(index) {
  if (index === null || index === undefined) {
    return this._jsons;
  }
  return this._jsons[index];
};

JQ.prototype.eq = function(index) {
  var baseObject = this.baseObject();
  var jsons = [];
  if (this.get(index)) {
    jsons.push(this.get(index));
  }

  return new JQ(baseObject, jsons);
};

JQ.prototype.empty = function() {
  for (var i in this._jsons) {
    for (var p in this._jsons[i]) {
      if (this._jsons[i].hasOwnProperty(p)) {
        delete this._jsons[i][p];
      }
    }
  }
  return this;
};

JQ.prototype.prop = function(prop, val) {
  // get
  if (arguments.length === 1) {
    if (this._jsons.length === 0) {
      return undefined;
    }
    return this._jsons[0][prop];
  }

  // set
  for (var i = 0, l = this._jsons.length; i < l; i++) {
    this._jsons[i][prop] = val;
  }
  return this;
};

JQ.prototype.remove = function() {
  // delte all from root
  if (this._paths.length === 0) {
    for (var p in this._baseObject) {
      delete this.baseObject()[p];
    }
    return this;
  }

  for (var i = 0, len = this._paths.length; i < len; i++) {
    _remove(this.baseObject(), this._paths[i]);
  }
  return this;
};

var _remove = function (object, path) {
  var obj = object;
  var len = path.length;
  for (var i = 0, l = len; i < len -1; i++) {
    obj = obj[path[i]];
  }
  delete obj[path[path.length -1]]
};
