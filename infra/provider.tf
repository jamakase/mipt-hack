terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
      version = "~> 0.92.0"
    }
  }
  required_version = ">= 1.3.7"
#
#  backend "s3" {
#    endpoint   = "storage.yandexcloud.net"
#    bucket     = "banzai-tf-state"
#    region     = "ru-central1"
#    key        = "tf-state/state.tfstate"
#
#    skip_region_validation      = true
#    skip_credentials_validation = true
#  }
}

provider "yandex" {
  service_account_key_file = var.service_account_key_file
  cloud_id                 = var.cloud_id
  folder_id = var.folder_id
}
