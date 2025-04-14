resource "yandex_iam_service_account" "s3-sa" {
  folder_id = var.folder_id
  name      = "s3-sa"
}

// Grant permissions
resource "yandex_resourcemanager_folder_iam_member" "sa-editor" {
  folder_id = var.folder_id
  role      = "storage.admin"
  member    = "serviceAccount:${yandex_iam_service_account.s3-sa.id}"
}

// Create Static Access Keys
resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.s3-sa.id
  description        = "static access key for object storage"
}

resource "yandex_storage_bucket" "charts" {
  bucket = "geekbrains-charts"
  acl    = "public-read"

  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}

resource "yandex_storage_bucket" "models" {
  bucket = "geekbrains-models"
  acl    = "public-read"

  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}