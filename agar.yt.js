var f = window;
var l = window.jQuery;

var Agario = {
    engineUrl: 'http://agar.yt/js/mains.js',
    nickname: 'ﷺ',
    me: null,
    init: function() {
        document.addEventListener("DOMContentLoaded", this.ready());
    },
    ready: function() {
        this.cancelDefaultBehavior();
        this.handlePlayButton();
    },
    setNickname: function() {
        var nickElement = document.getElementById('nick');
        nickElement.value = this.nickname;
    },
    cancelDefaultBehavior: function() {
        for (var i in window) {
            if((typeof window[i]).toString()=="function") {
                if(window[i].name === 'Ta') {
                    //init functie
                    this.prevWa = window[i];
                    window[i] = function Ta() {
                       Agario.getEngineSource();
                    }

                }
            }
        }
    },
    handlePlayButton: function() {
        var btn = document.getElementById('playBtn');
        btn.addEventListener('click', this.onPlay);
    },
    onPlay: function() {
        this.me = null;
    },
    onDraw: function(object) {
        //remove mass temporary
        object.name = object.name.replace(/\[[0-9]+\]/i, "");

        this.initializeMe(object);

        //add mass again
        object.name = object.name + '[' + parseFloat(object.size).toFixed(0) + ']';

        if(this.me && this.me != object) {
            var dangerState = this.me.fetchDangerState(object);
            object.name = object.name.replace(/\([0-9]+\)/i, "");

            
            object.name = object.name + '(' + dangerState + ')';
            /*if(object.k && object.k.N) {
                switch(dangerState) {
                    case 0:
                        object.k.N = 'green';
                        break;
                    case 1:
                        object.k.N = 'purple';
                        break;
                    case 2:
                        object.k.N = 'orange';
                        break;
                    case 3:
                        object.k.N = 'red';
                        break;
                    default:
                        object.k.N = 'white';
                }
            }*/
        }
    },
    initializeMe: function(object) {
        if(object.name === this.nickname) {
            if(!this.me) {
                console.log(object);
            }

            this.me = object;

            var me = object;
            //console.log(this.me);
            if(!this.me.fetchDangerState) {
                this.me.fetchDangerState = function(other) {

                    var splitMe = (me.size / 3) * 2;
                    var otherSplitSize = other.size * 1.1;
                    if(splitMe > otherSplitSize) {
                        //console.log('' + other.id + ' is suckable');
                        return 0;
                    }

                    var meFloatSize = me.size * 0.9;
                    if(meFloatSize > other.size) {
                        //console.log('' + other.id + ' is floatable');
                        return 1;
                    }

                    var splitOther = (other.size / 3) * 2;
                    var meSplitSize = me.size * 1.1;
                    if(splitOther > meSplitSize) {
                        //console.log('I AM suckable');
                        return 3;
                    }

                    var otherFloatSize = other.size * 0.9;
                    if(otherFloatSize > me.size) {
                        //console.log('I AM floatable');
                        return 2;
                    }

                    return '';
                };
            }
        }
    },
    doEngineModifications(engine) {
        engine = engine.replace('\(function\(f, l\) {','');
        engine = engine.replace('}\)\(window, window.jQuery\)','');
        engine = engine.replace('$\(document\).ready', '\/*$\(document\).ready');
        engine = engine.replace('function handlePage','*\/function handlePage')

        //hook into the draw method
        engine = engine.replace('if \(this.K\(\)\) {', 'if \(this.K\(\)\) { Agario.onDraw\(this\);');
        return engine;
    },
    getEngineSource: function() {
        var engine;
        $.get(Agario.engineUrl, function( data ) {

            engine = Agario.doEngineModifications(data);

            console.log('Starting custom engine');
            console.log(engine);
            
            eval(engine);
            Ta();
            Agario.setNickname();
        });
    }
};

Agario.init();