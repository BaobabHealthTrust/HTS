#!/usr/bin/env node

var fs = require("fs");
var async = require("async");
var path = require("path");
var settings = require("./setup.json");

function runCmd(cmd, callBack) {
    var exec = require('child_process').exec;

    exec(cmd, function (error, stdout, stderr) {

        callBack(error, stdout, stderr);

    });
}

var rootPath = path.resolve(settings.common_folder_path);

async.series([

    function (callback) {

        if (!fs.existsSync(rootPath)) {

            runCmd("mkdir -p " + rootPath, function (error, stdout, stderr) {

                if (error) {

                    console.log(error);

                } else if (stderr) {

                    console.log(stderr);

                } else if (stdout) {

                    console.log(stdout);

                }

                callback();

            })

        } else {

            callback();

        }

    },

    function (callback) {

        if (!fs.existsSync(rootPath + "/modules")) {

            console.log("Cloning " + settings.modules_github_repo + " ...");

            runCmd("cd " + rootPath + "; git clone " + settings.modules_github_repo.replace(/^https\:\/\//i, "https://" +
                    settings.github_username + "@") + " modules", function (error, stdout, stderr) {

                if (error) {

                    console.log(error);

                } else if (stderr) {

                    console.log(stderr);

                } else if (stdout) {

                    console.log("Cloned into " + rootPath + "/modules");

                }

                callback();

            })

        } else {

            console.log("Updating from " + settings.modules_github_repo + " ...");

            runCmd("cd " + rootPath + "/modules; git pull", function (error, stdout, stderr) {

                if (error) {

                    console.log(error);

                } else if (stderr) {

                    console.log(stderr);

                } else if (stdout) {

                    console.log(stdout);

                }

                callback();

            })

        }

    },

    function (callback) {

        if (!fs.existsSync(rootPath + "/touchscreentoolkit")) {

            console.log("Cloning " + settings.touchscreen_toolkit_github_repo + " ...");

            runCmd("cd " + rootPath + "; git clone " + settings.touchscreen_toolkit_github_repo + " touchscreentoolkit",
                function (error, stdout, stderr) {

                    if (error) {

                        console.log(error);

                    } else if (stderr) {

                        console.log(stderr);

                    } else if (stdout) {

                        console.log("Cloned into " + rootPath + "/touchscreentoolkit");

                    }

                    callback();

                })

        } else {

            console.log("Updating from " + settings.touchscreen_toolkit_github_repo + " ...");

            runCmd("cd " + rootPath + "/touchscreentoolkit; git pull",
                function (error, stdout, stderr) {

                    if (error) {

                        console.log(error);

                    } else if (stderr) {

                        console.log(stderr);

                    } else if (stdout) {

                        console.log(stdout);

                    }

                    callback();

                })

        }

    },

    function (callback) {

        console.log("Linking " + rootPath + "/modules/app.js file ...");

        runCmd("cp " + rootPath + "/modules/app.js .", function (error, stdout, stderr) {

            if (error) {

                console.log(error);

            } else if (stderr) {

                console.log(stderr);

            } else if (stdout) {

                console.log(stdout);

            }

            callback();

        })

    },

    function (callback) {

        if (!fs.existsSync("./public/modules")) {

            console.log("Linking " + rootPath + "/modules folder ...");

            runCmd("ln -s " + rootPath + "/modules ./public/modules", function (error, stdout, stderr) {

                if (error) {

                    console.log(error);

                } else if (stderr) {

                    console.log(stderr);

                } else if (stdout) {

                    console.log(stdout);

                }

                callback();

            })

        } else {

            callback();

        }

    },

    function (callback) {

        if (!fs.existsSync("./public/touchscreentoolkit")) {

            console.log("Linking " + rootPath + "/touchscreentoolkit folder ...");

            runCmd("ln -s " + rootPath + "/touchscreentoolkit ./public/touchscreentoolkit", function (error, stdout, stderr) {

                if (error) {

                    console.log(error);

                } else if (stderr) {

                    console.log(stderr);

                } else if (stdout) {

                    console.log(stdout);

                }

                callback();

            })

        } else {

            callback();

        }

    }

], function () {

    console.log("All set!");

})

