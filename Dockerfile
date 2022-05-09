FROM node:16.12.0-alpine

# Input Argumenta
ARG github_token

# Environments
ENV GITHUB_TOKEN ${github_token}

# Env Installation
RUN apk update
RUN apk add --no-cache --virtual make gcc g++ python2 git

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies & source code
copy . .

# TODO: Or Download from git repository using GITHUB_TOKEN
# RUN git clone https://$GITHUB_TOKEN@github.com/username/repo.git

# Independent installation for binding
RUN yarn add node-sass

# RUN yarn build
ENV PORT 8000
EXPOSE 8000
CMD ["node", "build-server-bundle"]
