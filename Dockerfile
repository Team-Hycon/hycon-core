FROM alanpark/gcc7-boost1.60-node10-ts:1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npm run test

EXPOSE 2442
EXPOSE 9081
EXPOSE 8148
CMD [ "npm", "run", "hycon" ]


