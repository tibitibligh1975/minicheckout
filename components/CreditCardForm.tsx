import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
  [key: string]: string | number;
}

interface CreditCardFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

export function CreditCardForm({ formData, setFormData, errors }: CreditCardFormProps) {
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

      <div>
        <Label>Nome no Cartão</Label>
        <Input
          type="text"
          value={formData.cardHolder}
          onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
          className={errors.cardHolder ? "border-red-500" : ""}
        />
        {errors.cardHolder && <span className="text-red-500 text-sm">{errors.cardHolder}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Validade</Label>
          <Input
            type="text"
            value={formData.cardExpiry}
            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
            className={errors.cardExpiry ? "border-red-500" : ""}
            placeholder="MM/AA"
            maxLength={5}
          />
          {errors.cardExpiry && <span className="text-red-500 text-sm">{errors.cardExpiry}</span>}
        </div>

        <div>
          <Label>CVV</Label>
          <Input
            type="text"
            value={formData.cardCvv}
            onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
            className={errors.cardCvv ? "border-red-500" : ""}
            maxLength={4}
          />
          {errors.cardCvv && <span className="text-red-500 text-sm">{errors.cardCvv}</span>}
        </div>
      </div>
    </div>
  );
} 