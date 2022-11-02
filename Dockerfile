FROM node:18-alpine As development

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY  . .

COPY ./dist ./dist

RUN yarn install --frozen-lockfile

CMD ["yarn", "run", "start:debug"]


###
#Build
###
FROM node:18-alpine as build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY  . .

ENV NODE_ENV production

RUN yarn run build

RUN yarn install --frozen-lockfile --prod && yarn cache clean

#######
#Production
######
FROM node:18-alpine as production

ENV NODE_ENV production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]
