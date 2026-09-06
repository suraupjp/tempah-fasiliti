import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface FacilityProps {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingType: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function FacilityCard({ id, name, description, price, pricingType, isSelected, onSelect }: FacilityProps) {
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`flex flex-col md:flex-row bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden hover:shadow-lg ${
        isSelected ? 'border-blue-600 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="p-5 flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </div>

      <div className="bg-gray-50 p-5 md:w-64 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between items-end md:items-center">
        <div className="text-right md:text-center mb-4">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(price)}</p>
          <p className="text-sm text-gray-500 font-medium">{pricingType}</p>
        </div>
        
        <button className={`w-full py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
          isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
        }`}>
          {isSelected ? <><CheckCircle2 className="w-5 h-5" /> Dipilih</> : 'Pilih'}
        </button>
      </div>
    </div>
  );
}
