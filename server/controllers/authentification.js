var express = require('express');
function controller(services) {
    this.login = function (req, res) {
        var email = req.body.email.toLowerCase();
        var password = req.body.password;

        services['authentication'].login(email, password).then((result) => {
            if (result != null)
                res.send(result);
            else
                res.sendStatus(401);
        })
    }

}

exports.getRouter = function (services) {
    var ctrl = new controller(services);
    var router = express.Router();

    router.get('/', (req, res) => { res.send('hello!') });

    router.post('/login', ctrl.login);
    return router;
}



