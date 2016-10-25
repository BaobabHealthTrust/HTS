module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });

    return router;

}
