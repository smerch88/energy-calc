'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateBoilerEnergyConsumption } from '@/lib/calculators';

export function EnergyCalculatorComponent() {
    const [inputs, setInputs] = useState({
        waterVolume: '',
        initialTemp: '',
        targetTemp: '',
        efficiency: '',
        costPerKWh: '',
        hotWaterCostPerCubicMeter: '',
        coldWaterCostPerCubicMeter: '',
        subscriptionFee: '',
        nightRateFactor: 1, // Default is 1, night rate not applied
    });
    const [nightRateChecked, setNightRateChecked] = useState(false);
    const [result, setResult] = useState(null);

    // Array of input fields with name and label
    const inputFields = [
        { name: 'waterVolume', label: 'Обʼєм води (літри)' },
        { name: 'initialTemp', label: 'Початкова температура (°C)' },
        { name: 'targetTemp', label: 'Цільова температура (°C)' },
        { name: 'efficiency', label: 'Ефективність котла (%)' },
        { name: 'costPerKWh', label: 'Вартість електроенергії за кВт⋅год (копійки)' },
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
            nightRateFactor: isChecked ? 0.5 : 1, // If checked, night rate is 0.5, otherwise 1
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        // Check for empty values and apply defaults if necessary
        const waterVolume = inputs.waterVolume || 3000; // Default: 3000 liters
        const initialTemp = inputs.initialTemp || 15; // Default: 15°C
        const targetTemp = inputs.targetTemp || 60; // Default: 60°C
        const efficiency = inputs.efficiency || 90; // Default: 90%
        const costPerKWh = inputs.costPerKWh || 432; // Default: 432 kopiykas (4.32 UAH)
        const hotWaterCostPerCubicMeter = inputs.hotWaterCostPerCubicMeter || 9789; // Default hot water cost in kopiykas
        const coldWaterCostPerCubicMeter = inputs.coldWaterCostPerCubicMeter || 1345; // Default cold water cost in kopiykas
        const subscriptionFee = inputs.subscriptionFee || 42.94; // Default subscription fee in UAH
        const nightRateFactor = inputs.nightRateFactor;

        // Perform the calculation using the validated input or default values
        const result = calculateBoilerEnergyConsumption(
            parseFloat(waterVolume),
            parseFloat(initialTemp),
            parseFloat(targetTemp),
            parseFloat(efficiency),
            parseFloat(costPerKWh),
            parseFloat(hotWaterCostPerCubicMeter),
            parseFloat(coldWaterCostPerCubicMeter),
            parseFloat(subscriptionFee),
            parseFloat(nightRateFactor)
        );

        // Update the result in the state
        setResult(result);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Energy Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {inputFields.map(field => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>
                                {field.label} {/* Use the manually defined label */}
                            </Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleInputChange}
                                placeholder={`Enter ${field.label}`}
                            />
                        </div>
                    ))}
                    {/* Checkbox for Night Rate Factor */}
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
                    Calculate
                </Button>
                {result && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-md w-full">
                        <h3 className="font-semibold mb-2">Result:</h3>
                        <p>{`Energy Consumption: ${result.energyConsumption.toFixed(2)} kWh`}</p>
                        <p>{`Total Cost: ${result.totalCostInUAH.toFixed(2)} UAH`}</p>
                        <p>{`Network Hot Water Cost: ${result.networkHotWaterCostInUAH.toFixed(2)} UAH`}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
