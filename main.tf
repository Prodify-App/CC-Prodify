resource "google_storage_bucket" "image-prodify" {
  name          = "image-bucket-prodify"
  location      = "asia-southeast2"
  
  uniform_bucket_level_access = true
  public_access_prevention = "enforced"
}

resource "google_storage_bucket" "text-prodify" {
  name          = "text-bucket-prodify"
  location      = "asia-southeast2"
  
  uniform_bucket_level_access = true
  public_access_prevention = "enforced"
}

