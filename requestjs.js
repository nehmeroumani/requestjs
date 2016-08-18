define('requestjs', ["jquery"], function ($) {
    return function Request() {
        this._onSuccess = null;
        this._onFailure = null;
        this._onProgress = null;
        this._onComplete = null;
        this.xhr = null;
        this.xhrOptions = null;
        this.isBusy = false;

        this.init = function (url, data, multipart, contentType) {
            this.xhrOptions = initXhrOptions(url, data, multipart, contentType);
            if (this.xhrOptions) {
                return this;
            } else {
                console.log('invalid request :(');
                return null;
            }
        };

        this.post = function () {
            return this.submit('POST');
        };

        this.get = function () {
            return this.submit('GET');
        };

        this.delete = function () {
            return this.submit('DELETE');
        };

        this.submit = function (method) {
            if (this.xhrOptions) {
                if (!this.isBusy) {
                    this.isBusy = true;
                    this.xhrOptions.type = method;
                    this.setEventsListeners();
                    this.xhr = $.ajax(this.xhrOptions);
                }
                return this;
            } else {
                console.error("invalid request :(");
            }
        };

        this.onFailure = function (func) {
            if (typeof func === 'function') {
                this._onFailure = func;
            } else {
                console.error('invalid failure func :( ');
            }
            return this;
        };

        this.onProgress = function (func) {
            if (typeof func === 'function') {
                this._onProgress = func;
            } else {
                console.error('invalid on progress func :( ');
            }
            return this;
        };

        this.onSuccess = function (func) {
            if (typeof func === 'function') {
                this._onSuccess = func;
            } else {
                console.error('invalid on success func :( ');
            }
            return this;
        };

        this.onComplete = function (func) {
            if (typeof func === 'function') {
                this._onComplete = func;
            } else {
                console.error('invalid on complete func :( ');
            }
            return this;
        };

        this.setEventsListeners = function () {
            if (this.xhrOptions) {
                var self = this;
                if (this._onFailure) {
                    this.xhrOptions.error = function (xhr, status, err) {
                        self._onFailure(xhr.responseJSON);
                    };
                }

                if (this._onProgress) {
                    this.xhrOptions.xhr = function () {
                        // get the native XmlHttpRequest object
                        var xhr = $.ajaxSettings.xhr();
                        // set the onprogress event handler
                        xhr.upload.onprogress = function (e) {
                            var percentage = parseInt(e.loaded / e.total * 100);
                            self._onProgress(percentage, e);
                        };
                        return xhr;
                    };
                }

                if (this._onSuccess) {
                    this.xhrOptions.success = this._onSuccess;
                }

                if (this._onComplete) {
                    this.xhrOptions.complete = function (xhr, textStatus) {
                        self._onComplete(xhr, textStatus);
                        self.isBusy = false;
                    };
                }
            }
        };

        function initXhrOptions(url, data, multipart, contentType) {
            var options = {};
            if (!url) {
                return null;
            }
            options.xhrFields = {
                withCredentials: true
            };
            options.crossDomain = true;
            options.url = url;
            if (data) {
                options.data = data;
            }
            if (multipart) {
                options.processData = false;
                options.contentType = false;
            }

            return options;
        }
    };
});