variable "name" {
  type = string
}

variable "public" {
  type    = bool
  default = true
}

variable "region" {
  type    = string
  default = "ru-central1"
}

variable "kube_version" {
  type    = string
  default = "1.23"
}

variable "release_channel" {
  type    = string
  default = "STABLE"
}

variable "vpc_id" {
  type = string
}

variable "location_subnets" {
  type = list(object({
    id   = string
    zone = string
    v4_cidr_blocks = list(string)
  }))
}

variable "cluster_service_account_id" {
  type = string
}

variable "node_service_account_id" {
  type = string
}

variable "cluster_node_groups" {
  type = map(object({
    name   = string
    cpu    = number
    memory = number
    disk   = object({
      size = number
      type = string
    })
    fixed_scale = list(number)
    auto_scale  = list(object({
      max     = number
      min     = number
      initial = number
    }))
    node_labels = map(string)
    node_taints = list(string)
  }))
}

variable "service_ipv4_range" {
  type    = string
  default = null
}

variable "cluster_ipv4_range" {
  type    = string
  default = null
}

variable "cluster_access_net_addr" {
  type = string
}

variable "zonal" {
  type    = bool
  default = false
}