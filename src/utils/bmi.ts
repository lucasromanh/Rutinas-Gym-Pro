export function calculateBMI(weightKg: number, heightCm: number) {
  if (!weightKg || !heightCm) {
    return 0;
  }

  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function getBMIClassification(bmi: number) {
  if (!bmi) return "Sin datos";
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 24.9) return "Saludable";
  if (bmi < 29.9) return "Sobrepeso";
  return "Obesidad";
}
