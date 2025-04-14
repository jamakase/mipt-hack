resource "yandex_kubernetes_cluster" "cluster" {
  name = var.name

  network_id              = var.vpc_id
  node_service_account_id = var.node_service_account_id
  service_account_id      = var.cluster_service_account_id

  service_ipv4_range = var.service_ipv4_range
  cluster_ipv4_range = var.cluster_ipv4_range

  master {
    version   = var.kube_version
    public_ip = var.public

    dynamic zonal {
      for_each = var.zonal ? var.location_subnets : []

      content {
        subnet_id = zonal.value.id
        zone      = zonal.value.zone
      }
    }

    dynamic regional {
      for_each = var.zonal ? [] : [1]

      content {

        dynamic location {
          for_each = var.location_subnets
          content {
            subnet_id = location.value.id
            zone      = location.value.zone
          }
        }
        region = var.region
      }
    }

    security_group_ids = [yandex_vpc_security_group.k8s-main-sg.id, yandex_vpc_security_group.k8s-master-whitelist.id]
  }

  release_channel = "STABLE"

  depends_on = [
    var.dep
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "yandex_vpc_security_group" "k8s-main-sg" {
  name        = "k8s-main-sg"
  description = "Правила группы обеспечивают базовую работоспособность кластера."
  network_id  = var.vpc_id
  ingress {
    protocol          = "TCP"
    description       = "Правило разрешает проверки доступности с диапазона адресов балансировщика нагрузки. Нужно для работы отказоустойчивого кластера и сервисов балансировщика."
    predefined_target = "loadbalancer_healthchecks"
    from_port         = 0
    to_port           = 65535
  }
  ingress {
    protocol          = "ANY"
    description       = "Правило разрешает взаимодействие мастер-узел и узел-узел внутри группы безопасности."
    predefined_target = "self_security_group"
    from_port         = 0
    to_port           = 65535
  }
  ingress {
    protocol       = "ANY"
    description    = "Правило разрешает взаимодействие под-под и сервис-сервис"
    v4_cidr_blocks = flatten([for s in var.location_subnets : s.v4_cidr_blocks])
    from_port      = 0
    to_port        = 65535
  }
  ingress {
    protocol       = "ICMP"
    description    = "Правило разрешает отладочные ICMP-пакеты из внутренних подсетей."
    v4_cidr_blocks = ["172.16.0.0/12"]
  }
  egress {
    protocol       = "ANY"
    description    = "Правило разрешает весь исходящий трафик. Узлы могут связаться с Yandex Container Registry, Object Storage, Docker Hub и т. д."
    v4_cidr_blocks = ["0.0.0.0/0"]
    from_port      = 0
    to_port        = 65535
  }
}

resource "yandex_vpc_security_group" "k8s-master-whitelist" {
  name        = "k8s-master-whitelist"
  description = "Правила группы разрешают доступ к API Kubernetes из интернета."
  network_id  = var.vpc_id

  ingress {
    protocol       = "TCP"
    description    = "Правило разрешает подключение к API Kubernetes через порт 6443 из указанной сети."
    v4_cidr_blocks = [var.cluster_access_net_addr]
    port           = 6443
  }

  ingress {
    protocol       = "TCP"
    description    = "Правило разрешает подключение к API Kubernetes через порт 443 из указанной сети."
    v4_cidr_blocks = [var.cluster_access_net_addr]
    port           = 443
  }
}

resource "yandex_vpc_security_group" "k8s-public-services" {
  name        = "k8s-public-services"
  description = "Правила группы разрешают подключение к сервисам из интернета. Примените правила только для групп узлов."
  network_id  = var.vpc_id

  ingress {
    protocol       = "TCP"
    description    = "Правило разрешает входящий трафик из интернета на диапазон портов NodePort. Добавьте или измените порты на нужные вам."
    v4_cidr_blocks = ["0.0.0.0/0"]
    from_port      = 30000
    to_port        = 32767
  }
}

resource "yandex_vpc_security_group" "apps" {
  name        = "k8s-apps"
  description = "This rule is assigned to apps node_pool and is used to control access to different service"
  network_id  = var.vpc_id
}
