#!/bin/bash

# Example for the Docker Hub V2 API
# Returns all images and tags associated with a Docker Hub organization account.
# Requires 'jq': https://stedolan.github.io/jq/

# set username, password, and organization
UNAME="denmanm1"
UPASS="Gimme3br*"
ORG="library/node/tags"

# -------

set -e
echo

# get token
echo "Retrieving token ..."
TOKEN=$(curl -s -H "Content-Type: application/json" -X POST -d '{"username": "'${UNAME}'", "password": "'${UPASS}'"}' https://hub.docker.com/v2/users/login/ | jq -r .token)

# get list of repositories
echo "Retrieving repository list ..."
REPO_LIST=$(curl -s -H "Authorization: JWT ${TOKEN}" https://hub.docker.com/v2/repositories/${ORG}/?page_size=100 | jq -r '.results|.[]|.name')

echo "here is repo list: $REPO_LIST";
# output images & tags
echo; echo "Images and tags for organization: ${ORG}"; echo

#for i in ${REPO_LIST}
#do
#  echo "${i}:"
#  # tags
#  IMAGE_TAGS=$(curl -s -H "Authorization: JWT ${TOKEN}" https://hub.docker.com/v2/repositories/${ORG}/${i}/tags/?page_size=100 | jq -r '.results|.[]|.name')
#  for j in ${IMAGE_TAGS}
#  do
#    echo "  - ${j}"
#  done
#  echo
#done
