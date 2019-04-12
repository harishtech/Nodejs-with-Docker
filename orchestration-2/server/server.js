/* eslint no-console: 0 */
process.env.NEW_RELIC_KEY ? require('newrelic') : console.log('no new relic key found');
const express = require('express');
const bodyParser = require('body-parser');
const features = require('./features');
const { expressLogger, errorLogger } = require('./utils/middleware/expressLogger');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(expressLogger);
app.use(errorLogger);

app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

if (features.docasap) {
  const docAsapProxy = require('./docAsap/proxy');
  const { getAllRoutes: docAsapRoutes } = require('./docAsap/routesManager');

  docAsapRoutes().forEach(route => {
    app.post(route, async (req, res) => {
      const response = await docAsapProxy.execute(req);

      res.status(response.status).send(response.data);
    });
  });
}

if (features.typeahead) {
  const typeaheadCallback = require('./typeahead/route');
  const respondNotFound = (_, res) =>
    res.status(404).send({
      moreInformation: 'The requested resource does not exist',
      httpMessage: 'Not Found',
      httpCode: 404
    });
  app
    .route('/typeahead/v1')
    .post(typeaheadCallback)
    .get(respondNotFound)
    .put(respondNotFound)
    .patch(respondNotFound)
    .delete(respondNotFound);
}

if (features.cvs) {
  const appTokenAuditor = require('./cvs-partner-login/appTokenAuditor');

  app.post('/cvs/v1/webcomponents', async (req, res) => {
    const webcomponents = require('./cvs-partner-login/webcomponents');
    try {
      const response = await webcomponents.mediate(req);
      if ('error' in response) {
        res.status(response.status || response.data.status).send(response.data);
        return false;
      }

      if(response.validationError) {
        res.sendStatus(response.validationError.data.status);
        return true;
      }

      res.status(response.data.status).send(response.data.message.webComponent);
    } catch(e) {
      res.status(404).send(e);
    }
  });

  app.get('/cvs/v1/partnerlogin/:membershipId', async (req, res) => {
    const partnerLoginTokenData = require('./cvs-partner-login/partnerLoginTokenData');

    try {
      const membershipId = req.params.membershipId;
      const response = await partnerLoginTokenData.generate({ headers: req.headers, membershipId });

      if (response.status === 200) {
        res.status(response.status).send(response);
      } else if ('error' in response) {
        res.status(response.status || response.data.status).send(response.data);
      } else if(response.validationError) {
        res.status(response.validationError.data.status).send(response.validationError.data);
      }
    } catch(e) {
      console.log(e);

      res.status(404).send(e);
    }
  });

  app.get('/apic/v1/accounts', async (req, res) => {
    const accountIdGenerator = require('./cvs-partner-login/accountIdGenerator');
    const apicAccounts = require('./cvs-partner-login/accounts');

    try {
      const bearerToken = await appTokenAuditor.verify(req.headers);
      const accountId = await accountIdGenerator.execute(req.headers);
      const response = await apicAccounts.fetch({ bearerToken, accountId, headers: req.headers });

      res.status(response.status).send(response.data);
    } catch(e) {
      console.log(e);

      res.status(404).send(e);
    }
  });

  app.get('/apic/v1/memberships/:membershipId', async (req, res) => {
    const appTokenAuditor = require('./cvs-partner-login/appTokenAuditor');
    const apicMemberships = require('./cvs-partner-login/memberships');

    try {
      const bearerToken = await appTokenAuditor.verify(req.headers);
      const membershipId = req.params.membershipId;
      const response = await apicMemberships.fetch({ bearerToken, membershipId, headers: req.headers });

      res.status(response.status).send(response.data);
    } catch(e) {
      console.log(e);

      res.status(404).send(e);
    }
  });

}

if (features.teledoc) {
  const appTokenAuditor = require('./cvs-partner-login/appTokenAuditor');
  const apicMemberships = require('./cvs-partner-login/memberships');
  const teledocPayload = require('./teledoc/payloadGenerator');

  app.get('/v1/teledocssotoken/:membershipId', async(req, res) => {
    const membershipId = req.params.membershipId;

    try {
      const bearerToken = await appTokenAuditor.verify(req.headers);
      const membershipResponse = await apicMemberships.fetch({ bearerToken, membershipId, headers: req.headers });
      const response = teledocPayload.execute(membershipResponse.data);

      res.status(response.status).send(response.data);
    } catch(e) {
      console.log(e);
      res.status(500).send(e);
    }
  });
}

app.listen(port, () => {
  console.log(`Server listening to port ${port}.`);
});

module.exports = app;
