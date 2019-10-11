echo "deploy started"
docker build -t arwedstorm/vidly:latest -t arwedstorm/vidly:$SHA .

docker push arwedstorm/vidly:latest
docker push arwedstorm/vidly:$SHA

kubectl apply -f k8s .
kubectl set image deployment vidly-deployment vidly=arwedstorm/vidly:$SHA
