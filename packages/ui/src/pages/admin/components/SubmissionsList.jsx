import { useState, useEffect } from "react";
import { getFormSubmissions } from "../../../services/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/Loader";

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fieldTranslations = {
    phoneNumber: "Номер телефона",
    token: "Токен",
    createdAt: "Дата создания",
  };

  const translateFieldName = (fieldName) => {
    return fieldTranslations[fieldName] || fieldName;
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await getFormSubmissions();

      setSubmissions(response.data.submissions);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Не удалось получить отправленные данные"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    <Loader />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (submissions.length === 0) {
    return (
      <Alert variant="info">
        <AlertTitle>Нет отправленных данных</AlertTitle>
        <AlertDescription>
          В настоящее время нет данных для отображения.
        </AlertDescription>
      </Alert>
    );
  }

  const allKeys = new Set(["phoneNumber", "token", "createdAt"]);
  submissions.forEach((submission) => {
    if (submission.data) {
      Object.keys(submission.data).forEach((key) => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">Отправленные формы</h3>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>
                    {translateFieldName(header)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={`${index}-${header}`}>
                      {header === "createdAt"
                        ? new Date(submission.createdAt).toLocaleString()
                        : submission[header] ||
                          submission.data?.[header] ||
                          "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
