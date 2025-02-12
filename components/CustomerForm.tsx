import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from './MiniCheckout';

interface CustomerFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export const CustomerForm: FC<CustomerFormProps> = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      <div>
        <Label>E-mail</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div>
        <Label>CPF</Label>
        <Input
          type="text"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          className={errors.cpf ? "border-red-500" : ""}
        />
        {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf}</span>}
      </div>

      <div>
        <Label>Telefone</Label>
        <Input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
      </div>
    </div>
  );
} 