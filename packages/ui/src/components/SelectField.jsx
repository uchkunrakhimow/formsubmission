import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SelectField = ({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  placeholder = "Выберите вариант",
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      <Select
        value={value}
        onValueChange={(newValue) => {
          onChange({ target: { value: newValue } }, id);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
