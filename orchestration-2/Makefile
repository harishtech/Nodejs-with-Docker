APP_NAME = orchestration

#
# Build targets
#

fetch:
	stack pull-image nginx_1.14:Master
	stack pull-image node_10.12:stack
	-stack pull-image ${APP_NAME}:Master
	-docker tag ${APP_NAME}:Master ${APP_NAME}

build: fetch
	git rev-parse --verify HEAD > VERSION
	docker build --pull=false -t ${APP_NAME} .
	docker build --pull=false -t ${APP_NAME}_dev -f Dockerfile.development .

clean:
	docker-compose kill
	docker-compose rm --force -v

images: clean build

push:
	stack push-image ${APP_NAME}

nuke: clean
	docker rmi ${APP_NAME}

#
# Dev targets
#

docker-run:
	docker run -p 8080:8080 --rm ${APP_NAME}

start-ngx: create-network
	stack env docker-compose up -d development

start:
	stack env docker-compose up -d development

stop:
	docker-compose stop

deploy:
	stack deploy -b

create-network:
	docker network create ngx-services || true

#
# Test and CI
#

init-ci: env clean build create-network
	mkdir ci-artifacts || true

env:
	printf "%s\n" APIC_ID=1111111111 APIC_SECRET=1111111111 CVS_HOSTNAME=sit1-2waysslservices.caremark.com CVS_WEB_COMPONENT_BASE_URL=sit2fast.caremark.com CVS_API_KEY=1111111111 CVS_API_SECRET=1111111111 DOCASAP_ID=1111111111 DOCASAP_SECRET=1111111111 CVS_WEB_COMP_API_KEY=1111111111 CVS_WEB_COMP_API_SECRET=1111111111 CVS_CA_CRT_BASE64=1111111111 CVS_TLS_CRT_BASE64=1111111111 CVS_TLS_KEY_BASE64=1111111111 TELEDOC_RSA_KEY="\"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0\nFPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/\n3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB\n-----END PUBLIC KEY-----\"" APIC_ACCOUNTS_URL=https://qaapih1.int.aetna.com/healthcare/qapath1/at/v3/accounts/ APIC_MEMBERSHIPS_URL=https://qaapih1.int.aetna.com/healthcare/qapath1/at/v5/memberships/ APIC_OAUTH_URL=https://qaapih1.int.aetna.com/healthcare/qapath1/v5/auth/oauth2/token DOCASAP_URL=https://apitest.docasap.com REDIS_AUTH_TOKEN=1111111111 REDIS_HOSTNAME=master.example.com > .env

qualify: env images

manifest:
	@stack generate-manifest Manifest.yml

unit-tests: create-network
	docker-compose run --rm test npm run test

smoke-tests: create-network
	docker-compose run --rm development npm run test-smoke

tests: unit-tests smoke-tests

flush-redis:
	docker-compose run --rm development npm run flush-redis

eslint:
	docker-compose run --rm development eslint --output-file /tmp/ci-artifacts/eslint --stdin-filename server/**/*.js

npm-audit:
	docker-compose run --rm development npm audit > ci-artifacts/npm-audit

typeahead-load-test:
	artillery run server/tests/typeahead/load-test.yml

tail-aws:
	stack awslogs get -G -w $$(stack outputs Service | jq -r .LogGroup)

#
# Utilities
#

phony:
	@sed -ne '/#/!s/:$$/ \\/p' Makefile | sed -e '$$s/ \\//'


cleanup:
	docker rmi -f ${APP_NAME}_dev
	docker rmi -f ${APP_NAME}

.PHONY: \
	fetch \
	push \
	docker-run \
	phony
