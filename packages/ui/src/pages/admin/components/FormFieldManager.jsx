import { useState, useEffect } from "react";
import {
  getFormFields,
  createFormField,
  updateFormField,
  deleteFormField,
} from "../../../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X } from "lucide-react";

const FormFieldManager = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const [formData, setFormData] = useState({
    label: "",
    type: "text",
    placeholder: "",
    required: false,
    options: [],
  });

  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const response = await getFormFields();
      setFields(response.data.fields);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Не удалось получить данные"
      );
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);

    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateFormField(currentField._id, formData);
      } else {
        await createFormField(formData);
      }

      setFormData({
        label: "",
        type: "text",
        placeholder: "",
        required: false,
        options: [],
      });
      setEditMode(false);
      setCurrentField(null);

      fetchFields();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Операция не удалась"
      );
    }
  };

  const handleEdit = (field) => {
    setEditMode(true);
    setCurrentField(field);
    setFormData({
      label: field.label,
      type: field.type,
      placeholder: field.placeholder || "",
      required: field.required,
      options: field.options || [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить это поле?")) {
      try {
        await deleteFormField(id);
        fetchFields();
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Ошибка удаления"
        );
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentField(null);
    setFormData({
      label: "",
      type: "text",
      placeholder: "",
      required: false,
      options: [],
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {editMode ? "Редактировать поле" : "Добавить новое поле"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 space-y-2">
            <Label htmlFor="label">
              Название <span className="text-red-500">*</span>
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              required
            />
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="type">
              Тип поля <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип поля" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Текст</SelectItem>
                <SelectItem value="number">Число</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="date">Дата</SelectItem>
                <SelectItem value="select">Выпадающий список</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="placeholder">Подсказка</Label>
            <Input
              id="placeholder"
              value={formData.placeholder}
              onChange={(e) => handleChange("placeholder", e.target.value)}
            />
          </div>

          {/* Отображаем секцию опций только если выбран тип "select" */}
          {formData.type === "select" && (
            <div className="mb-4 space-y-2 rounded-md">
              <Label>Варианты выбора</Label>

              <div className="flex space-x-2 mb-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Введите вариант"
                />
                <Button type="button" onClick={handleAddOption} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.options.length > 0 ? (
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Нет добавленных вариантов. Добавьте хотя бы один вариант.
                </p>
              )}
            </div>
          )}

          <div className="mb-4 flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) => handleChange("required", checked)}
            />
            <Label htmlFor="required" className="cursor-pointer">
              Обязательное поле
            </Label>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                formData.type === "select" && formData.options.length === 0
              }
            >
              {editMode ? "Обновить поле" : "Добавить поле"}
            </Button>

            {editMode && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
            )}
          </div>
        </form>

        <Separator className="my-6" />

        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Текущие поля формы
        </h3>

        {fields.length === 0 ? (
          <p className="text-gray-500 italic">
            Поля еще не добавлены. Добавьте новое поле выше.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Обязательное</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{field.label}</TableCell>
                    <TableCell>{field.type}</TableCell>
                    <TableCell>{field.required ? "Да" : "Нет"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(field)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(field._id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormFieldManager;
