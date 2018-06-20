#!/usr/bin/env bash


raw_token="$(curl https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/ubuntu:list)";
token="$(node -pe "JSON.parse('$raw_token').token")"
curl -i -H "Authorization: Bearer $token" https://registry-1.docker.io/v2/library/ubuntu/tags/list
