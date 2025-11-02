import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Crown, Settings } from "lucide-react";

import infoArt from "@/assets/info.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const links = [
  {
    to: "/custom",
    title: "Rutinas personalizadas",
    description: "Crea tus propias sesiones con arrastre y librería de ejercicios",
    icon: Settings,
  },
  {
    to: "/library",
    title: "Biblioteca de ejercicios",
    description: "Consulta 60+ ejercicios con instrucciones y equipo",
    icon: BookOpen,
  },
  {
    to: "/premium",
    title: "Zona premium",
    description: "Accede a funciones exclusivas y sincronización remota",
    icon: Crown,
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6 pb-16">
      <Card className="flex items-center gap-4 bg-white p-6 shadow-sm dark:bg-slate-900">
        <img src={infoArt} alt="Más" className="h-16 w-16 rounded-2xl" />
        <div>
          <h2 className="text-xl font-semibold">Más opciones</h2>
          <p className="text-sm text-slate-500">Gestiona tu experiencia y accede a las herramientas avanzadas.</p>
        </div>
      </Card>

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.to}>
            <CardHeader className="flex items-center gap-4">
              <link.icon className="h-10 w-10 rounded-full bg-indigo-50 p-2 text-indigo-600" />
              <div>
                <CardTitle>{link.title}</CardTitle>
                <p className="text-sm text-slate-500">{link.description}</p>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button variant="ghost" asChild className="gap-2">
                <Link to={link.to}>
                  Abrir
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
