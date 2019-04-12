#!/usr/bin/env bash

# for docasap qa calls

BEARER='e19c1647-7bbc-3161-8382-4a35b390c824'

curl $1 -H 'Content-Type: application/json' -d @provider_status.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderStatus | jq .
curl $1 -H 'Content-Type: application/json' -d @provider_locations.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderLocations | jq .
curl $1 -H 'Content-Type: application/json' -d @provider_top_visit_reasons.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderTopVisitReasons | jq .
curl $1 -H 'Content-Type: application/json' -d @provider_reason_schedule.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderReasonSchedule | jq .
curl $1 -H 'Content-Type: application/json' -d @provider_reason_schedule_workflow_next.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderReasonScheduleWorkflowNext | jq .
curl $1 -H 'Content-Type: application/json' -d @provider_operational_questions.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/GetProviderOperationalQuestions | jq .
curl $1 -H 'Content-Type: application/json' -d @book_appointment.json --header 'Authorization: Bearer '$BEARER https://apitest.docasap.com:8443/Providers/v1/BookAppointment | jq .
