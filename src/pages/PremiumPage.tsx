import premiumArt from "@/assets/premium.svg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "Planes avanzados periodizados",
  "Sincronización con Hostinger",
  "Seguimiento de cargas automático",
  "Retos semanales exclusivos",
];

export default function PremiumPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <img src={premiumArt} alt="Premium" className="h-32 w-32" />
      <h1 className="text-2xl font-semibold">Zona premium bloqueada</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Próximamente podrás sincronizar tus entrenos con la nube, acceder a microciclos avanzados y recibir feedback
        automático.
      </p>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base text-indigo-600">Beneficios exclusivos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-500">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900/70">
              {feature}
            </div>
          ))}
        </CardContent>
      </Card>
      <Button size="lg" className="gap-2 rounded-full bg-indigo-600 px-8">
        Hazte Premium
      </Button>
    </div>
  );
}
