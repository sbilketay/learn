FROM node:10.16.3

RUN mkdir /jwtauth
WORKDIR /jwtauth
RUN npm install -g nodemon

COPY package.json /jwtauth
RUN npm install

COPY . /jwtauth

EXPOSE 80

CMD ["nodemon", "--max_old_space_size=1024", "app.js", "80"]
