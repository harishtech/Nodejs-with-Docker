#!/usr/bin/env bash
curl -v -H 'Content-Type: application/json' -d @provider_status.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderStatus | jq .
curl -v -H 'Content-Type: application/json' -d @provider_locations.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderLocations | jq .
curl -v -H 'Content-Type: application/json' -d @provider_top_visit_reasons.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderTopVisitReasons | jq .
curl -v -H 'Content-Type: application/json' -d @provider_reason_schedule.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderReasonSchedule | jq .
curl -v -H 'Content-Type: application/json' -d @provider_reason_schedule_workflow_next.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext | jq .
curl -v -H 'Content-Type: application/json' -d @provider_operational_questions.json http://localhost:8080/docasap/v1/Providers/v1/GetProviderOperationalQuestions | jq .
curl -v -H 'Content-Type: application/json' -d @book_appointment.json http://localhost:8080/docasap/v1/Providers/v1/BookAppointment | jq .
