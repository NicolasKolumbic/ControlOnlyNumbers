angular
    .module('myApp', [])
    .directive('controlOnlyNumbers',
        function ($compile) {
            return {
                restrict: 'E',
                scope: {
                    id: '@',
                    model: '=',
                    ngClass: '=',
                    required: '=',
                    readonly: '@',
                    float: '@',
                    beforecoma: '@',
                    aftercoma: '@',
                    prefix: '@',
                    subfix: '@',
                    pcharacter: '@',
                    scharacter: '@',
                    decimal: '@',
                    miles: '@',
                    cssclass: '@',
                    value: '=',
                    setdisabled: '=',
                    zeros: '@',
                    onBlur: "="
                },
                templateUrl: './controlOnlyNumbers.html',
                link: function (scope, elm, attrs) {                  
                    scope.Setting.model = attrs.model;
                    if (scope.Setting.disabled) elm.find("input").prop('disabled', true);
                   
                    elm.on('keydown', function (event) {
                        scope.Methods.keyUp.call(this, event);
                    })
                    elm.on('keyup', function (event) {
                        var obj = this.children[0].children[0];
                        obj.value = obj.value.replace(/[^0-9,.]/g, '');
                    });
                       
                    if(scope.Setting.prefix)elm[0].children[0].children[0].innerHTML = scope.Methods.SetPrefix(scope.Setting.pcharacter);
                    if(scope.Setting.subfix)elm[0].children[0].children[3].innerHTML = scope.Methods.SetPrefix(scope.Setting.scharacter);

                    elm.find('input').on('blur', function (event) {
                        scope.Methods.blur.call(this, event);
                    });
                   
    
    
                },
                controller: Numbercontroller,
            };
        });

        function Numbercontroller($scope) {
            
            
            if ($scope.hasOwnProperty("$parent") && !$scope.$parent.hasOwnProperty("OnlyNumbers")) {
            
                $scope.$parent.OnlyNumbers = (function (d, w) {
            
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
            
                    function OnlyNumbers() {
                        this.value = "";
                        this.node = null;
            
                    }
            
                    OnlyNumbers.prototype.Find = function (md, id) {
                        var _brk = md.split('.');
                        var s = $scope.$parent;
                        this.selector = (id ? "#" + id : "") + "[model='" + md + "']";
                        this.value = _brk.length > 1 ?s[_brk[0]][_brk[1]]:s[_brk[0]];
                        this.node = d.querySelectorAll(this.selector);
                        if (id) {
                            for (var i = 0; i < this.node.length; i++)
                                (function (indice, elemento) {
                                    if (elemento.id == id) this.node = elemento;
                                })(i, this.node[i])
                        }
            
                        return this;
                    }
            
                    OnlyNumbers.prototype.Set = function (prop, value) {
                        var execute = function (elemento) {
                            if (/float|beforecoma|aftercoma|prefix|subfix|pcharacter|scharacter|decimal|miles|zeros/.test(prop)) {
                                $scope.Setting[prop] = value;
                                $scope[prop] = value;
                            } else {
                                elemento.children[0].children[0][prop] = value;
                            }
                        }
            
                        if (prop == "class") prop = prop + "Name";
                        if (this.node.length > 1 && !this.first) {
                            for (var i = 0; i < this.node.length; i++)
                                (function (indice, elemento) {
                                    execute(elemento);
                                })(i, this.node[i])
                        } else {
                            execute(this.node[0]);
                        }
                        return this;
                    }
            
                    OnlyNumbers.prototype.Format = function (type, dec) {
                        return Format[type](this.value, dec);
                    }
            
                    OnlyNumbers.prototype.End = function () {
                        return this.value;
                    }
            
                    w.OnlyNumbers = new OnlyNumbers();
            
                    return w.OnlyNumbers;
            
                })(document, window);
            
            }
            
            $scope.Setting = {
                id: !$scope.id ? "" : $scope.id,
                model: !$scope.model ? "" : $scope.model,
                ngclass: !$scope.ngClass ? "" : $scope.ngClass,
                required: !$scope.required ? false : $scope.required,
                readonly: !$scope.readonly ? false : ($scope.readonly == 'true'),
                float: !$scope.float ? true : ($scope.float == "true"),
                beforecoma: !$scope.beforecoma ? 4 : parseInt($scope.beforecoma),
                aftercoma: !$scope.aftercoma ? 2 : parseInt($scope.aftercoma),
                prefix: !$scope.prefix ? false : ($scope.prefix == 'true'),
                subfix: !$scope.subfix ? false : ($scope.subfix == 'true'),
                pcharacter: !$scope.pcharacter ? "" : $scope.pcharacter,
                scharacter: !$scope.scharacter ? "" : $scope.scharacter,
                decimal: !$scope.decimal ? 2 : parseInt($scope.decimal),
                miles: !$scope.miles ? true : ($scope.miles == 'true'),
                cssclass: !$scope.cssClass ? "" : $scope.cssClass,
                default: !$scope.default ? "" : $scope.default,
                zeros: !$scope.zeros ? true : ($scope.zeros == 'true'),
                value: !$scope.value && $scope.value != 0 && $scope.value != '0' ? "" : $scope.value,
                disabled: !$scope.setdisabled ? false : $scope.setdisabled,
                onBlur: !$scope.onBlur ? null : $scope.onBlur
            };

            var CONSTANTES = {
                regexZeros: /^(0+\,*0*)|(0+\.*0*)$/g
            }
            
            
            
            $scope.Methods = {
                SetPrefix: function(v){
                   
                    var icon = v;
                    if(/currency/.test(v)){
                        icon = "<i class='fa fa-usd' aria-hidden='true'></i>";
                    }
                    return icon;
                },
                blur: function (event) {
                    var _ = $scope.Methods;
                    var setting = $scope.Setting;
                    var m = setting.model.split(".");
                    var value = _.findScope($scope, m, setting, this, _, event);
                    var splitModel = function () {
                        m.length > 1 ? $scope.$parent[m[0]][m[1]] = "": $scope.$parent[m[0]] = "";
                        
                    }
                    var blurObject ={
                        original: value.value,
                        numbers: 0,
                        newValue: ""
                    } 
            
                    if (value.value != undefined && value.res && !/\<\!\>/.test(value.value.toString())) {
                        
                        value = _.EliminarCaracteresNoNumericos(setting, value.value, value);
                        blurObject.numbers = parseFloat(value.value);
            
                        if (value.value.indexOf(',') == -1 && value.value.replace(/\,/, '').length > setting.beforecoma) {
                            this.value = ""
                            $scope.model = "";
                            $scope.$apply(splitModel);
                            return;
            
                        }
            
                        if (setting.float && value.value != "") {
                            _.BlurFloatValidation(value.value, value, setting, _)
                        } else if (value.value != "") {                    
                            value.value = parseInt(value.value).toString();
                            if (setting.miles && value.value.toString().length > 3) {
                                _.PuntosMiles(value.value + ",", value, setting);
                            }
            
                        }
            
                     
                    } else if (value.value == "" && !value.res) {
                        this.value = "";
                        $scope.$apply(splitModel);
                        return;
                    }
            
                    this.value = value.value != undefined ? value.value : "";
                    $scope.actualizarModelo(setting.model, setting.id);
            
                    if (setting.onBlur != null && typeof setting.onBlur == "function") {
                        blurObject.newValue = value.value;
                        setting.onBlur(blurObject, setting.model, setting.id);
                       
                    }
                   
                },
                keyUp: function (event, ModelCtrl) {
            
                    var _ = $scope.Methods;
                    var setting = $scope.Setting;
                    var value = _.findScope($scope, setting.model.split("."), setting, this, _, event);
                    
                    if (value.res) { 
                        
                        if (event.shiftKey) {
                            _.Stop(event);
                        }
                        else if (event.which == 188 || event.which == 44) {
                            if (!value.value || value.value.indexOf(',') != -1 || !setting.float) {
                                _.Stop(event);
                            }
                        } else if (value.value == '0' && !setting.float && (event.which == 96 || event.which == 48)) {
                            _.Stop(event);
                        } else if (event.which == 64 || event.which == 16) {
                            _.Stop(event);
                        } else if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
                           
                            if (setting.float) {
                                if (value.value) _.KeyFloatValidation(setting, value.value, value, event, this, _);
                            } else if (!setting.float) {
                                if (value.value) _.KeyIntergerValidation(setting, value.value, value, event, this, _);
                            }
                        } else if ([8, 13, 27, 37, 38, 39, 40, 46, 9].indexOf(event.which) > -1) {
                          
                            return true;
                        } else {
                            _.Stop(event);
                        }
                    } else if (!value.res && !setting.zeros && /96|48/.test(event.which.toString())) {
                       
                        var cursor = this.children[0].children[0].selectionStart;
                        var end = this.children[0].children[0].selectionEnd;
                        var coma = value.value.indexOf(',');
                        var v = this.children[0].children[0].value;
                        var _break = v.indexOf(',') != -1 ? v.split(',') : [v, ""];
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
                     
                        
                    } else if ((value.value == "" && !value.res) || (value.value == "0," && (event.which == 188 || event.which == 44)) || (!value.res && !setting.zeros && /96|48/.test(event.which.toString()))) {
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
                    
                    obj.value = obj.model[!value[1] ? value[0] : value[1]] && parseFloat(obj.model[!value[1] ? value[0] : value[1]].replace(/\,/,'.')) > 0 ? obj.model[!value[1] ? value[0] : value[1]].toString() : _.InputValueZeroUndefined(setting, obj.model[!value[1] ? value[0] : value[1]], _, e, obj);
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
                    var cursor = _this.children[0].children[0].selectionStart;
                    var end = _this.children[0].children[0].selectionEnd;
                    var coma = text.indexOf(',');
                    var _break = text.indexOf(',') != -1 ? text.split(',') : [text, ""];
                    var regexzeros = /^0+\,*0*$/g;
                    
            
                    if (coma != -1 && cursor > coma) {
                        if (_break[1].length > setting.aftercoma - 1 && cursor == end) {
                            _.Stop(e);
                           
                        }
                    } else {
                        if (setting.miles && _break[0] != '') _break[0] = _break[0].replace(/\./g, '');
                        if ((_break[0].length > setting.beforecoma - 1 && coma) && cursor == end) {
                            _.Stop(e);
            
                        }
                        //if((regexzeros.test(text) || regexzeros.test(_break[0])){
                        
                        //}
            
                    }
            
                    obj.value = _break[0] + "," + _break[1]
                    obj.res = true;
                    return true;
                },
                KeyIntergerValidation: function (setting, text, obj, e, _this, _) {
                    if (setting.miles && text != '') text = text.replace(/\./g, '');
                    var cursor = _this.children[0].children[0].selectionStart;
                    var end = _this.children[0].children[0].selectionEnd;
                    text = parseInt(text).toString();
                    if (text.length > setting.beforecoma - 1 && cursor == end) {
                        _.Stop(e);
                    }
                    obj.value = text
                    obj.res = true;
                    return obj;
                },
                EliminarCaracteresNoNumericos: function (setting, text, obj) {
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
                    if (!$scope.Setting.float) {
                        txt = value.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                        txt = txt.split('').reverse().join('').replace(/^[\.]/, '');
            
                    } else {
                        value = typeof value == 'string' ? value.replace(/\,/, '.') : value;
                        value = parseFloat(value).toFixed($scope.Setting.aftercoma);
                        var _break = value.toString().replace(/\./, ',').split(',');
                        if (_break[0].length > $scope.Setting.beforecoma || _break[1].length > $scope.Setting.aftercoma) {
                            err = "<!>";
                            console.error("%cError: La configuración actual del Control (beforecoma o aftercoma) no soporta el valor ingresado por ng-model ", "color:red;padding:3px;font-size:14px;");
                        }
                        txt = _break[0].split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                        txt = txt.split('').reverse().join('').replace(/^[\.]/, '');
                        txt = err + txt + "," + _break[1] + err;
                    }
                    if(CONSTANTES.regexZeros.test(txt) && !$scope.Setting.zeros){
                        txt = "";
                    }
                    $scope.model = txt
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