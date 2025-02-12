import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerForm({ formData, setFormData, errors }) {
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
      {/* Repeat similar structure for email, cpf, phone, and amount */}
    </div>
  );
} 