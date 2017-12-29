if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
      'use strict';
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {k = 0;}
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
           (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }
        k++;
      }
      return false;
    };
  }

angular
    .module('myApp', [])
    .directive('controlOnlyNumbers',
        function ($compile) {
            return {
                restrict: 'E',
                scope: {
                    id: '@',
                    model: '=',
                    ngClass: '=?',
                    required: '=?',
                    readonly: '=?',
                    float: '=?',
                    beforecoma: '@?',
                    aftercoma: '@?',
                    prefix: '@?',
                    subfix: '@?',
                    pcharacter: '@?',
                    scharacter: '@?',
                    decimal: '@?',
                    miles: '@?',
                    cssclass: '@?',
                    setdisabled: '=?',
                    zeros: '=?',
                    onBlur: "=?",
                    label: "@?",
                    groupName:"@?",
                    errorMarked: "=?",
                    buildComplete: "=?",
                    labelClass: "@?",
                    inputContentClass: "@?"
                },
                templateUrl: './controlOnlyNumbers.html',
                link: function (scope, elm, attrs) {

                    var Format = {
                        Decimal: function (value, dec) {
                            var cd = [/\,/, '.'];
                            cd = dec == ',' ? [/\./, ','] : cd;
                            value = value.toString().replace(/\./g, '');
                            return value.toString().replace(cd[0], cd[1]);
                        },
                        Integer: function (value) {
                            value = value.toString().replace(/\./g, '');
                            return parseInt(value).toString();
            
                        },
                        Miles: function (value) {
                            value = value.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                            value = value.split('').reverse().join('').replace(/^[\.]/, '');
                            return value;
                        },
            
                    };

                    var OnlyNumbers = scope.$parent.OnlyNumbers;

                    function Group(){
                        this.groupName = "";
                        this.domnodes = null;
                        this.scopes = null;
                        this.ids = null;
                    }

                    Group.prototype.Set = function(prop,value){
                        value = /false|true/.test(value)?value=='true':value;
                        this.scopes.forEach(function(element){
                            if(element.hasOwnProperty(prop)){
                                if(/model/.test(prop)){
                                    value = scope.Methods.Init(value);
                                }
                                element[prop] = value;
                                if(/miles|float/.test(prop)){
                                    element.model = element.Methods.blur.call(document.querySelector(element.id),{},element);
                                }
                                if(/zeros/.test(prop)){
                                    element.model = element.Methods.Init(element.model);
                                }
                            }else{
                                console.error("No existe la propiedad "+prop+" en alguna de las instancias")
                            }
                            
                        });   
                    }

                    Group.prototype.GetModels = function(){
                        this.scopes.forEach(function(element){
                            if(element.hasOwnProperty(prop)){
                                
                                element[prop] = value;
                            }else{
                                console.error("No existe la propiedad "+prop+" en alguna de las instancias")
                            }
                            
                        });
                    }
                    
                    if(!OnlyNumbers.prototype.hasOwnProperty('Required')){

                        OnlyNumbers.prototype.Disabled = function(value){
                            this.scope.setdisabled = value;
                            
                        }

                        OnlyNumbers.prototype.IsDisabled = function(value){
                            return !!this.scope.setdisabled;
                        }

                        OnlyNumbers.prototype.IsRequired = function(value){               
                            return !!this.scope.required;                          
                        }

                        OnlyNumbers.prototype.Required = function(value){
                                this.scope.required = value;       
                        }

                        OnlyNumbers.prototype.AddClass = function(str){
                            this.scope.cssclass += " "+str;
                        }

                        OnlyNumbers.prototype.RemoveClass = function(str){
                            this.scope.cssclass = this.scope.cssclass.replace(str,"");
                        }

                        OnlyNumbers.prototype.Format = function (type, dec) {
                            return Format[type](this.value, dec);
                        }

                        OnlyNumbers.Controls = [];
                        OnlyNumbers.Groups = {};

                        OnlyNumbers.getElementByGroup = function(gn){
                           var instance = new Group();
                           instance.groupName = gn;
                           instance.domnodes = document.querySelectorAll("[group-name='"+gn+"']");
                           instance.ids = OnlyNumbers.Groups[gn];
                           instance.scopes = (function(){
                               var m = [];
                               for(var i in OnlyNumbers.Groups[gn]){
                                   var s = OnlyNumbers.Groups[gn][i]
                                    m.push(scope.$parent.$parent[s.id].scope);

                               }
                               return m;
                           })();
                           return instance;
                        }

                    }

                    if(OnlyNumbers.Controls.indexOf(attrs.id) < 0){
                        OnlyNumbers.Controls.push(attrs.id)  
                    }else{
                        console.error("El ID:"+attrs.id+" ya esta implementado en la vista.");
                        return;
                    }

                    var _newOnlyNumbersControl = new OnlyNumbers();
                    _newOnlyNumbersControl.node = document.getElementById(attrs.id);
                    _newOnlyNumbersControl.value = scope.model;
                    _newOnlyNumbersControl._model = attrs.model;
                    _newOnlyNumbersControl._id = attrs.id;
                    _newOnlyNumbersControl.scope = scope;

                    if(scope.groupName != ""){
                        if(!OnlyNumbers.Groups.hasOwnProperty(scope.groupName))OnlyNumbers.Groups[scope.groupName] = [];
                        var n = {
                            id: attrs.id,
                            model:attrs.model
                        }
                        OnlyNumbers.Groups[scope.groupName].push(n);
                    }

                   
                    scope.$parent.$parent[attrs.id] = _newOnlyNumbersControl;

                    scope.Setting.modelName = attrs.model;
                    if (scope.Setting.disabled) elm.find("input").prop('disabled', true);
                   
                    elm.on('keydown', function (event) {
                        scope.Methods.keyUp.call(this, event);
                    })
                    elm.on('keyup', function (event) {
                        var obj = this.children[0].children[1].children[1];
                        if(obj.value) obj.value = obj.value.replace(/[^0-9,.]/g, '');
                    });
                       
                    if(scope.Setting.prefix)elm[0].children[0].children[0].innerHTML = scope.Methods.SetPrefix(scope.Setting.pcharacter);
                    if(scope.Setting.subfix)elm[0].children[0].children[3].innerHTML = scope.Methods.SetPrefix(scope.Setting.scharacter);

                    elm.find('input').on('blur', function (event) {
                        scope.Methods.blur.call(this, event);
                    });

                    elm.find('input')[0].addEventListener('paste',function(event){
                       
                        var clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
                        var data = clipboardData.getData('text/plain');
                        data = data.replace(/[^0-9,.]/g, '');
                        event.preventDefault();
                        this.value = data;
                        scope.actualizarModelo(attrs.model,attrs.id);
                       
                        
                    });

                  
                   
    
    
                },
                controller: Numbercontroller,
            };
        });

        function Numbercontroller($scope) {
            
            
            if ($scope.hasOwnProperty("$parent") && !$scope.$parent.hasOwnProperty("OnlyNumbers")) {

                    $scope.$parent.OnlyNumbers = function () {
                        this.value = "";
                        this.node = null;
                        this.selector = "";
                        this._id = "";
                        this._valid = true;
                        this._model = "";
                        this.scope = null;
                    };
            
            }

            $scope.Setting = {
                modelName: "",
                typeError: $scope.typeError
         
            };

            if(angular.isUndefined($scope.id)){
                console.error("Debe definirse un id para el control.");
            }

            $scope.model = angular.isUndefined($scope.model)?"": $scope.model;
            $scope.ngclass = angular.isUndefined($scope.ngclass)?"": $scope.ngclass;
            $scope.required = angular.isUndefined($scope.required)?false: $scope.required;
            $scope.readonly = angular.isUndefined($scope.readonly)?false: $scope.readonly;
            $scope.label = angular.isUndefined($scope.label)?"": $scope.label;
            $scope.cssclass = angular.isUndefined($scope.cssclass)?"": $scope.cssclass;
            $scope.setdisabled = angular.isUndefined($scope.setdisabled)?false: $scope.setdisabled;
            //$scope.typeError = angular.isUndefined($scope.typeError)?CONSTANTES.TYPESERRORS.DOWN : CONSTANTES.TYPESERRORS[$scope.typeError.toUpperCase()];
            $scope.onBlur = angular.isUndefined($scope.onBlur)?null: $scope.onBlur;
            $scope.buildComplete = angular.isUndefined($scope.buildComplete)?null: $scope.buildComplete;
            $scope.errorMessage = angular.isUndefined($scope.errorMessage)?"": $scope.errorMessage;
            $scope.errorMarked = angular.isUndefined($scope.errorMarked)?"": $scope.errorMarked;
            $scope.labelClass = angular.isUndefined($scope.labelClass)?"col-xs-12 col-sm-12 col-md-4 col-lg-4":$scope.labelClass;
            $scope.inputContentClass = angular.isUndefined($scope.inputContentClass)?"col-xs-12 col-sm-12 col-md-8 col-lg-8":$scope.inputContentClass;
            $scope.float = angular.isUndefined($scope.float)? true : $scope.float;
            $scope.beforecoma = !$scope.beforecoma ? 4 : parseInt($scope.beforecoma);
            $scope.aftercoma = !$scope.aftercoma ? 2 : parseInt($scope.aftercoma);
            $scope.prefix = !$scope.prefix ? false : !!$scope.prefix;
            $scope.pcharacter = !$scope.pcharacter ? "" : !!$scope.pcharacter;
            $scope.scharacter = !$scope.scharacter ? "" : !!$scope.scharacter;
            $scope.miles = angular.isUndefined($scope.miles)? true : $scope.miles == 'true';
            $scope.cssclass = !$scope.cssClass ? "" : $scope.cssClass;
            $scope.default = !$scope.default ? "" : $scope.default;
            $scope.zeros = angular.isUndefined($scope.zeros)? true : $scope.zeros == 'true';
            $scope.setdisabled = !$scope.setdisabled ? false : !!$scope.setdisabled,
            $scope.onBlur = !$scope.onBlur ? null : $scope.onBlur;
            $scope.groupName = angular.isUndefined($scope.groupName)? "" : $scope.groupName;
            
           

            var CONSTANTES = {
                regexZeros: /^0*[\,0*]*$/
            }
            
            
            
            $scope.Methods = {
                SetPrefix: function(v){
                   
                    var icon = v;
                    if(/currency/.test(v)){
                        icon = "<i class='fa fa-usd' aria-hidden='true'></i>";
                    }
                    return icon;
                },
                blur: function (event,instance) {
                    var s = instance?instance:$scope;
                    var _ = s.Methods;
                    var setting = s.Setting;
                    var m = setting.modelName.split(".");
                    var value = _.findScope($scope, m, setting, this, _, event);
                    var splitModel = function () {
                        m.length > 1 ? s.$parent[m[0]][m[1]] = "": s.$parent[m[0]] = "";
                        
                    }
                    var blurObject ={
                        original: value.value,
                        numbers: 0,
                        newValue: ""
                    } 
            
                    if (value.value != undefined && value.res && !/\<\!\>/.test(value.value.toString())) {
                        
                        value = _.EliminarCaracteresNoNumericos(value.value, value);
                        blurObject.numbers = parseFloat(value.value);
            
                        if (value.value.indexOf(',') == -1 && value.value.replace(/\,/, '').length > s.beforecoma) {
                            this.value = ""
                            s.model = "";
                            s.$apply(splitModel);
                            return;
            
                        }
            
                        if (s.float && value.value != "") {
                            _.BlurFloatValidation(value.value, value, s, _)
                           
                        } else if (value.value != "") {                    
                            value.value = parseInt(value.value).toString();
                            if (s.miles && value.value.toString().length > 3) {
                                _.PuntosMiles(value.value + ",", value, s);
                            }
            
                        }
            
                     
                    } else if (value.value == "" && !value.res) {
                        this.value = "";
                        s.$apply(splitModel);
                        return;
                    }
            
                    this.value = value.value != undefined ? value.value : "";
                
                    s.actualizarModelo(setting.modelName, s.id);
            
                    if (s.onBlur != null && typeof s.onBlur == "function") {
                        blurObject.newValue = value.value;
                        s.onBlur(blurObject, setting.modelName, s.id);
                       
                    }
                    if(instance)return value.value;
                   
                },
                keyUp: function (event, ModelCtrl) {
            
                    var _ = $scope.Methods;
                    var s = $scope;
                    var setting = $scope.Setting;
                    var value = _.findScope($scope, setting.modelName.split("."), setting, this, _, event);
                    
                    if (value.res) { 
                        
                        if(event.ctrlKey && (/67|86/.test(event.which))){
                            return true;
                        }
                        else if (event.shiftKey) {
                            _.Stop(event);
                        }
                        else if (event.which == 188 || event.which == 44) {
                            if (!value.value || value.value.indexOf(',') != -1 || !s.float) {
                                _.Stop(event);
                            }
                        } else if (value.value == '0' && !s.float && (event.which == 96 || event.which == 48)) {
                            _.Stop(event);
                        } else if (event.which == 64 || event.which == 16) {
                            _.Stop(event);
                        } else if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {    
                            if (s.float) {
                                if (value.value) _.KeyFloatValidation(s, value.value, value, event, this, _);
                            } else if (!s.float) {
                                if (value.value) _.KeyIntergerValidation(s, value.value, value, event, this, _);
                            }
                        } else if ([8, 13, 27, 37, 38, 39, 40, 46, 9].indexOf(event.which) > -1) {
                          
                            return true;
                        } else {
                            _.Stop(event);
                        }
                    } else if (!value.res && !s.zeros && /96|48/.test(event.which.toString())) {
                       
                        var cursor = this.children[0].children[1].children[1].selectionStart;
                        var end = this.children[0].children[1].children[1].selectionEnd;
                        var coma = value.value.indexOf(',');
                        var v = this.children[0].children[1].children[1].value;
                        var _break = v.indexOf(',') != -1 ? v.split(',') : [v, ""];
                        if (coma != -1 && cursor > coma) {
                            if (_break[1].length > s.aftercoma - 1 && cursor == end) {                     
                                _.Stop(event);
                            }
                        } else {
                            if (s.miles && _break[0] != '') _break[0] = _break[0].replace(/\./g, '');
                            if ((_break[0].length > s.beforecoma - 1 && coma) && cursor == end) {
                                _.Stop(event);
                            }                 
            
                        }
                     
                        
                    } else if ((value.value == "" && !value.res) || (value.value == "0," && (event.which == 188 || event.which == 44)) || (!value.res && /96|48/.test(event.which.toString()))) {
                        _.Stop(event);
                    }
                   
                },
                findScope: function (s, value, setting, element, _, e) {
                    var obj = {
                        res: true,
                        model: {},
                        value: ""
                    };
                    if (s.hasOwnProperty(value[0])) {
                        obj.model = s[value[0]];
                    } else if (s.$parent.hasOwnProperty(value[0])) {
                        obj.model = typeof s.$parent[value[0]] == 'object' ? s.$parent[value[0]] : s.$parent;
                    } else {
                        obj.res = false;
                    }
                    
                    var modelExist =  obj.model[!value[1] ? value[0] : value[1]];
                    var mayorCero = parseFloat(modelExist.replace(/\,/,'.'));

                    obj.value = modelExist && mayorCero > 0 ? modelExist.toString() : _.InputValueZeroUndefined(s, modelExist, _, e, obj);
                    if ((obj.value == "" && e == undefined) || (isNaN(obj.value.replace(/\./g,'').replace(/\,/,'.')) && e.type == "blur")) {
                        obj.res = false;
                        obj.value = "";
                    } 
                    return obj
                },
                InputValueZeroUndefined: function (setting, value, _, e, obj) {
                    value = value == undefined ? 'undefined' : value.toString().trim();
                    if (CONSTANTES.regexZeros.test(value) || value == 'undefined') {
                        if (!setting.zeros) {
                          
                            value = e.type == "keydown" ? value : "";
                            obj.res = false;
                            
                        }
                        if (value == 'undefined') {
                            value = setting.default != '' ? setting.default != '' : "";
                        }
                    }
                    return value;
            
                },
                Stop: function (e) {
                    e.preventDefault();
                    return false;
                },
                KeyFloatValidation: function (setting, text, obj, e, _this, _) {
                    var cursor = _this.children[0].children[1].children[1].selectionStart;
                    var end = _this.children[0].children[1].children[1].selectionEnd;
                    var coma = text.indexOf(',');
                    var _break = text.indexOf(',') != -1 ? text.split(',') : [text, ""];
                    var regexzeros = /^0*[\,0*]*$/g;
                    
            
                    if (coma != -1 && cursor > coma) {
                        if (_break[1].length > setting.aftercoma - 1 && cursor == end) {
                            _.Stop(e);
                           
                        }
                    } else {
                        if (setting.miles && _break[0] != '') _break[0] = _break[0].replace(/\./g, '');
                        if ((_break[0].length > setting.beforecoma - 1 && coma) && cursor == end) {
                            _.Stop(e);
            
                        }
            
                    }

                    obj.value = _break[0] + "," + _break[1];

                    if(!setting.zeros && regexzeros.test(obj.value)){
                        _.Stop(e);
                    }

                    obj.res = true;
                    return true;
                },
                KeyIntergerValidation: function (setting, text, obj, e, _this, _) {
                    if (setting.miles && text != '') text = text.replace(/\./g, '');
                    var cursor = _this.children[0].children[1].children[1].selectionStart;
                    var end = _this.children[0].children[1].children[1].selectionEnd;
                    text = parseInt(text).toString();
                    if (text.length > setting.beforecoma - 1 && cursor == end) {
                        _.Stop(e);
                    }
                    obj.value = text
                    obj.res = true;
                    return obj;
                },
                EliminarCaracteresNoNumericos: function (text, obj) {
                    if (text && text.indexOf('.') != -1) obj.value = text.replace(/\./g, '');
                    return obj;
                },
                BlurFloatValidation: function (text, obj, setting, _) {
            
                    obj.value = text.toString().indexOf(',') != -1 ? parseFloat(text.replace(/\,/, '.')) : (text * 1);
                    obj.value = text == "" ? "" : obj.value.toFixed(setting.aftercoma);
                    obj.value = obj.value.replace(/\./, ",");
            
                    if (setting.miles) {
                        obj = _.PuntosMiles(obj.value, obj, setting);                  
                    }
                   
                    return obj;
                },
                PuntosMiles: function (text, obj, setting) {
                    var txt = "";
                    var _break = text.split(',');
                    var counter = _break[0].length
                    if (counter > 3) {
                        txt = _break[0].split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                        txt = txt.split('').reverse().join('').replace(/^[\.]/, '');
                    } else {
                        txt = _break[0];
                    }
            
                    obj.value = (setting.float) ? txt + "," + _break[1] : txt;
                    return obj;
                },
                Init: function (value) {
                    if (value == undefined || value.toString() == "") return;
            
                    var txt = "";
                    var err = "";
                    if (!$scope.float) {
                        txt = parseInt(value);
                        txt = txt.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                        txt = txt.split('').reverse().join('').replace(/^[\.]/, '');
            
                    } else {
                        value = typeof value == 'string' ? value.replace(/\,/, '.') : value;
                        value = parseFloat(value).toFixed($scope.aftercoma);
                        var _break = value.toString().replace(/\./, ',').split(',');
                        if (_break[0].length > $scope.beforecoma || _break[1].length > $scope.aftercoma) {
                            err = "<!>";
                            console.error("%cError: La configuración actual del Control (beforecoma o aftercoma) no soporta el valor ingresado por ng-model ", "color:red;padding:3px;font-size:14px;");
                        }
                        txt = _break[0];
                        if($scope.miles){
                            txt = _break[0].split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                            txt = txt.split('').reverse().join('').replace(/^[\.]/, '');
                        }
                        txt = err + txt + "," + _break[1] + err;
                    }
                    if(parseFloat(txt.replace(',','.')) <= 0 && !$scope.zeros){
                        txt = "";
                    }
                    $scope.model = txt;
                    return txt;
                },
            }
            
            $scope.actualizarModelo = function (modelo, id) {
                var m = modelo.split('.');
                var value = document.querySelector("#" + id + " input").value;  
                if (m.length == 1)
                    $scope.$parent[m[0]] = value;
                else if (m.length == 2) {
                    $scope.$parent[m[0]][m[1]] = value;
                }       
                
            }
            
            
            
            $scope.Methods.Init($scope.model);
            
            }