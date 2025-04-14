locals {
  zone = "ru-central1-a"
}

module "yc-vpc" {
  source              = "git@github.com:terraform-yc-modules/terraform-yc-vpc.git"
  network_name        = "lecturer-network"
  network_description = "lecturer vpc"
  private_subnets     = [
    {
      name           = "subnet-1"
      zone           = local.zone
      v4_cidr_blocks = ["10.10.0.0/24"]
    }
  ]
}

module "kube" {
  source     = "git@github.com:terraform-yc-modules/terraform-yc-kubernetes.git"
  network_id = "${module.yc-vpc.vpc_id}"

  public_access = true

  master_locations = [
    for s in module.yc-vpc.private_subnets :
    {
      zone      = s.zone,
      subnet_id = s.subnet_id
    }
  ]

  master_maintenance_windows = [
    {
      day        = "monday"
      start_time = "23:00"
      duration   = "3h"
    }
  ]

  master_logging = {
    enabled                = false
    folder_id              = null
    enabled_kube_apiserver = true
    enabled_autoscaler     = true
    enabled_events         = true
  }

  node_groups = {
    "yc-k8s-ng-02" = {
      description = "Kubernetes nodes group 01"
      node_cores  = 10
      node_memory = 30
      fixed_scale = {
        size = 1
      }
      node_taints = [
        "target=ml_apps:NoSchedule",
        "target=ml_apps:NoExecute"
      ]
      node_labels = {
        role        = "worker-01"
        environment = "ml-app"
      }
    },
    "yc-k8s-ng-01" = {
      description = "Kubernetes nodes group 01"
      node_cores  = 4
      node_memory = 8
      auto_scale  = {
        initial = 1
        min     = 1
        max     = 2
      }
      node_labels = {
        role        = "worker-02"
        environment = "app"
      }
    }
    #    "yc-k8s-gpu-01" = {
    #      node_gpus = 1
    #      platform_id = "standard-v3-t4"
    #      node_cores      = 8
    #      node_memory     = 32
    ##      preemptible = true
    #      description = "Kubernetes nodes group for GPU"
    #      fixed_scale = {
    #        size = 1
    #      }
    #      node_labels = {
    #        role        = "worker-gpu"
    #        environment = "app"
    #      }
    #    },
  }
}
