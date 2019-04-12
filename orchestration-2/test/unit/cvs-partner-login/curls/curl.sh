#!/usr/bin/env bash

VERSION="2.0"
SERVICENAME="partnerLogin"
APPNAME="CMK_WEB"
APIKEY="ADD API KEY"
DEVICETYPE="DESKTOP"
LINEOFBUSINESS="PBM"
CHANNELNAME="MOBILE"
RESPONSELEVEL=1
HMAC="ADD URI ENCODED HMAC"
TIMESTAMP="ADD URI ENCODED TS"
DEVICEID="device12345"
DEVICETOKEN="device12345"

curl -v --key cvs-key.key --cert cvs-cert.crt -H "Content-Type: application/xml" --data @partner_login.xml "https://sit2-2waysslservices.caremark.com/login/partnerLogin?version=$VERSION&serviceName=$SERVICENAME&appName=$APPNAME&apiKey=$APIKEY&deviceType=$DEVICETYPE&lineOfBusiness=$LINEOFBUSINESS&channelName=$CHANNELNAME&responseLevel=$RESPONSELEVEL&hmac=$HMAC&timestamp=$TIMESTAMP&deviceID=$DEVICEID&deviceToken=$DEVICETOKEN"
