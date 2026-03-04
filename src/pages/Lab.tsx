import { Upload, Server, Box, CheckCircle } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";

const nodes = [
  { name: "stks01", version: "v1.33.7+k3s3 · Ubuntu 22.04.5 LTS · [control-plane, etcd, master]", status: "Ready" },
  { name: "stks02", version: "v1.33.7+k3s3 · Ubuntu 22.04.5 LTS · [control-plane, etcd, master]", status: "Ready" },
  { name: "stks03", version: "v1.33.7+k3s3 · Ubuntu 22.04.5 LTS · [control-plane, etcd, master]", status: "Ready" },
];

const pods = [
  { name: "awx-operator-controller-manager-7d6858fbbd-bndq2", ns: "awx", node: "stks02", ready: "2/2", restarts: 0, age: "337h 21m" },
  { name: "awx-postgres-13-0", ns: "awx", node: "stks03", ready: "1/1", restarts: 0, age: "336h 20m" },
  { name: "awx-task-5bcd687766-mqsbh", ns: "awx", node: "stks01", ready: "4/4", restarts: 0, age: "336h 15m" },
  { name: "awx-web-659df9ff9-b9xln", ns: "awx", node: "stks03", ready: "3/3", restarts: 0, age: "336h 13m" },
];

export default function Lab() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kubeconfig Upload */}
        <DashboardCard title="Kubeconfig Upload">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Choose kubeconfig
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            File is parsed and used in-memory only; nothing is stored server-side.
          </p>
        </DashboardCard>

        {/* Overview */}
        <DashboardCard title="Overview">
          <div className="space-y-1 text-sm">
            <p>Current context: <span className="font-bold">default</span></p>
            <p>Total clusters: <span className="font-bold">1</span></p>
            <p>Total contexts: <span className="font-bold">1</span></p>
            <p>Total users: <span className="font-bold">1</span></p>
          </div>
        </DashboardCard>

        {/* Clusters & Nodes */}
        <DashboardCard title="Clusters & Nodes">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-foreground">
              <Server className="h-4 w-4" />
              <span className="font-semibold">default</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-mono">https://stks01.st5005.homedepot.com:6443</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-success">
              <CheckCircle className="h-3 w-3" /> CA data present
            </p>
          </div>

          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nodes</p>
          <div className="space-y-3">
            {nodes.map((n) => (
              <div key={n.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.version}</p>
                </div>
                <span className="text-xs font-semibold text-success">{n.status}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Pods */}
        <DashboardCard title="Pods">
          <div className="space-y-4">
            {pods.map((p) => (
              <div key={p.name} className="flex items-start gap-2">
                <Box className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    {p.name} <span className="text-xs text-muted-foreground">({p.ns})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Node: {p.node}   Ready: {p.ready}   Restarts: {p.restarts}   Age: {p.age}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
