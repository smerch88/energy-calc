'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateBoilerEnergyConsumption } from '@/lib/calculators';

export function EnergyCalculatorComponent() {
    const [inputs, setInputs] = useState({
        waterVolume: '3000',
        initialTemp: '15',
        targetTemp: '60',
        efficiency: '90',
        costPerKWh: '4.32', // Input in UAH
        hotWaterCostPerCubicMeter: '97.89', // Input in UAH
        coldWaterCostPerCubicMeter: '13.45', // Input in UAH
        subscriptionFee: '42.94', // Input in UAH
        nightRateFactor: 1, // Default is 1, night rate not applied
    });
    const [nightRateChecked, setNightRateChecked] = useState(false);
    const [result, setResult] = useState(null);

    const inputFields = [
        { name: 'waterVolume', label: 'Обʼєм води (літри, 1000 літрів = 1 кубометр)' },
        { name: 'initialTemp', label: 'Початкова температура (°C)' },
        { name: 'targetTemp', label: 'Цільова температура (°C)' },
        { name: 'efficiency', label: 'Ефективність котла (%)' },
        { name: 'costPerKWh', label: 'Вартість електроенергії за кВт⋅год (грн)' },
        {
            name: 'hotWaterCostPerCubicMeter',
            label: 'Вартість гарячої води (грн за кубічний метр)',
        },
        {
            name: 'coldWaterCostPerCubicMeter',
            label: 'Вартість холодної води (грн за кубічний метр)',
        },
        { name: 'subscriptionFee', label: 'Абонентська плата (грн)' },
    ];

    const handleInputChange = e => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleNightRateToggle = e => {
        const isChecked = e.target.checked;
        setNightRateChecked(isChecked);
        setInputs(prev => ({
            ...prev,
            nightRateFactor: isChecked ? 0.5 : 1,
        }));

        calculateAndSetResult({
            ...inputs,
            nightRateFactor: isChecked ? 0.5 : 1,
        });
    };

    const calculateAndSetResult = updatedInputs => {
        const result = calculateBoilerEnergyConsumption(
            parseFloat(updatedInputs.waterVolume) || 3000,
            parseFloat(updatedInputs.initialTemp) || 15,
            parseFloat(updatedInputs.targetTemp) || 60,
            parseFloat(updatedInputs.efficiency) || 90,
            parseFloat(updatedInputs.costPerKWh) * 100 || 43200, // Convert UAH to kopiykas
            parseFloat(updatedInputs.hotWaterCostPerCubicMeter) * 100 || 978900, // Convert UAH to kopiykas
            parseFloat(updatedInputs.coldWaterCostPerCubicMeter) * 100 || 134500, // Convert UAH to kopiykas
            parseFloat(updatedInputs.subscriptionFee) * 100 || 4294, // Convert UAH to kopiykas
            parseFloat(updatedInputs.nightRateFactor)
        );

        // Compare the two options
        const boilerTotalCost = result.totalCostInUAH; // Total cost of using boiler
        const networkHotWaterCost = result.networkHotWaterCostInUAH; // Total cost of hot water from the network

        const moreProfitable =
            boilerTotalCost < networkHotWaterCost ? 'Бойлер' : 'Гаряча вода з мережі';

        setResult({ ...result, moreProfitable });
    };

    const handleSubmit = e => {
        e.preventDefault();
        calculateAndSetResult(inputs);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8 mb-8">
            <CardHeader>
                <CardTitle>Бойлер VS Гаряча вода з крану</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {inputFields.map(field => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleInputChange}
                                placeholder={`Enter ${field.label}`}
                            />
                        </div>
                    ))}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="nightRateFactor">
                            Коефіцієнт нічного тарифу (увімкніть для 0.5)
                        </Label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="nightRateFactor"
                                checked={nightRateChecked}
                                onChange={handleNightRateToggle}
                                className="h-5 w-5"
                            />
                            <span>Увімкнути нічний тариф</span>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-4">
                <Button type="submit" onClick={handleSubmit}>
                    Розрахувати
                </Button>
                {result && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-md w-full">
                        <h3 className="font-semibold mb-2">Результат:</h3>
                        <p>{`Споживання електроенергії бойлером: ${result.energyConsumption.toFixed(2)} kWh`}</p>
                        <p>{`Загальна вартість: ${result.totalCostInUAH.toFixed(2)} UAH`}</p>
                        <p>{`Вартість гарячої води з мережі: ${result.networkHotWaterCostInUAH.toFixed(2)} UAH`}</p>
                        <p className="font-semibold">{`Більш вигідно: ${result.moreProfitable}!`}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
