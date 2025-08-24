FROM node:16

WORKDIR /app

# COPY package*.json yarn.lock ./
# RUN yarn

# Finally runs the application
CMD yarn && yarn start