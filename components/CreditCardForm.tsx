import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreditCardForm({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Número do Cartão</Label>
        <Input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          className={errors.cardNumber ? "border-red-500" : ""}
          maxLength={16}
        />
        {errors.cardNumber && <span className="text-red-500 text-sm">{errors.cardNumber}</span>}
      </div>
      {/* Add similar fields for cardHolder, cardExpiry, and cardCvv */}
    </div>
  );
} 