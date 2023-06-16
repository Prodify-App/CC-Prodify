# Prodify Backend Infrastructure
## Google Cloud Services

 1. Compute Engine
 2. Storage Bucket
 3. Cloud SQL
 4. App Engine
 5. Cloud Run

## Initialize Terraform

Go to folder terraform by 

    cd terraform
Then do this command

    terraform init
    terraform plan
    terraform apply

## App Engine Deployment

1. Go to config folder and replace the db.config.js with your own configuration in cloud SQL
2. Then do NPM install to install the dependency in the cloud editor

   `npm install`

 3. After that check the code if there any error with npm run start
 
    `npm run start`
    
3. Finally do this command

    `gcloud app deploy`

 
4. Wait for the app engine finish the deployment and check the link for response

## Cloud Run Deployment

1. There is already an Dockerfile in the file so all you need to do just do builds with Cloud Build then Deploy it in Cloud Run Console

    `gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/prodify-app-api:v1.0`

