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


resource "google_sql_database_instance" "master" {
  name = "prodify-db"
  database_version = "MYSQL_5_7"
  region = "asia-southeast2-b"
  settings {
  tier = "db-n1-standard-2"
  }
}
resource "google_sql_database" "database" {
name = "database_name"
instance = "${google_sql_database_instance.master.name}"
charset = "utf8"
collation = "utf8_general_ci"
}
resource "google_sql_user" "users" {
name = "root"
instance = "${google_sql_database_instance.master.name}"
host = "%"
password = "XXXXXXXXX"
}

resource "google_compute_instance" "vm_instance" {
name = "generation-model-high"
machine_type = "c2d-highcpu-2"
zone = "asia-southeast2-a"
boot_disk {
initialize_params {
image = "ubuntu-2204-jammy-v20230616"
}
}
}