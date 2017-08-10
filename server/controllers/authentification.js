var express = require('express');
function controller(service) {
    this.login = function (req, res) {
        var email = req.body.email.toLowerCase();
        var password = req.body.password;

        service.login(email, password).then((result) => {
            if (result != null)
                res.send(result);
            else
                res.sendStatus(401);
        })
    }

}

exports.getRouter = function (service) {
    var ctrl = new controller(service);
    var router = express.Router();

    router.get('/', (req, res) => { res.send('hello!') });

    router.post('/login', ctrl.login);
    return router;
}



