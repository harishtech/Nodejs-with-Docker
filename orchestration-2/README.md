# Aetna Digital Orchestration Service

`npm install` - install necessary modules
`npm start` - start local server on default port 8080

### To Run Unit Tests

There is a lot of internal set up to make this service work. You will require
values in your `cvs.env` and your `docasap.env` to run the tests through docker via
Make.  Another process is to source the environment variables locally.

Speak to Geoff Petrie or Shaun Ambrose for values for `cvs.env` and `docasap.env`.

Once populated:

`make build`
`make docker-test`

and to run the smoke tests:

`make docker-test-integration`.

### Local Development with Ngx_Services

The simplest way to develop NGX related orchestrations is locally. Both services (NGX and Orchestration) contain docker network logic built into the `make start` command which enables a shared local rabbit to communicate between services.

**NOTE:** Make sure the Taxonomy feature flag (`server/features.json`) is set to `true`

```json
{
  "docasap": true,
  "taxonomy": true,
  "cvs": true
}
```

Run NGX Services **first** with steps below, then repeat steps in Orchestration;

1. `make images`
2. `make start`
3. `docker-compose logs -f`

NOTE: The current addition of Stress environment into the Orchestration template will only work in Taxonomy Service.

### CI Pipeline

Creating a PR in github for this repo will trigger a Jenkins job named "server-orchestration-service-ci-multijob". This is a multijob and invokes "server-orchestration-service-ci" which will run the following steps.

```console
make init-ci
make eslint
make npm-audit
make unit-tests

twistcli
```

Build failures will generate Build Artifacts in Jenkins. Retrieve the Build Artifacts by selecting the failed build, which displays the text files with detailed information about the cause of the failure.


#### Run CI Pipeline Locally

Example: The Jenkins job fails eslint. If you would like to run eslint locally, run the following. Replace eslint with the specific step that is failing, such as npm-audit. Please review the build pipeline details above, which enumerates the build steps.

```console
make init-ci
make eslint
make cleanup
```

The only step that will not run locally is twistcli since it requires specific credentials for the twistlock console. However, twistcli will output detailed results. 

#### Twistlock

Twistlock is a tool that scans docker containers for known CVEs. The ci job is currently configured to only fail the build on Critical discoveries. As the vulnerabilities are resolved, it woul dbe recommended to fail on less critical discoveries. You can configure this in "server-orchestration-service-ci" > TwistlockVulnerabilityThreshold.CRITICAL. Valid options are LOW, MEDIUM, HIGH, CRITICAL.