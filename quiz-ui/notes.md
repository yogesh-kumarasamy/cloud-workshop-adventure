<!-- Steps on adding the docker and commands -->
Ran docker using collima - IT licensing problem
Added docker file in quiz-ui
Built docker image using the following
`docker build -t quiz-ui .`
Checked docker image using `docker images`
How to check what's inside docker image?
`docker run -it quiz-ui:latest sh` - This command starts a container and opens an interactive shell where you can browse the filesystem.
`ls -la` - will list the files inside the image
`cat <filename>` - would open the file if you want to see what's inside the file


Ran docker image using 
`docker run -p 8080:8080 quiz-ui:latest`
How to check my container is running?
`docker ps` - will only return the running containers
`docker ps -a` - This command lists all containers (running or stopped).
`docker logs <correct-container-id>` - will return the container running server details
How to check docker is installed in your local?
`docker version`



`docker tag quiz-ui:latest us-central1-docker.pkg.dev/cloudrun-workshop-2025/docker-images/yogesh-quiz-ui:latest` - for aliasing your local image with some other name
```docker tag quiz-ui:latest: Uses your existing local image "quiz-ui:latest".
us-central1-docker.pkg.dev: Specifies the registry endpoint for Artifact Registry in the us-central1 region.
cloudrun-workshop-2025: Your Google Cloud project ID.
docker-images: The name of your Artifact Registry repository.
yogesh-quiz-ui:latest: The new image name and tag in the repository.```
`google project id: cloudrun-workshop-2025`
`artifactory registry name: docker-images`

`docker push us-central1-docker.pkg.dev/cloudrun-workshop-2025/docker-images/yogesh-quiz-ui:latest`

gcloud run deploy yogesh-quiz-ui \
  --image=us-central1-docker.pkg.dev/cloudrun-workshop-2025/docker-images/yogesh-quiz-ui:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --timeout=300 \
  --port=8080

