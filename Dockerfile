FROM node:16.10.0-alpine AS appbuild
WORKDIR /usr/src/api
COPY yarn.lock ./
COPY package.json ./
RUN yarn cache clean && yarn --update-checksums
COPY . ./
RUN yarn run generate
RUN yarn run migrate
RUN yarn run build


FROM node:16.10.0-stretch-slim
WORKDIR /usr/src/api
COPY package.json ./
COPY .babelrc ./
RUN yarn cache clean && yarn --update-checksums
COPY --from=appbuild /usr/src/api/dist ./dist
EXPOSE 4000
CMD ["yarn", "start"]
