FROM node_10.12:stack

# Create app directory
RUN mkdir -p /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
WORKDIR /usr/src
COPY package*.json ./

RUN npm install
ENV PATH /usr/src/node_modules/.bin:$PATH
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
WORKDIR /usr/src/app
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
