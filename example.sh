#!/usr/bin/env bash


#raw_token="$(curl https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/ubuntu:list)";
#token="$(node -pe "JSON.parse('$raw_token').token")"

# set username, password, and organization
UNAME="denmanm1"
UPASS="Gimme3br*"
ORG="node"

# -------

set -e
echo

# get token
echo "Retrieving token ..."
token="$(curl -s -H "Content-Type: application/json" -X POST -d '{"username": "'${UNAME}'", "password": "'${UPASS}'"}' https://hub.docker.com/v2/users/login/ | jq -r .token)"

echo "here is token: $token"

curl -i -H "Authorization: Bearer $token" https://registry-1.docker.io/v2/library/ubuntu/tags/list
