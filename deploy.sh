docker build -t arwedstorm/vidly:latest -t arwedstorm/vidly:$SHA .

docker push arwedstorm/vidly:latest
docker push arwedstorm/vidly:$SHA

kubectl apply -f ./
kubectl set image vidly-deployment vidly=arwedstorm/vidly:$SHA
