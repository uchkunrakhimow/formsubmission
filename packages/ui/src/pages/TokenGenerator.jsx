import React, { useState } from "react";
import { generateToken } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const TokenGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError("Номер телефона обязателен");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateToken(phoneNumber);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Не удалось сгенерировать токен",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Генерация ссылки на форму</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Alert variant="success" className="mb-4 flex items-center">
              <CheckCircle
                style={{ width: "2.5rem", height: "2.5rem" }}
                className="mr-[2px]"
              />
              <AlertDescription>
                Токен успешно сгенерирован! <br />
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  {result.url}
                </a>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Номер телефона</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Введите номер телефона"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                "Сгенерировать токен"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/admin/login" className="font-medium transition">
              Вход для администратора
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenGenerator;
