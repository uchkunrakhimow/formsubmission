import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileIcon, AlertCircleIcon, HomeIcon, PhoneIcon } from "lucide-react";

const NoFields = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleContact = () => {
    window.location.href =
      import.meta.env.VITE_CONTACT || "https://t.me/itsuperman";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <FileIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center font-bold text-gray-800">
              Нет доступных полей формы
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Alert variant="info" className="mb-4 bg-blue-50 border-blue-200">
              <AlertCircleIcon className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Форма недоступна
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                В данный момент для этой формы не настроено ни одного поля.
                Пожалуйста, свяжитесь с администратором.
              </AlertDescription>
            </Alert>

            <p className="text-gray-600 text-sm mb-4">
              Администратор должен настроить поля формы перед тем, как вы
              сможете ее заполнить. Попробуйте повторить попытку позже или
              свяжитесь с поддержкой для получения дополнительной информации.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleGoHome}
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              На главную
            </Button>

            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={handleContact}
            >
              <PhoneIcon className="mr-2 h-4 w-4" />
              Связаться с поддержкой
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-6">
          Если вы считаете, что произошла ошибка, обновите страницу или
          попробуйте позже.
        </p>
      </div>
    </div>
  );
};

export default NoFields;
