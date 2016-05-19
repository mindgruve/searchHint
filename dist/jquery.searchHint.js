;
(function ($, window, document, undefined) {

    var pluginName = "searchHint",
        /**
         * This SearchHintOptions object can be overridden during initialization
         * @type {{suggestionBox: jQuery object, termDictionaryUrl: string, dataType: string}}
         */
        defaults = {
            suggestionBox: null,
            termDictionaryUrl: null,
            dataType: 'json'
        };

    var _cache = {};


    /**
     * SearchHint - shows suggested keywords when a user is searching.
     *
     * @author Westley Mon <wmarchment@mindgruve.com>
     * @version 1.0.0
     *
     * @param {jQuery} element jQuery instance of selected elements
     * @param {SearchHintOptions} options Custom options will be merged with the defaults
     * @constructor
     */
    function SearchHint(element, options) {
        if (element) {
            this.element = element;

            // jQuery has an extend method which merges the contents of two or
            // more objects, storing the result in the first object. The first object
            // is generally empty as we don't want to alter the default options for
            // future instances of the plugin
            this.options = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }
    }

    SearchHint.prototype = {

        init: function() {
            this.onKeyUp();
            this.currentSuggestion = '';
        },

        onKeyUp: function() {
            var _this = this;
            $(this.element).on('keyup', function(e) {
                if (e.keyCode == 39) {
                    _this.autoComplete();
                    return;
                }

                _this.processInput(this.value);
            });
        },

        updateSuggestion: function(string, termsList) {
            var _this = this;

            // if empty, clear out the suggestion
            if (!string) {
                $(this.options.suggestionBox).text('');
                this.currentSuggestion = '';
                return;
            }

            var termsLength = termsList.length;
            var i = 0;
            var foundMatch = false;

            // rule out special characters
            var noSpecialChars = new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$', 'gi').test(string);
            //declare outside of loop for performance gain
            var stringRegExp = new RegExp('^' + string, 'i');

            for (; i < termsLength; i++) {
                // test if should skip match and move to next match - deeper suggestions: 'ping' suggest 'ping pong' instead of only 'ping'
                var minStringLength = string.length < termsList[i].length;

                // dont do regex if string > term in list
                if (minStringLength) {
                    // test if match in list
                    var matchString = stringRegExp.test(termsList[i]);

                    if (matchString && noSpecialChars) {
                        foundMatch = true;
                        this.currentSuggestion = _this.matchCase(string, termsList[i]);
                        $(this.options.suggestionBox).text(this.currentSuggestion);
                        break;
                    }
                }
            } // end loop

            // if no results or if has special characters
            if (!foundMatch || !noSpecialChars) {
                this.currentSuggestion = '';
                $(this.options.suggestionBox).text('');
            }
        },

        matchCase: function(string, term) {
            var len = string.length;
            var end = term.substring(len);
            return string + end;
        },

        autoComplete: function() {
            if (this.currentSuggestion == '') return;
            $(this.element).val(this.currentSuggestion);
        },

        getList: function(letter) {
            if (!_cache[letter]) {
                var deferred = $.Deferred();

                $.ajax({
                    dataType: this.options.dataType,
                    url: this.options.termDictionaryUrl + '?letter=' + letter
                }).done(function (response) {
                    deferred.resolve(response);
                });

                _cache[letter] = deferred.promise();
            }

            return _cache[letter];
        },

        processInput: function(val) {
            var _this = this;
            var letter = val.charAt(0).toLowerCase();
            var _terms;

            if (letter == '') {
                this.updateSuggestion('', '');
                return;
            }

            this.getList(letter).done(function(response) {
                _terms = response.terms;
                _this.updateSuggestion(val, _terms);
            });
        }

    };

    $.fn[ pluginName ] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new SearchHint(this, options));
            }
        });
    };

    //add support for amd
    if (typeof define === "function" && define.amd) {
        define(function () {
            return SearchHint;
        });
    }

})(jQuery, window, document);