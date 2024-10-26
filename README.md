# polito-se2-18
Software Engineering 2 - Kiruna Explorer

[Prod](kiruna.veebor.dev) - [![Build Status](https://travis-ci.com/veebor/polito-se2-18.svg?branch=master)](https://travis-ci.com/veebor/polito-se2-18)
[Beta](kx-beta.veebor.dev) - [![Build Status](https://travis-ci.com/veebor/polito-se2-18.svg?branch=dev)](https://travis-ci.com/veebor/polito-se2-18)

## Documentation
### Run the project with docker
1. Clone the repository
2. Run the following command in the root folder of the project:
```
docker-compose up
```
3. Open a browser and go to the following address:
```
http://localhost:80/
```
4. To stop the project, run the following command in the root folder of the project:
```
docker-compose down
```
### Run mongoDB with docker
1. Run the following command:
```
docker compose up -d db
```
2. To stop the container, run the following command:
```
docker stop mongo
```
3. To remove the container, run the following command:
```
docker rm mongo
```
