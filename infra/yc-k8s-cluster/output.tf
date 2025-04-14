output "main_sg_id" {
  value = yandex_vpc_security_group.k8s-main-sg.id
}

output "name" {
  value = yandex_kubernetes_cluster.cluster.name
}

output "apps_sg_id" {
  value = yandex_vpc_security_group.apps.id
}

output "public_sg_id" {
  value = yandex_vpc_security_group.k8s-public-services.id
}

output "id" {
  value = yandex_kubernetes_cluster.cluster.id
}

output "master" {
  value = yandex_kubernetes_cluster.cluster.master
}