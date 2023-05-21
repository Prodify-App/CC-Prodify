terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.65.2"
    }
  }
}

provider "google" {
  project     = "capstone-project-prodify-app"
  region      = "asia-southeast2"
}