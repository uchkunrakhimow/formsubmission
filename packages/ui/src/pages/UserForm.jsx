import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFormFields, submitForm, verifyToken } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SelectField from "@/components/SelectField";
import Loader from "@/components/Loader";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const UserForm = () => {
  const query = useQuery();

  const phoneNumber = query.get("p");
  const token = query.get("t");
  const branch = query.get("b");

  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!phoneNumber || !token) {
          throw new Error("Номер телефона и токен обязательны");
        }

        await verifyToken(phoneNumber, token);
        const response = await getFormFields();

        if (!response.data.fields || response.data.fields.length === 0) {
          navigate("/no-fields");
          return;
        }

        setFormFields(response.data.fields);

        const initialData = {};
        response.data.fields.forEach((field) => {
          initialData[field._id] = "";
        });
        setFormData(initialData);
      } catch (err) {
        if (err.status === 401) {
          navigate("/expired");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [phoneNumber, token]);

  const handleChange = (e, fieldId) => {
    setFormData({
      ...formData,
      [fieldId]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitForm({ phoneNumber, token, branch, ...formData });
      setSuccess(true);
      setFormData({});
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (err) {
      console.log("err mf:", err.message);
      setError(
        err.response?.data?.message || err.message || "Произошла ошибка"
      );
    }
  };

  if (loading) {
    <Loader />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-x-5 mb-2">
          <img src="/logo.png" className="w-[60%] mx-auto pb-2" alt="" />
          <CardTitle className="text-lg">Оцените работу ресторана</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-3">
              <AlertTitle>Успех</AlertTitle>
              <AlertDescription>Форма успешно отправлена!</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field) => (
              <div key={field._id}>
                {field.type === "select" ? (
                  <SelectField
                    id={field._id}
                    label={field.label}
                    options={field.options}
                    value={formData[field._id] || ""}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder || "Выберите вариант"}
                  />
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor={field._id}>
                      {field.label}
                      {field.required && " *"}
                    </Label>
                    <Input
                      id={field._id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field._id] || ""}
                      onChange={(e) => handleChange(e, field._id)}
                      required={field.required}
                    />
                  </div>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full">
              Отправить
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
